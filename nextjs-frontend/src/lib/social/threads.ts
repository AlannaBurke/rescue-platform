// ─────────────────────────────────────────────────────────────────────────────
// Threads publisher — uses the official Meta Threads API
// Credentials: THREADS_USER_ID + THREADS_ACCESS_TOKEN in .env.local
//
// To get credentials:
// 1. Create a Meta App at developers.facebook.com
// 2. Add the "Threads API" product
// 3. Generate a User Access Token with threads_basic + threads_content_publish
// 4. Exchange for a long-lived token (60 days) via the token exchange endpoint
// 5. Your THREADS_USER_ID is your numeric Threads user ID
// ─────────────────────────────────────────────────────────────────────────────
import type { SocialPost, PublishResult } from "./types";

const THREADS_API = "https://graph.threads.net/v1.0";

export async function postToThreads(post: SocialPost): Promise<PublishResult> {
  const userId = process.env.THREADS_USER_ID;
  const token  = process.env.THREADS_ACCESS_TOKEN;

  if (!userId || !token) {
    return { platform: "threads", success: false, error: "THREADS_USER_ID or THREADS_ACCESS_TOKEN not configured" };
  }

  try {
    const imageUrls = post.imageUrls.slice(0, 20);

    let containerId: string;

    if (imageUrls.length === 0) {
      // Text-only post
      const res = await fetch(`${THREADS_API}/${userId}/threads`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          media_type:   "TEXT",
          text:         post.text,
          access_token: token,
        }),
      });
      const data = await res.json() as { id?: string; error?: { message: string } };
      if (data.error) return { platform: "threads", success: false, error: data.error.message };
      containerId = data.id!;

    } else if (imageUrls.length === 1) {
      // Single image post
      const res = await fetch(`${THREADS_API}/${userId}/threads`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          media_type:   "IMAGE",
          image_url:    imageUrls[0],
          text:         post.text,
          access_token: token,
        }),
      });
      const data = await res.json() as { id?: string; error?: { message: string } };
      if (data.error) return { platform: "threads", success: false, error: data.error.message };
      containerId = data.id!;

    } else {
      // Carousel post — create individual item containers first
      const itemIds: string[] = [];
      for (const url of imageUrls) {
        const res = await fetch(`${THREADS_API}/${userId}/threads`, {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            media_type:    "IMAGE",
            image_url:     url,
            is_carousel_item: true,
            access_token:  token,
          }),
        });
        const data = await res.json() as { id?: string };
        if (data.id) itemIds.push(data.id);
      }

      // Create the carousel container
      const carouselRes = await fetch(`${THREADS_API}/${userId}/threads`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          media_type:   "CAROUSEL",
          children:     itemIds.join(","),
          text:         post.text,
          access_token: token,
        }),
      });
      const carouselData = await carouselRes.json() as { id?: string; error?: { message: string } };
      if (carouselData.error) return { platform: "threads", success: false, error: carouselData.error.message };
      containerId = carouselData.id!;
    }

    // Publish the container
    const publishRes = await fetch(`${THREADS_API}/${userId}/threads_publish`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        creation_id:  containerId,
        access_token: token,
      }),
    });
    const publishData = await publishRes.json() as { id?: string; error?: { message: string } };
    if (publishData.error) return { platform: "threads", success: false, error: publishData.error.message };

    return {
      platform: "threads",
      success:  true,
      postUrl:  `https://www.threads.net/t/${publishData.id}`,
    };
  } catch (err: unknown) {
    return { platform: "threads", success: false, error: String(err) };
  }
}
