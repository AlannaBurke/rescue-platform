import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Tag, ArrowLeft, Share2 } from "lucide-react";
import { getClient } from "@/lib/apollo-client";
import { GET_RESOURCE } from "@/lib/graphql/site";
import { drupalImageUrl } from "@/lib/utils";
import ResourceShareButtons from "@/components/resources/ResourceShareButtons";

interface ResourceImage {
  url: string;
  alt: string;
  width: number;
  height: number;
}

interface ResourceNode {
  id: string;
  title: string;
  path: string;
  resourceCategory: string;
  shareTargets: string[];
  tags: Array<{ id: string; name: string; path: string }>;
  resourceImage: ResourceImage | null;
  socialShareImage: ResourceImage | null;
  body: { summary: string; value: string; processed: string } | null;
}

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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  try {
    const { data } = await getClient().query({ query: GET_RESOURCE, variables: { id } });
    const resource: ResourceNode = data?.nodeResource;
    if (!resource) return { title: "Resource Not Found" };
    return {
      title: resource.title,
      description: resource.body?.summary || `${CATEGORY_LABELS[resource.resourceCategory] ?? "Resource"} from our library`,
    };
  } catch {
    return { title: "Resource" };
  }
}

export default async function ResourceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { data } = await getClient().query({ query: GET_RESOURCE, variables: { id } });
  const resource: ResourceNode = data?.nodeResource;

  if (!resource) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl text-stone-700 mb-4" style={{ fontFamily: "'Fredoka One', ui-rounded, system-ui, sans-serif" }}>
            Resource not found
          </h1>
          <Link href="/resources" className="text-primary-600 hover:underline">
            ← Back to Resources
          </Link>
        </div>
      </div>
    );
  }

  const heroImg = resource.resourceImage?.url
    ? drupalImageUrl(resource.resourceImage.url)
    : "/images/defaults/resources-banner.png";

  const shareImg = resource.socialShareImage?.url
    ? drupalImageUrl(resource.socialShareImage.url)
    : heroImg;

  return (
    <div className="min-h-screen bg-stone-50">

      {/* Back nav */}
      <div className="bg-white border-b border-stone-200">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-3">
          <Link
            href="/resources"
            className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-primary-700 transition-colors no-underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Resources
          </Link>
        </div>
      </div>

      {/* Hero image */}
      <div className="relative w-full h-64 sm:h-80 bg-primary-50 overflow-hidden">
        <Image
          src={heroImg}
          alt={resource.resourceImage?.alt || resource.title}
          fill
          className="object-cover"
          unoptimized
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="mx-auto max-w-4xl">
            <span className="inline-flex items-center rounded-full bg-white/20 backdrop-blur-sm px-3 py-1 text-xs font-semibold text-white mb-3">
              {CATEGORY_LABELS[resource.resourceCategory] ?? resource.resourceCategory}
            </span>
            <h1
              className="text-3xl sm:text-4xl text-white"
              style={{ fontFamily: "'Fredoka One', ui-rounded, system-ui, sans-serif" }}
            >
              {resource.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Main content */}
          <div className="lg:col-span-3">
            {resource.body?.processed ? (
              <div
                className="drupal-content prose prose-stone max-w-none"
                dangerouslySetInnerHTML={{ __html: resource.body.processed }}
              />
            ) : (
              <p className="text-stone-500 italic">No content available for this resource.</p>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-5">

            {/* Tags */}
            {resource.tags.length > 0 && (
              <div className="bg-white rounded-2xl p-5 shadow-soft border border-stone-100">
                <h3
                  className="text-sm font-bold text-stone-700 mb-3 flex items-center gap-2"
                  style={{ fontFamily: "'Fredoka One', ui-rounded, system-ui, sans-serif" }}
                >
                  <Tag className="h-4 w-4 text-lavender-500" />
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {resource.tags.map((tag) => (
                    <Link
                      key={tag.id}
                      href={`/resources?tag=${encodeURIComponent(tag.name)}`}
                      className="inline-flex items-center gap-1 rounded-full bg-lavender-100 px-2.5 py-1 text-xs font-medium text-lavender-700 hover:bg-lavender-200 transition-colors no-underline"
                    >
                      {tag.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Share */}
            {resource.shareTargets && resource.shareTargets.length > 0 && (
              <div className="bg-white rounded-2xl p-5 shadow-soft border border-stone-100">
                <h3
                  className="text-sm font-bold text-stone-700 mb-3 flex items-center gap-2"
                  style={{ fontFamily: "'Fredoka One', ui-rounded, system-ui, sans-serif" }}
                >
                  <Share2 className="h-4 w-4 text-primary-500" />
                  Share This Resource
                </h3>
                <ResourceShareButtons
                  title={resource.title}
                  shareTargets={resource.shareTargets}
                  imageUrl={shareImg}
                />
              </div>
            )}

            {/* Back to resources */}
            <Link
              href="/resources"
              className="flex items-center justify-center gap-2 w-full rounded-2xl bg-primary-50 px-4 py-3 text-sm font-semibold text-primary-700 hover:bg-primary-100 transition-colors no-underline"
            >
              <ArrowLeft className="h-4 w-4" />
              All Resources
            </Link>
          </aside>
        </div>
      </div>
    </div>
  );
}
