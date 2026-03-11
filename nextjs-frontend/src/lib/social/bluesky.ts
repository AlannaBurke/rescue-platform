// ─────────────────────────────────────────────────────────────────────────────
// Bluesky publisher — uses the official @atproto/api SDK
// Credentials: BLUESKY_HANDLE + BLUESKY_APP_PASSWORD in .env.local
// ─────────────────────────────────────────────────────────────────────────────
import { BskyAgent, RichText } from "@atproto/api";
import type { SocialPost, PublishResult } from "./types";

export async function postToBluesky(post: SocialPost): Promise<PublishResult> {
  const handle   = process.env.BLUESKY_HANDLE;
  const password = process.env.BLUESKY_APP_PASSWORD;

  if (!handle || !password) {
    return { platform: "bluesky", success: false, error: "BLUESKY_HANDLE or BLUESKY_APP_PASSWORD not configured" };
  }

  try {
    const agent = new BskyAgent({ service: "https://bsky.social" });
    await agent.login({ identifier: handle, password });

    // Upload up to 4 images as blobs
    const imageUrls = post.imageUrls.slice(0, 4);
    const images: { image: { $type: string; ref: { $link: string }; mimeType: string; size: number }; alt: string }[] = [];

    for (let i = 0; i < imageUrls.length; i++) {
      const res = await fetch(imageUrls[i]);
      if (!res.ok) continue;
      const buf = Buffer.from(await res.arrayBuffer());
      const mimeType = res.headers.get("content-type") ?? "image/jpeg";
      const { data } = await agent.uploadBlob(buf, { encoding: mimeType });
      images.push({
        image: data.blob as any,
        alt:   post.altTexts?.[i] ?? "",
      });
    }

    // Build rich text (auto-detects URLs and converts to facets)
    const rt = new RichText({ text: post.text });
    await rt.detectFacets(agent);

    const record: Record<string, unknown> = {
      $type:     "app.bsky.feed.post",
      text:      rt.text,
      facets:    rt.facets,
      createdAt: new Date().toISOString(),
    };

    // Attach images embed if we have any
    if (images.length > 0) {
      record.embed = {
        $type:  "app.bsky.embed.images",
        images,
      };
    } else if (post.linkUrl) {
      // External link card (no images)
      record.embed = {
        $type:    "app.bsky.embed.external",
        external: {
          uri:         post.linkUrl,
          title:       "",
          description: "",
        },
      };
    }

    const { uri } = await agent.post(record as any);
    // Convert at:// URI to https://bsky.app URL
    const [, , did, , rkey] = uri.split("/");
    const postUrl = `https://bsky.app/profile/${did}/post/${rkey}`;

    return { platform: "bluesky", success: true, postUrl };
  } catch (err: unknown) {
    return { platform: "bluesky", success: false, error: String(err) };
  }
}
