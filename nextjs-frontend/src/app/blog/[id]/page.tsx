import type { Metadata } from "next";
import { draftMode } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { getClient } from "@/lib/apollo-client";
import { GET_BLOG_POST } from "@/lib/graphql/content";
import { formatDate } from "@/lib/utils";
import type { BlogPost } from "@/types/drupal";
import type { GetBlogPostQuery } from "@/types/graphql";

interface BlogPostPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { id } = await params;
  const { data } = await getClient().query<GetBlogPostQuery>({
    query: GET_BLOG_POST,
    variables: { id },
  });

  const post: BlogPost | null = data?.nodeBlogPost ?? null;
  if (!post) return { title: "Post Not Found" };

  return {
    title: post.title,
    description:
      post.body?.summary ||
      post.body?.value?.replace(/<[^>]*>/g, "").slice(0, 160),
  };
}

function estimateReadTime(html?: string): string {
  if (!html) return "1 min read";
  const text = html.replace(/<[^>]*>/g, "");
  const words = text.split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { id } = await params;
  const { isEnabled: isPreview } = await draftMode();

  const { data } = await getClient().query<GetBlogPostQuery>({
    query: GET_BLOG_POST,
    variables: { id },
  });

  const post: BlogPost | null = data?.nodeBlogPost ?? null;

  // In preview/draft mode, show unpublished content; otherwise require published
  if (!post || (!post.status && !isPreview)) notFound();

  const dateStr = post.created?.time ? formatDate(post.created.time) : null;
  const readTime = estimateReadTime(post.body?.value);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-3">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-rose-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>
        </div>
      </div>

      {/* Hero image placeholder */}
      <div className="h-64 bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50 flex items-center justify-center border-b border-rose-100">
        <span className="text-8xl">🐾</span>
      </div>

      {/* Article */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
        {/* Unpublished badge in preview mode */}
        {isPreview && !post.status && (
          <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-800">
            <strong>Draft</strong> — This post is not yet published and is only visible in preview mode.
          </div>
        )}

        <article className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 sm:p-10">
            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-6">
              {dateStr && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  {dateStr}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {readTime}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-6">
              {post.title}
            </h1>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-rose-200 via-orange-200 to-transparent mb-8" />

            {/* Body */}
            {post.body?.processed ? (
              <div
                className="drupal-content"
                dangerouslySetInnerHTML={{ __html: post.body.processed }}
              />
            ) : post.body?.value ? (
              <div
                className="drupal-content"
                dangerouslySetInnerHTML={{ __html: post.body.value }}
              />
            ) : (
              <p className="text-gray-500 italic">No content available.</p>
            )}
          </div>
        </article>

        {/* Back link */}
        <div className="mt-8 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-600 hover:border-rose-200 hover:text-rose-600 transition-colors shadow-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to all posts
          </Link>
        </div>
      </div>
    </div>
  );
}
