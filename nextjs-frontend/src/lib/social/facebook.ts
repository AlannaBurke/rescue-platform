// ─────────────────────────────────────────────────────────────────────────────
// Facebook publisher — uses the Facebook Graph API v21.0
// Credentials: FACEBOOK_PAGE_ID + FACEBOOK_PAGE_ACCESS_TOKEN in .env.local
//
// To get a long-lived Page Access Token:
// 1. Create a Facebook App at developers.facebook.com
// 2. Add the "Pages API" product
// 3. Generate a User Access Token with pages_manage_posts + pages_read_engagement
// 4. Exchange for a long-lived token (60 days) via:
//    GET /oauth/access_token?grant_type=fb_exchange_token&...
// 5. Get the Page Access Token (never expires) via:
//    GET /{user-id}/accounts?access_token={long-lived-user-token}
// ─────────────────────────────────────────────────────────────────────────────
import type { SocialPost, PublishResult } from "./types";

const GRAPH_API = "https://graph.facebook.com/v21.0";

export async function postToFacebook(post: SocialPost): Promise<PublishResult> {
  const pageId    = process.env.FACEBOOK_PAGE_ID;
  const pageToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;

  if (!pageId || !pageToken) {
    return { platform: "facebook", success: false, error: "FACEBOOK_PAGE_ID or FACEBOOK_PAGE_ACCESS_TOKEN not configured" };
  }

  try {
    const imageUrls = post.imageUrls.slice(0, 10);

    if (imageUrls.length === 0) {
      // Text-only post with link
      const res = await fetch(`${GRAPH_API}/${pageId}/feed`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message:      post.text,
          link:         post.linkUrl,
          access_token: pageToken,
        }),
      });
      const data = await res.json() as { id?: string; error?: { message: string } };
      if (data.error) return { platform: "facebook", success: false, error: data.error.message };
      const postUrl = `https://www.facebook.com/${data.id?.replace("_", "/posts/")}`;
      return { platform: "facebook", success: true, postUrl };
    }

    if (imageUrls.length === 1) {
      // Single photo post
      const res = await fetch(`${GRAPH_API}/${pageId}/photos`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url:          imageUrls[0],
          caption:      post.text,
          access_token: pageToken,
        }),
      });
      const data = await res.json() as { id?: string; post_id?: string; error?: { message: string } };
      if (data.error) return { platform: "facebook", success: false, error: data.error.message };
      const postId = data.post_id ?? data.id ?? "";
      return { platform: "facebook", success: true, postUrl: `https://www.facebook.com/${postId.replace("_", "/posts/")}` };
    }

    // Multiple photos — upload each as unpublished, then create a feed post
    const photoIds: string[] = [];
    for (const url of imageUrls) {
      const res = await fetch(`${GRAPH_API}/${pageId}/photos`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url,
          published:    false,
          access_token: pageToken,
        }),
      });
      const data = await res.json() as { id?: string; error?: { message: string } };
      if (data.id) photoIds.push(data.id);
    }

    // Create the feed post referencing the staged photos
    const attachedMedia = photoIds.map((id) => ({ media_fbid: id }));
    const feedRes = await fetch(`${GRAPH_API}/${pageId}/feed`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message:         post.text,
        attached_media:  attachedMedia,
        access_token:    pageToken,
      }),
    });
    const feedData = await feedRes.json() as { id?: string; error?: { message: string } };
    if (feedData.error) return { platform: "facebook", success: false, error: feedData.error.message };
    const postUrl = `https://www.facebook.com/${feedData.id?.replace("_", "/posts/")}`;
    return { platform: "facebook", success: true, postUrl };
  } catch (err: unknown) {
    return { platform: "facebook", success: false, error: String(err) };
  }
}
