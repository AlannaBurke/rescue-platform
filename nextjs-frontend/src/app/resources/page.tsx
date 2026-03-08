import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, Tag, ExternalLink } from "lucide-react";
import { getClient } from "@/lib/apollo-client";
import { GET_RESOURCES, GET_TAGS } from "@/lib/graphql/site";
import { drupalImageUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Resources",
  description: "Care guides, emergency references, and educational resources for small animal owners and fosters.",
};

const CATEGORY_LABELS: Record<string, string> = {
  care_guide:    "Care Guide",
  emergency:     "Emergency",
  educational:   "Educational",
  foster_guide:  "Foster Guide",
  adoption_info: "Adoption Info",
  nutrition:     "Nutrition",
  behavior:      "Behavior",
  medical:       "Medical",
  enrichment:    "Enrichment",
  other:         "Other",
};

const CATEGORY_COLORS: Record<string, string> = {
  care_guide:    "bg-primary-100 text-primary-700",
  emergency:     "bg-rose-100 text-rose-700",
  educational:   "bg-lavender-100 text-lavender-600",
  foster_guide:  "bg-warm-100 text-warm-700",
  adoption_info: "bg-sage-100 text-sage-600",
  nutrition:     "bg-amber-100 text-amber-700",
  behavior:      "bg-sky-100 text-sky-700",
  medical:       "bg-red-100 text-red-700",
  enrichment:    "bg-green-100 text-green-700",
  other:         "bg-stone-100 text-stone-600",
};

interface ResourceNode {
  id: string;
  title: string;
  path: string;
  resourceCategory: string;
  shareTargets: string[];
  tags: Array<{ id: string; name: string; path: string }>;
  resourceImage: { url: string; alt: string; width: number; height: number } | null;
  body: { summary: string; value: string; processed: string } | null;
}

interface TagNode {
  id: string;
  name: string;
  path: string;
}

