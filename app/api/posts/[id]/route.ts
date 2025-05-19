import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { message: '请先登录' },
        { status: 401 }
      );
    }

    const post = await prisma.post.findUnique({
      where: { id: params.id },
      select: { authorId: true },
    });

    if (!post) {
      return NextResponse.json(
        { message: '文章不存在' },
        { status: 404 }
      );
    }

    if (post.authorId !== session.user.id) {
      return NextResponse.json(
        { message: '无权删除此文章' },
        { status: 403 }
      );
    }

    // 删除文章及其相关的标签关联
    await prisma.post.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: '删除成功' });
  } catch (error) {
    console.error('删除文章错误:', error);
    return NextResponse.json(
      { message: '删除文章时发生错误' },
      { status: 500 }
    );
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const post = await prisma.post.findUnique({
      where: { id: params.id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    if (!post) {
      return NextResponse.json(
        { message: '文章不存在' },
        { status: 404 }
      );
    }

    const session = await getServerSession(authOptions);
    
    // 如果文章未发布，只有作者可以查看
    if (!post.published && post.authorId !== session?.user?.id) {
      return NextResponse.json(
        { message: '无权访问此文章' },
        { status: 403 }
      );
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('获取文章错误:', error);
    return NextResponse.json(
      { message: '获取文章时发生错误' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { message: '请先登录' },
        { status: 401 }
      );
    }

    const post = await prisma.post.findUnique({
      where: { id: params.id },
      select: { authorId: true },
    });

    if (!post) {
      return NextResponse.json(
        { message: '文章不存在' },
        { status: 404 }
      );
    }

    if (post.authorId !== session.user.id) {
      return NextResponse.json(
        { message: '无权编辑此文章' },
        { status: 403 }
      );
    }

    const { title, content, published, tags } = await req.json();

    if (!title || !content) {
      return NextResponse.json(
        { message: '标题和内容不能为空' },
        { status: 400 }
      );
    }

    // 更新文章
    const updatedPost = await prisma.post.update({
      where: { id: params.id },
      data: {
        title,
        content,
        published,
      },
    });

    // 如果提供了标签，更新标签
    if (tags && Array.isArray(tags)) {
      // 删除现有的标签关联
      await prisma.postTag.deleteMany({
        where: { postId: params.id },
      });

      // 创建新的标签关联
      await Promise.all(
        tags.map(async (tagName: string) => {
          const tag = await prisma.tag.upsert({
            where: { name: tagName },
            update: {},
            create: { name: tagName },
          });

          await prisma.postTag.create({
            data: {
              postId: params.id,
              tagId: tag.id,
              assignedBy: session.user.id,
            },
          });
        })
      );
    }

    // 获取更新后的完整文章数据
    const postWithTags = await prisma.post.findUnique({
      where: { id: params.id },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    return NextResponse.json({
      message: '更新成功',
      post: postWithTags,
    });
  } catch (error) {
    console.error('更新文章错误:', error);
    return NextResponse.json(
      { message: '更新文章时发生错误' },
      { status: 500 }
    );
  }
}
