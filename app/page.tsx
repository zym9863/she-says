import { prisma } from '@/lib/db';
import Link from 'next/link';

async function getLatestPosts() {
  const posts = await prisma.post.findMany({
    where: {
      published: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 10,
    include: {
      author: {
        select: {
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
  return posts;
}

export default async function Home() {
  const posts = await getLatestPosts();

  return (
    <div className="min-h-screen">
      {/* 头部Banner */}
      <div className="bg-gradient-to-r from-primary-700 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-serif font-bold text-center mb-6 text-white">
            欢迎来到「她说」
          </h1>
          <p className="text-xl text-center text-white/90 max-w-2xl mx-auto">
            这里是分享故事和感悟的地方，让每个声音都被倾听
          </p>
          <div className="mt-10 flex justify-center">
            <Link
              href="/posts/new"
              className="bg-white text-primary-700 px-8 py-3 rounded-lg font-medium hover:bg-primary-50 transition-colors shadow-md hover:shadow-lg"
            >
              分享你的故事
            </Link>
          </div>
        </div>
      </div>

      {/* 特色内容 */}
      <div className="bg-primary-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold mb-4">为什么选择「她说」</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">一个专注于分享个人故事和感悟的平台，让每个人的声音都能被听见</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-soft">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-serif font-bold mb-2">分享你的故事</h3>
              <p className="text-gray-600">每个人都有值得分享的故事，在这里你可以自由表达</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-soft">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-serif font-bold mb-2">连接志同道合的人</h3>
              <p className="text-gray-600">找到与你有共鸣的人，建立有意义的联系</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-soft">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-serif font-bold mb-2">安全的表达空间</h3>
              <p className="text-gray-600">我们致力于创造一个尊重、包容的社区环境</p>
            </div>
          </div>
        </div>
      </div>

      {/* 最新内容 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-serif font-bold mb-8">最新分享</h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              href={`/posts/${post.id}`}
              key={post.id}
              className="card group"
            >
              <div className="p-6">
                <h3 className="text-xl font-serif font-bold text-primary-800 mb-3 group-hover:text-primary-600 transition-colors">
                  {post.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.content.length > 120
                    ? `${post.content.slice(0, 120)}...`
                    : post.content}
                </p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    作者：{post.author.name || '匿名'}
                  </span>
                  <span className="text-primary-600 group-hover:text-primary-800 font-medium">
                    阅读全文 &rarr;
                  </span>
                </div>
                {post.tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {post.tags.map(({ tag }) => (
                      <span
                        key={tag.id}
                        className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full"
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">暂无内容，成为第一个分享故事的人吧！</p>
            <Link href="/posts/new" className="mt-4 inline-block btn-primary">
              发布新故事
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
