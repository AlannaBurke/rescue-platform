/**
 * Disables Next.js Draft Mode and redirects back to the page the editor was on,
 * or to the homepage if no redirect URL is provided.
 */

import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const draft = await draftMode();
  draft.disable();

  // Redirect back to the page they came from, or to the homepage
  const { searchParams } = request.nextUrl;
  const returnTo = searchParams.get("returnTo") ?? "/";

  // Sanitize: only allow relative paths to prevent open redirect
  const safePath = returnTo.startsWith("/") ? returnTo : "/";
  redirect(safePath);
}
