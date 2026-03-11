// ─────────────────────────────────────────────────────────────────────────────
// POST /api/social/generate
// Body: { data: SocialContentData, platforms: SocialPlatform[] }
// Returns: { copies: Record<SocialPlatform, string> }
// ─────────────────────────────────────────────────────────────────────────────
import { NextRequest, NextResponse } from "next/server";
import type { SocialPlatform } from "@/lib/social/types";
import { generateSocialCopy } from "@/lib/social/generate-copy";
import type { SocialContentData } from "@/lib/social/generate-copy";

export async function POST(req: NextRequest) {
  const body = await req.json() as {
    data: SocialContentData;
    platforms: SocialPlatform[];
  };

  try {
    const copies = await generateSocialCopy(body.data, body.platforms);
    return NextResponse.json({ copies });
  } catch (err: unknown) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
