/**
 * Decoupled Preview API Route
 *
 * Enables Next.js Draft Mode and redirects to the correct frontend page.
 * Called by Drupal's `next` module when an editor clicks "Preview" on a node.
 *
 * URL format (set in Drupal next_site config):
 *   /api/preview?secret=TOKEN&type=node.blog_post&id=17
 *
 * Supported content types:
 *   node.animal     → /adopt/{id}
 *   node.blog_post  → /blog/{id}
 *   node.event      → /events/{id}
 *   node.resource   → /resources/{id}
 */

import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

/** Map Drupal entity type IDs to Next.js frontend paths */
const TYPE_PATH_MAP: Record<string, string> = {
  "node.animal":     "/adopt",
  "node.blog_post":  "/blog",
  "node.event":      "/events",
  "node.resource":   "/resources",
};

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const secret          = searchParams.get("secret");
  const type            = searchParams.get("type");
  const id              = searchParams.get("id");
  // The `next` Drupal module may also pass `resourceVersion` and `plugin`
  // We don't need those but accept them silently.

  // ── 1. Validate secret ────────────────────────────────────────────────────
  const expectedSecret = process.env.PREVIEW_SECRET;
  if (!expectedSecret) {
    console.error("[Preview] PREVIEW_SECRET env var is not set");
    return new Response("Preview is not configured", { status: 500 });
  }

  if (secret !== expectedSecret) {
    return new Response("Invalid preview secret", { status: 401 });
  }

  // ── 2. Resolve the frontend path ──────────────────────────────────────────
  if (!type || !id) {
    return new Response("Missing type or id parameter", { status: 400 });
  }

  const basePath = TYPE_PATH_MAP[type];
  if (!basePath) {
    // For unsupported types, just redirect to the homepage in preview mode
    const draft = await draftMode();
    draft.enable();
    redirect("/");
  }

  const previewPath = `${basePath}/${id}`;

  // ── 3. Enable Draft Mode ──────────────────────────────────────────────────
  const draft = await draftMode();
  draft.enable();

  // ── 4. Redirect to the content page ──────────────────────────────────────
  redirect(previewPath);
}
