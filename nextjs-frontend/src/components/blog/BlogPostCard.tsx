import Link from "next/link";
import { Calendar, ArrowRight } from "lucide-react";
import { formatDate, truncate } from "@/lib/utils";
import type { BlogPost } from "@/types/drupal";

interface BlogPostCardProps {
  post: BlogPost;
  featured?: boolean;
}

export default function BlogPostCard({ post, featured = false }: BlogPostCardProps) {
  const excerpt =
    post.body?.summary ||
    (post.body?.value
      ? post.body.value.replace(/<[^>]*>/g, "").slice(0, 200) + "…"
      : "");

  const dateStr = post.created?.time ? formatDate(post.created.time) : null;

  if (featured) {
    return (
      <Link
        href={`/blog/${post.id}`}
        className="group relative flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md hover:border-rose-100 transition-all duration-200"
      >
        {/* Featured image placeholder */}
        <div className="h-56 bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50 flex items-center justify-center">
          <span className="text-6xl">🐾</span>
        </div>
        <div className="p-6 flex flex-col flex-1 gap-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-medium text-rose-700">
              Featured
            </span>
            {dateStr && (
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <Calendar className="h-3.5 w-3.5" />
                {dateStr}
              </span>
            )}
          </div>
          <h2 className="text-2xl font-bold text-gray-900 group-hover:text-rose-600 transition-colors leading-tight">
            {post.title}
          </h2>
          {excerpt && (
            <p className="text-gray-600 leading-relaxed flex-1">
              {truncate(excerpt, 220)}
            </p>
          )}
          <div className="flex items-center gap-1.5 text-sm font-semibold text-rose-600 group-hover:text-rose-700 pt-1">
            Read more
            <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/blog/${post.id}`}
      className="group flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md hover:border-rose-100 transition-all duration-200"
    >
      {/* Image placeholder */}
      <div className="h-40 bg-gradient-to-br from-rose-50 to-orange-50 flex items-center justify-center">
        <span className="text-4xl">🐾</span>
      </div>
      <div className="p-4 flex flex-col flex-1 gap-2">
        {dateStr && (
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <Calendar className="h-3.5 w-3.5" />
            {dateStr}
          </span>
        )}
        <h3 className="text-base font-bold text-gray-900 group-hover:text-rose-600 transition-colors leading-snug">
          {post.title}
        </h3>
        {excerpt && (
          <p className="text-sm text-gray-500 leading-relaxed flex-1 line-clamp-3">
            {excerpt}
          </p>
        )}
        <div className="flex items-center gap-1 text-xs font-semibold text-rose-600 group-hover:text-rose-700 pt-1">
          Read more
          <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </Link>
  );
}
