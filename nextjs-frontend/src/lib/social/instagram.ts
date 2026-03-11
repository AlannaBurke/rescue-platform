// ─────────────────────────────────────────────────────────────────────────────
// Instagram publisher — uses the Instagram Graph API
// Credentials: INSTAGRAM_USER_ID + INSTAGRAM_ACCESS_TOKEN in .env.local
//
// To get credentials:
// 1. You need an Instagram Business or Creator account
// 2. Connect it to a Facebook Page
// 3. Create a Meta App at developers.facebook.com
// 4. Add "Instagram Graph API" product
// 5. Generate a User Access Token with instagram_basic + instagram_content_publish
// 6. Your INSTAGRAM_USER_ID is your numeric Instagram Business account ID
// ─────────────────────────────────────────────────────────────────────────────
import type { SocialPost, PublishResult } from "./types";

const IG_API = "https://graph.facebook.com/v21.0";

export async function postToInstagram(post: SocialPost): Promise<PublishResult> {
  const userId = process.env.INSTAGRAM_USER_ID;
  const token  = process.env.INSTAGRAM_ACCESS_TOKEN;

  if (!userId || !token) {
    return { platform: "instagram", success: false, error: "INSTAGRAM_USER_ID or INSTAGRAM_ACCESS_TOKEN not configured" };
  }

  try {
    const imageUrls = post.imageUrls.slice(0, 10);

    let containerId: string;

    if (imageUrls.length === 0) {
      return { platform: "instagram", success: false, error: "Instagram requires at least one image" };
    }

    if (imageUrls.length === 1) {
      // Single image post
      const res = await fetch(`${IG_API}/${userId}/media`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image_url:    imageUrls[0],
          caption:      post.text,
          access_token: token,
        }),
      });
      const data = await res.json() as { id?: string; error?: { message: string } };
      if (data.error) return { platform: "instagram", success: false, error: data.error.message };
      containerId = data.id!;

    } else {
      // Carousel post — create individual item containers
      const itemIds: string[] = [];
      for (const url of imageUrls) {
        const res = await fetch(`${IG_API}/${userId}/media`, {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            image_url:        url,
            is_carousel_item: true,
            access_token:     token,
          }),
        });
        const data = await res.json() as { id?: string };
        if (data.id) itemIds.push(data.id);
      }

      // Create the carousel container
      const carouselRes = await fetch(`${IG_API}/${userId}/media`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          media_type:   "CAROUSEL",
          children:     itemIds.join(","),
          caption:      post.text,
          access_token: token,
        }),
      });
      const carouselData = await carouselRes.json() as { id?: string; error?: { message: string } };
      if (carouselData.error) return { platform: "instagram", success: false, error: carouselData.error.message };
      containerId = carouselData.id!;
    }

    // Publish the container
    const publishRes = await fetch(`${IG_API}/${userId}/media_publish`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        creation_id:  containerId,
        access_token: token,
      }),
    });
    const publishData = await publishRes.json() as { id?: string; error?: { message: string } };
    if (publishData.error) return { platform: "instagram", success: false, error: publishData.error.message };

    return {
      platform: "instagram",
      success:  true,
      postUrl:  `https://www.instagram.com/p/${publishData.id}`,
    };
  } catch (err: unknown) {
    return { platform: "instagram", success: false, error: String(err) };
  }
}
