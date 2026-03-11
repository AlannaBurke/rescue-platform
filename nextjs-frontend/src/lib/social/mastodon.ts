// ─────────────────────────────────────────────────────────────────────────────
// Mastodon publisher — uses the Mastodon REST API v2
// Credentials: MASTODON_INSTANCE_URL + MASTODON_ACCESS_TOKEN in .env.local
// Example: MASTODON_INSTANCE_URL=https://mastodon.social
// ─────────────────────────────────────────────────────────────────────────────
import type { SocialPost, PublishResult } from "./types";

export async function postToMastodon(post: SocialPost): Promise<PublishResult> {
  const instanceUrl = process.env.MASTODON_INSTANCE_URL;
  const token       = process.env.MASTODON_ACCESS_TOKEN;

  if (!instanceUrl || !token) {
    return { platform: "mastodon", success: false, error: "MASTODON_INSTANCE_URL or MASTODON_ACCESS_TOKEN not configured" };
  }

  const headers = { Authorization: `Bearer ${token}` };

  try {
    // Upload up to 4 images
    const mediaIds: string[] = [];
    const imageUrls = post.imageUrls.slice(0, 4);

    for (let i = 0; i < imageUrls.length; i++) {
      const imgRes = await fetch(imageUrls[i]);
      if (!imgRes.ok) continue;
      const blob = await imgRes.blob();

      const form = new FormData();
      form.append("file", blob, `photo-${i + 1}.jpg`);
      if (post.altTexts?.[i]) form.append("description", post.altTexts[i]);

      const uploadRes = await fetch(`${instanceUrl}/api/v2/media`, {
        method:  "POST",
        headers: { Authorization: `Bearer ${token}` },
        body:    form,
      });

      if (uploadRes.ok) {
        const media = await uploadRes.json() as { id: string };
        mediaIds.push(media.id);
      }
    }

    // Post the status
    const statusForm = new FormData();
    statusForm.append("status", post.text);
    for (const id of mediaIds) statusForm.append("media_ids[]", id);

    const statusRes = await fetch(`${instanceUrl}/api/v1/statuses`, {
      method:  "POST",
      headers,
      body:    statusForm,
    });

    if (!statusRes.ok) {
      const err = await statusRes.text();
      return { platform: "mastodon", success: false, error: err };
    }

    const status = await statusRes.json() as { url: string };
    return { platform: "mastodon", success: true, postUrl: status.url };
  } catch (err: unknown) {
    return { platform: "mastodon", success: false, error: String(err) };
  }
}
