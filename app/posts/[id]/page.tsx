import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import Link from 'next/link';
import DeletePostButton from '@/components/DeletePostButton';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

async function getPost(id: string) {
  const post = await prisma.post.findUnique({
    where: { id },
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
    return null;
  }

  return post;
}

export default async function PostPage({
  params,
}: {
  params: { id: string };
}) {
  // Ensure params is awaited if it's a promise, or directly access id if not.
  // For Next.js App Router, params are directly available.
  const postId = params.id;
  const post = await getPost(postId);
  const session = await getServerSession(authOptions);

  if (!post) {
    notFound();
  }

  const isAuthor = session?.user?.id === post.authorId;
  const formattedDate = new Date(post.createdAt).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen py-12">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-elegant overflow-hidden">
          <div className="p-8 md:p-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-primary-800">
                {post.title}
              </h1>
              {isAuthor && (
                <div className="flex items-center space-x-4">
                  <Link
                    href={`/posts/${post.id}/edit`}
                    className="inline-flex items-center text-primary-600 hover:text-primary-800 font-medium"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    编辑
                  </Link>
                  <DeletePostButton postId={post.id} />
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center text-gray-600 text-sm mb-8 border-b border-gray-100 pb-4">
              <span className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full mr-3">
                作者：{post.author.name || '匿名'}
              </span>
              <span className="bg-secondary-50 text-secondary-700 px-3 py-1 rounded-full">
                {formattedDate}
              </span>
              {!post.published && (
                <span className="ml-3 bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full">
                  草稿
                </span>
              )}
            </div>

            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {post.tags.map(({ tag }) => (
                  <Link
                    key={tag.id}
                    href={`/?tag=${encodeURIComponent(tag.name)}`}
                    className="px-3 py-1 bg-primary-100 text-primary-700 text-sm rounded-full hover:bg-primary-200 transition-colors"
                  >
                    {tag.name}
                  </Link>
                ))}
              </div>
            )}

            <div className="prose prose-lg max-w-none">
              {post.content.split('\n').map((paragraph, index) => (
                paragraph ? (
                  <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                    {paragraph}
                  </p>
                ) : <br key={index} />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 bg-white border border-primary-200 rounded-lg text-primary-700 hover:bg-primary-50 transition-colors shadow-sm"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            返回首页
          </Link>
        </div>
      </article>
    </div>
  );
}
