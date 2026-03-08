import type { Metadata } from "next";
import { BookOpen } from "lucide-react";
import { getClient } from "@/lib/apollo-client";
import { GET_BLOG_POSTS } from "@/lib/graphql/content";
import BlogPostCard from "@/components/blog/BlogPostCard";
import type { BlogPost } from "@/types/drupal";
import type { GetBlogPostsQuery } from "@/types/graphql";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Stories, updates, and news from our rescue. Read about our animals, adoption success stories, and how you can help.",
};

export default async function BlogPage() {
  const { data } = await getClient().query<GetBlogPostsQuery>({
    query: GET_BLOG_POSTS,
    variables: { first: 24 },
  });

  const posts: BlogPost[] = (data?.nodeBlogPosts?.nodes || []).filter(
    (p: BlogPost) => p.status
  );

  const [featured, ...rest] = posts;

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50 border-b border-rose-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 text-center">
          <div className="flex justify-center mb-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-rose-500 shadow-lg">
              <BookOpen className="h-7 w-7 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-4">
            Our Blog
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Stories of hope, resilience, and love. Read about the animals in
            our care, adoption success stories, and how our community makes a
            difference every day.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        {posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-50 mb-4">
              <BookOpen className="h-8 w-8 text-rose-300" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No posts yet
            </h3>
            <p className="text-gray-500 max-w-sm">
              Check back soon — we&apos;ll be sharing stories and updates
              regularly!
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Featured post */}
            {featured && (
              <div>
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                  Latest Post
                </h2>
                <div className="max-w-2xl">
                  <BlogPostCard post={featured} featured />
                </div>
              </div>
            )}

            {/* Rest of posts */}
            {rest.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                  More Stories
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rest.map((post) => (
                    <BlogPostCard key={post.id} post={post} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
