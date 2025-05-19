import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { message: '请先登录' },
        { status: 401 }
      );
    }

    const { title, content, published, tags } = await req.json();

    if (!title || !content) {
      return NextResponse.json(
        { message: '标题和内容不能为空' },
        { status: 400 }
      );
    }

    // 创建文章
    const post = await prisma.post.create({
      data: {
        title,
        content,
        published: published || false,
        authorId: session.user.id,
      },
    });

    // 处理标签
    if (tags && Array.isArray(tags) && tags.length > 0) {
      // 为每个标签创建或获取已存在的标签，并与文章关联
      await Promise.all(
        tags.map(async (tagName: string) => {
          const tag = await prisma.tag.upsert({
            where: { name: tagName },
            update: {},
            create: { name: tagName },
          });

          await prisma.postTag.create({
            data: {
              postId: post.id,
              tagId: tag.id,
              assignedBy: session.user.id,
            },
          });
        })
      );
    }

    // 获取包含标签的完整文章数据
    const postWithTags = await prisma.post.findUnique({
      where: { id: post.id },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: '发布成功',
        post: postWithTags,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('发布文章错误:', error);
    return NextResponse.json(
      { message: '发布文章时发生错误' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const authorId = searchParams.get('authorId');
    const tag = searchParams.get('tag');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // 构建查询条件
    const where = {
      published: true,
      ...(authorId && { authorId }),
      ...(tag && {
        tags: {
          some: {
            tag: {
              name: tag,
            },
          },
        },
      }),
    };

    // 获取总数
    const total = await prisma.post.count({ where });

    // 获取分页数据
    const posts = await prisma.post.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limit,
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

    return NextResponse.json({
      posts,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('获取文章列表错误:', error);
    return NextResponse.json(
      { message: '获取文章列表时发生错误' },
      { status: 500 }
    );
  }
}
