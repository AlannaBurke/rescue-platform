import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Tag, BookOpen, FileText, ArrowLeft } from "lucide-react";
import { getClient } from "@/lib/apollo-client";
import { GET_RESOURCES, GET_BLOG_POSTS_WITH_TAGS } from "@/lib/graphql/site";
import { drupalImageUrl } from "@/lib/utils";

interface TagPageProps {
  params: Promise<{ name: string }>;
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { name } = await params;
  const tagName = decodeURIComponent(name);
  return {
    title: `Tag: ${tagName}`,
    description: `Browse all resources and blog posts tagged with "${tagName}".`,
  };
}

export default async function TagPage({ params }: TagPageProps) {
  const { name } = await params;
  const tagName = decodeURIComponent(name);

  const [resourcesResult, blogResult] = await Promise.all([
    getClient().query({ query: GET_RESOURCES, variables: { first: 100 } }),
    getClient().query({ query: GET_BLOG_POSTS_WITH_TAGS, variables: { first: 100 } }),
  ]);

  const allResources = resourcesResult.data?.nodeResources?.nodes ?? [];
  const allBlogPosts = blogResult.data?.nodeBlogPosts?.nodes ?? [];

  const matchingResources = allResources.filter((r: { tags: Array<{ name: string }> }) =>
    r.tags?.some((t: { name: string }) => t.name.toLowerCase() === tagName.toLowerCase())
  );
  const matchingBlogPosts = allBlogPosts.filter((p: { tags: Array<{ name: string }> }) =>
    p.tags?.some((t: { name: string }) => t.name.toLowerCase() === tagName.toLowerCase())
  );

  const totalCount = matchingResources.length + matchingBlogPosts.length;

  return (
    <div className="min-h-screen bg-stone-50">

      {/* Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-lavender-700 via-lavender-600 to-lavender-500 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-8 left-16 w-64 h-64 rounded-full bg-white blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16 flex flex-col lg:flex-row items-center gap-8">
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-semibold text-lavender-100 mb-4">
              <Tag className="h-4 w-4" />
              Tag Results
            </div>
            <h1
              className="text-4xl sm:text-5xl text-white mb-3"
              style={{ fontFamily: "'Fredoka One', ui-rounded, system-ui, sans-serif" }}
            >
              #{tagName}
            </h1>
            <p className="text-lavender-100">
              {totalCount} result{totalCount !== 1 ? "s" : ""} found
            </p>
          </div>
          <div className="flex-shrink-0 w-full max-w-xs">
            <Image
              src="/images/defaults/tag-header-default.png"
              alt={`Tag: ${tagName}`}
              width={400}
              height={225}
              className="rounded-3xl shadow-2xl w-full"
              priority
            />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <Link
          href="/resources"
          className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-primary-700 transition-colors no-underline mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Resources
        </Link>

        {totalCount === 0 ? (
          <div className="text-center py-20">
            <Tag className="h-12 w-12 text-stone-300 mx-auto mb-4" />
            <h2
              className="text-xl text-stone-600 mb-2"
              style={{ fontFamily: "'Fredoka One', ui-rounded, system-ui, sans-serif" }}
            >
              No results for &ldquo;{tagName}&rdquo;
            </h2>
            <p className="text-stone-400 text-sm">Try browsing all resources or blog posts.</p>
          </div>
        ) : (
          <div className="space-y-10">

            {/* Resources */}
            {matchingResources.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-5">
                  <BookOpen className="h-5 w-5 text-primary-600" />
                  <h2
                    className="text-2xl text-stone-800"
                    style={{ fontFamily: "'Fredoka One', ui-rounded, system-ui, sans-serif" }}
                  >
                    Resources ({matchingResources.length})
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {matchingResources.map((resource: {
                    id: string;
                    title: string;
                    resourceCategory: string;
                    resourceImage: { url: string; alt: string } | null;
                    body: { summary: string; processed: string } | null;
                    tags: Array<{ id: string; name: string }>;
                  }) => (
                    <ContentCard
                      key={resource.id}
                      id={resource.id}
                      title={resource.title}
                      href={`/resources/${resource.id}`}
                      badge={resource.resourceCategory}
                      imageUrl={resource.resourceImage?.url ?? null}
                      imageAlt={resource.resourceImage?.alt ?? resource.title}
                      summary={resource.body?.summary || resource.body?.processed?.replace(/<[^>]+>/g, "").slice(0, 120) || ""}
                      tags={resource.tags}
                      type="resource"
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Blog posts */}
            {matchingBlogPosts.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-5">
                  <FileText className="h-5 w-5 text-warm-600" />
                  <h2
                    className="text-2xl text-stone-800"
                    style={{ fontFamily: "'Fredoka One', ui-rounded, system-ui, sans-serif" }}
                  >
                    Blog Posts ({matchingBlogPosts.length})
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {matchingBlogPosts.map((post: {
                    id: string;
                    title: string;
                    created: { time: string };
                    body: { summary: string; processed: string } | null;
                    tags: Array<{ id: string; name: string }>;
                  }) => (
                    <ContentCard
                      key={post.id}
                      id={post.id}
                      title={post.title}
                      href={`/blog/${post.id}`}
                      badge={new Date(post.created?.time).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      imageUrl={null}
                      imageAlt={post.title}
                      summary={post.body?.summary || post.body?.processed?.replace(/<[^>]+>/g, "").slice(0, 120) || ""}
                      tags={post.tags}
                      type="blog"
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function ContentCard({
  id, title, href, badge, imageUrl, imageAlt, summary, tags, type,
}: {
  id: string;
  title: string;
  href: string;
  badge: string;
  imageUrl: string | null;
  imageAlt: string;
  summary: string;
  tags: Array<{ id: string; name: string }>;
  type: "resource" | "blog";
}) {
  const imgSrc = imageUrl
    ? drupalImageUrl(imageUrl)
    : "/images/defaults/no-image-animal.png";

  const badgeColor = type === "resource"
    ? "bg-primary-100 text-primary-700"
    : "bg-warm-100 text-warm-700";

  return (
    <Link
      href={href}
      className="group bg-white rounded-3xl overflow-hidden shadow-soft border border-stone-100 hover:shadow-[0_8px_32px_-4px_rgba(32,153,161,0.22)] transition-all duration-300 no-underline flex flex-col"
    >
      <div className="relative h-40 overflow-hidden bg-primary-50">
        <Image
          src={imgSrc}
          alt={imageAlt}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          unoptimized
        />
        <div className="absolute top-3 left-3">
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${badgeColor}`}>
            {badge}
          </span>
        </div>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3
          className="text-lg text-stone-800 group-hover:text-primary-700 transition-colors mb-2 line-clamp-2"
          style={{ fontFamily: "'Fredoka One', ui-rounded, system-ui, sans-serif" }}
        >
          {title}
        </h3>
        {summary && (
          <p className="text-sm text-stone-500 leading-relaxed line-clamp-3 mb-3 flex-1">
            {summary}
          </p>
        )}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-auto pt-3 border-t border-stone-100">
            {tags.slice(0, 3).map((tag) => (
              <span
                key={tag.id}
                className="inline-flex items-center gap-1 rounded-full bg-lavender-100 px-2 py-0.5 text-xs font-medium text-lavender-700"
              >
                <Tag className="h-2.5 w-2.5" />
                {tag.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