export default async function ResourcesPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string; category?: string }>;
}) {
  const params = await searchParams;
  const activeTag      = params.tag ?? null;
  const activeCategory = params.category ?? null;

  const [resourcesResult, tagsResult] = await Promise.all([
    getClient().query({ query: GET_RESOURCES, variables: { first: 50 } }),
    getClient().query({ query: GET_TAGS }),
  ]);

  const allResources: ResourceNode[] = resourcesResult.data?.nodeResources?.nodes ?? [];
  const allTags: TagNode[]           = tagsResult.data?.termTags?.nodes ?? [];

  // Filter client-side (for now)
  const filtered = allResources.filter((r) => {
    if (activeTag && !r.tags.some((t) => t.name === activeTag)) return false;
    if (activeCategory && r.resourceCategory !== activeCategory) return false;
    return true;
  });

  const categories = Array.from(new Set(allResources.map((r) => r.resourceCategory))).filter(Boolean);

  return (
    <div className="min-h-screen bg-stone-50">

      {/* Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-8 left-16 w-64 h-64 rounded-full bg-white blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 lg:py-20 flex flex-col lg:flex-row items-center gap-10">
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-semibold text-primary-100 mb-5">
              <BookOpen className="h-4 w-4" />
              Resource Library
            </div>
            <h1
              className="text-4xl sm:text-5xl text-white mb-4"
              style={{ fontFamily: "'Fredoka One', ui-rounded, system-ui, sans-serif" }}
            >
              Care Guides &amp; Resources
            </h1>
            <p className="text-primary-100 max-w-lg leading-relaxed">
              Everything you need to give your small animal the best life possible —
              from daily care to emergency preparedness.
            </p>
          </div>
          <div className="flex-shrink-0 w-full max-w-xs lg:max-w-sm">
            <Image
              src="/images/defaults/resources-banner.png"
              alt="Resource library"
              width={500}
              height={281}
              className="rounded-3xl shadow-2xl w-full"
              priority
            />
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white border-b border-stone-200 sticky top-16 z-30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap gap-2 items-center">
          <span className="text-xs font-bold text-stone-400 uppercase tracking-wider mr-1">Filter:</span>

          {/* Category pills */}
          <Link
            href="/resources"
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-colors no-underline ${
              !activeCategory && !activeTag
                ? "bg-primary-600 text-white"
                : "bg-stone-100 text-stone-600 hover:bg-primary-50 hover:text-primary-700"
            }`}
          >
            All
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat}
              href={`/resources?category=${cat}`}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-colors no-underline ${
                activeCategory === cat
                  ? "bg-primary-600 text-white"
                  : "bg-stone-100 text-stone-600 hover:bg-primary-50 hover:text-primary-700"
              }`}
            >
              {CATEGORY_LABELS[cat] ?? cat}
            </Link>
          ))}

          {/* Tag pills */}
          {allTags.slice(0, 12).map((tag) => (
            <Link
              key={tag.id}
              href={`/resources?tag=${encodeURIComponent(tag.name)}`}
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold transition-colors no-underline ${
                activeTag === tag.name
                  ? "bg-lavender-500 text-white"
                  : "bg-lavender-100 text-lavender-700 hover:bg-lavender-200"
              }`}
            >
              <Tag className="h-3 w-3" />
              {tag.name}
            </Link>
          ))}
        </div>
      </section>

      {/* Results */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        {(activeTag || activeCategory) && (
          <div className="flex items-center gap-3 mb-6">
            <p className="text-stone-600 text-sm">
              Showing <strong>{filtered.length}</strong> result{filtered.length !== 1 ? "s" : ""}
              {activeTag ? ` tagged "${activeTag}"` : ""}
              {activeCategory ? ` in "${CATEGORY_LABELS[activeCategory] ?? activeCategory}"` : ""}
            </p>
            <Link href="/resources" className="text-xs text-primary-600 hover:text-primary-800 underline">
              Clear filters
            </Link>
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">📚</div>
            <h3
              className="text-xl text-stone-700 mb-2"
              style={{ fontFamily: "'Fredoka One', ui-rounded, system-ui, sans-serif" }}
            >
              No resources found
            </h3>
            <p className="text-stone-500 text-sm">Try a different filter or browse all resources.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function ResourceCard({ resource }: { resource: ResourceNode }) {
  const imgSrc = resource.resourceImage?.url
    ? drupalImageUrl(resource.resourceImage.url)
    : "/images/defaults/no-image-animal.png";

  const summary = resource.body?.summary || resource.body?.processed?.replace(/<[^>]+>/g, "").slice(0, 120) || "";

  return (
    <Link
      href={`/resources/${resource.id}`}
      className="group bg-white rounded-3xl overflow-hidden shadow-[0_4px_24px_-4px_rgba(32,153,161,0.12)] border border-stone-100 hover:shadow-[0_8px_32px_-4px_rgba(32,153,161,0.22)] transition-all duration-300 no-underline flex flex-col"
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden bg-primary-50">
        <Image
          src={imgSrc}
          alt={resource.resourceImage?.alt || resource.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          unoptimized
        />
        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${CATEGORY_COLORS[resource.resourceCategory] ?? "bg-stone-100 text-stone-600"}`}>
            {CATEGORY_LABELS[resource.resourceCategory] ?? resource.resourceCategory}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3
          className="text-lg text-stone-800 group-hover:text-primary-700 transition-colors mb-2 line-clamp-2"
          style={{ fontFamily: "'Fredoka One', ui-rounded, system-ui, sans-serif" }}
        >
          {resource.title}
        </h3>
        {summary && (
          <p className="text-sm text-stone-500 leading-relaxed line-clamp-3 mb-3 flex-1">
            {summary}
          </p>
        )}

        {/* Tags */}
        {resource.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-auto pt-3 border-t border-stone-100">
            {resource.tags.slice(0, 3).map((tag) => (
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
