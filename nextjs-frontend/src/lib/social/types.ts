// ─────────────────────────────────────────────────────────────────────────────
// Social Publishing — shared types
// ─────────────────────────────────────────────────────────────────────────────

export type SocialPlatform =
  | "bluesky"
  | "mastodon"
  | "facebook"
  | "threads"
  | "instagram";

export interface SocialPost {
  /** Plain-text body (platform-appropriate length) */
  text: string;
  /** Public URLs of images to attach (max varies by platform) */
  imageUrls: string[];
  /** Canonical URL to link back to */
  linkUrl: string;
  /** Alt text for each image (parallel array with imageUrls) */
  altTexts?: string[];
}

export interface PublishResult {
  platform: SocialPlatform;
  success: boolean;
  postUrl?: string;
  error?: string;
}

// Per-platform character / image limits
export const PLATFORM_LIMITS: Record<
  SocialPlatform,
  { maxChars: number; maxImages: number; label: string; icon: string }
> = {
  facebook:  { maxChars: 63206, maxImages: 10, label: "Facebook",  icon: "📘" },
  bluesky:   { maxChars: 300,   maxImages: 4,  label: "Bluesky",   icon: "🦋" },
  threads:   { maxChars: 500,   maxImages: 20, label: "Threads",   icon: "🧵" },
  mastodon:  { maxChars: 500,   maxImages: 4,  label: "Mastodon",  icon: "🐘" },
  instagram: { maxChars: 2200,  maxImages: 10, label: "Instagram", icon: "📸" },
};
