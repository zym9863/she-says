import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/db';
import Link from 'next/link';

async function getUserPosts(userId: string) {
  const posts = await prisma.post.findMany({
    where: {
      authorId: userId,
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      tags: {
        include: {
          tag: true,
        },
      },
    },
  });

  return posts;
}

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    notFound();
  }

  const posts = await getUserPosts(session.user.id);
  const publishedPosts = posts.filter(post => post.published);
  const drafts = posts.filter(post => !post.published);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* 个人信息 */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {session.user.name || '未设置昵称'}
                </h1>
                <p className="text-gray-600">{session.user.email}</p>
              </div>
              <Link
                href="/posts/new"
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                发布新故事
              </Link>
            </div>
          </div>

          {/* 已发布的文章 */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">
                已发布的故事
                <span className="ml-2 text-sm text-gray-500">
                  ({publishedPosts.length})
                </span>
              </h2>
            </div>
            <div className="divide-y divide-gray-200">
              {publishedPosts.map((post) => (
                <div key={post.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <Link
                      href={`/posts/${post.id}`}
                      className="text-lg font-medium text-indigo-600 hover:text-indigo-800"
                    >
                      {post.title}
                    </Link>
                    <span className="text-sm text-gray-500">
                      {new Date(post.createdAt).toLocaleDateString('zh-CN')}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">
                    {post.content.length > 100
                      ? `${post.content.slice(0, 100)}...`
                      : post.content}
                  </p>
                  {post.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {post.tags.map(({ tag }) => (
                        <span
                          key={tag.id}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                        >
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {publishedPosts.length === 0 && (
                <div className="p-6 text-center text-gray-500">
                  暂无已发布的故事
                </div>
              )}
            </div>
          </div>

          {/* 草稿 */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">
                草稿箱
                <span className="ml-2 text-sm text-gray-500">
                  ({drafts.length})
                </span>
              </h2>
            </div>
            <div className="divide-y divide-gray-200">
              {drafts.map((draft) => (
                <div key={draft.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <Link
                      href={`/posts/${draft.id}`}
                      className="text-lg font-medium text-gray-600 hover:text-gray-800"
                    >
                      {draft.title || '无标题草稿'}
                    </Link>
                    <span className="text-sm text-gray-500">
                      {new Date(draft.createdAt).toLocaleDateString('zh-CN')}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    {draft.content.length > 100
                      ? `${draft.content.slice(0, 100)}...`
                      : draft.content}
                  </p>
                  <div className="mt-4 flex items-center space-x-4">
                    <Link
                      href={`/posts/${draft.id}/edit`}
                      className="text-sm text-indigo-600 hover:text-indigo-800"
                    >
                      继续编辑
                    </Link>
                  </div>
                </div>
              ))}
              {drafts.length === 0 && (
                <div className="p-6 text-center text-gray-500">
                  暂无草稿
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
