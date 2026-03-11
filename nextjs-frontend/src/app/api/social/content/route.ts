// ─────────────────────────────────────────────────────────────────────────────
// GET /api/social/content?type=animal|blog|resource
// Server-side proxy to Drupal GraphQL — avoids browser CORS/localhost issues
// ─────────────────────────────────────────────────────────────────────────────
import { NextRequest, NextResponse } from "next/server";

const DRUPAL_GRAPHQL = process.env.DRUPAL_BASE_URL
  ? `${process.env.DRUPAL_BASE_URL}/graphql`
  : "http://localhost:8888/graphql";

const QUERIES: Record<string, string> = {
  animal: `{
    nodeAnimals(first: 50) {
      nodes {
        id
        title
        animalSpecies { ... on TermAnimalSpecy { name } }
        animalBreed
        animalAgeYears
        animalAgeMonths
        animalSex
        animalColor
        body { value }
        goodWith
        notGoodWith
        lifecycleStatus { ... on TermAnimalLifecycleStatus { name } }
        animalPhotos { url alt }
        path
      }
    }
  }`,
  blog: `{
    nodeBlogPosts(first: 50) {
      nodes {
        id
        title
        body { value }
        tags { ... on TermTag { name } }
        path
        socialShareImage { url alt }
      }
    }
  }`,
  resource: `{
    nodeResources(first: 50) {
      nodes {
        id
        title
        body { value }
        tags { ... on TermTag { name } }
        path
        resourceCategory
        resourceImage { url alt }
        socialShareImage { url alt }
      }
    }
  }`,
};

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
    const json = await res.json();
    return NextResponse.json(json);
  } catch (err: unknown) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
