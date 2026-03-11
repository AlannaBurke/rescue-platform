// ─────────────────────────────────────────────────────────────────────────────
// POST /api/social/publish
// Body: { platforms: SocialPlatform[], posts: Record<SocialPlatform, SocialPost> }
// ─────────────────────────────────────────────────────────────────────────────
import { NextRequest, NextResponse } from "next/server";
import type { SocialPlatform, SocialPost } from "@/lib/social/types";
import { postToBluesky }   from "@/lib/social/bluesky";
import { postToMastodon }  from "@/lib/social/mastodon";
import { postToFacebook }  from "@/lib/social/facebook";
import { postToThreads }   from "@/lib/social/threads";
import { postToInstagram } from "@/lib/social/instagram";

export async function POST(req: NextRequest) {
  const body = await req.json() as {
    platforms: SocialPlatform[];
    posts: Record<SocialPlatform, SocialPost>;
  };

  const { platforms, posts } = body;

  const publishers: Record<SocialPlatform, (p: SocialPost) => Promise<unknown>> = {
    bluesky:   postToBluesky,
    mastodon:  postToMastodon,
    facebook:  postToFacebook,
    threads:   postToThreads,
    instagram: postToInstagram,
  };

  const results = await Promise.all(
    platforms.map((platform) => {
      const post = posts[platform];
      if (!post) return Promise.resolve({ platform, success: false, error: "No post data provided" });
      return publishers[platform](post);
    })
  );

  return NextResponse.json({ results });
}
