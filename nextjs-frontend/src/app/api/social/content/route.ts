// ─────────────────────────────────────────────────────────────────────────────
// GET /api/social/content?type=animal|blog|resource|event
// Fetches content from Drupal GraphQL and normalizes it into ContentOption
// objects ready for the Social Publisher UI.
// ─────────────────────────────────────────────────────────────────────────────
import { NextRequest, NextResponse } from "next/server";

const DRUPAL_GRAPHQL = process.env.DRUPAL_BASE_URL
  ? `${process.env.DRUPAL_BASE_URL}/graphql`
  : "http://localhost:8888/graphql";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "";

// ─── GraphQL queries ──────────────────────────────────────────────────────────

const QUERIES: Record<string, string> = {
  animal: `{
    nodeAnimals(first: 50) {
      nodes {
        id title path
        animalSpecies { ... on TermAnimalSpecy { name } }
        animalBreed animalAgeYears animalAgeMonths animalSex animalColor
        body { value }
        goodWith notGoodWith
        lifecycleStatus { ... on TermAnimalLifecycleStatus { name } }
        animalPhotos { url alt }
      }
    }
  }`,
  blog: `{
    nodeBlogPosts(first: 50) {
      nodes {
        id title path
        body { value }
        tags { ... on TermTag { name } }
        socialShareImage { url alt }
      }
    }
  }`,
  resource: `{
    nodeResources(first: 50) {
      nodes {
        id title path
        body { value }
        tags { ... on TermTag { name } }
        resourceCategory
        resourceImage { url alt }
        socialShareImage { url alt }
      }
    }
  }`,
  event: `{
    nodeEvents(first: 50) {
      nodes {
        id title path
        body { value }
        eventDate { time }
        eventLocation
      }
    }
  }`,
};

// ─── Normalizers — map raw GraphQL nodes → ContentOption ─────────────────────

interface ContentOption {
  id: string;
  title: string;
  type: "animal" | "blog" | "resource" | "event";
  imageUrls: string[];
  altTexts: string[];
  linkUrl: string;
  rawData: Record<string, unknown>;
}

function normalizeAnimal(node: Record<string, unknown>): ContentOption {
  const photos = (node.animalPhotos as { url: string; alt: string }[] | undefined) ?? [];
  return {
    id:        String(node.id),
    title:     String(node.title),
    type:      "animal",
    imageUrls: photos.map((p) => p.url),
    altTexts:  photos.map((p) => p.alt ?? ""),
    linkUrl:   `${SITE_URL}/adopt/${node.id}`,
    rawData:   node,
  };
}

function normalizeBlog(node: Record<string, unknown>): ContentOption {
  const img = node.socialShareImage as { url: string; alt: string } | null | undefined;
  return {
    id:        String(node.id),
    title:     String(node.title),
    type:      "blog",
    imageUrls: img?.url ? [img.url] : [],
    altTexts:  img?.alt ? [img.alt] : [],
    linkUrl:   `${SITE_URL}/blog/${node.id}`,
    rawData:   node,
  };
}

function normalizeResource(node: Record<string, unknown>): ContentOption {
  const heroImg   = node.resourceImage   as { url: string; alt: string } | null | undefined;
  const shareImg  = node.socialShareImage as { url: string; alt: string } | null | undefined;
  const imgSource = shareImg ?? heroImg;
  return {
    id:        String(node.id),
    title:     String(node.title),
    type:      "resource",
    imageUrls: imgSource?.url ? [imgSource.url] : [],
    altTexts:  imgSource?.alt ? [imgSource.alt] : [],
    linkUrl:   `${SITE_URL}/resources/${node.id}`,
    rawData:   node,
  };
}

function normalizeEvent(node: Record<string, unknown>): ContentOption {
  return {
    id:        String(node.id),
    title:     String(node.title),
    type:      "event",
    imageUrls: [],
    altTexts:  [],
    linkUrl:   `${SITE_URL}/events/${node.id}`,
    rawData:   node,
  };
}

const NORMALIZERS: Record<string, (node: Record<string, unknown>) => ContentOption> = {
  animal:   normalizeAnimal,
  blog:     normalizeBlog,
  resource: normalizeResource,
  event:    normalizeEvent,
};

// ─── GraphQL response root key per type ──────────────────────────────────────

const ROOT_KEYS: Record<string, string> = {
  animal:   "nodeAnimals",
  blog:     "nodeBlogPosts",
  resource: "nodeResources",
  event:    "nodeEvents",
};

// ─── Route handler ────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const type = req.nextUrl.searchParams.get("type") ?? "animal";
  const query = QUERIES[type];
  if (!query) return NextResponse.json({ error: "Invalid type" }, { status: 400 });

  try {
    const res = await fetch(DRUPAL_GRAPHQL, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ query }),
      cache:   "no-store",
    });
    const json = await res.json() as { data?: Record<string, { nodes: Record<string, unknown>[] }> };

    const rootKey   = ROOT_KEYS[type];
    const rawNodes  = json?.data?.[rootKey]?.nodes ?? [];
    const normalize = NORMALIZERS[type];
    const items: ContentOption[] = rawNodes.map(normalize);

    return NextResponse.json({ items });
  } catch (err: unknown) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
