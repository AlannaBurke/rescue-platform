// ─────────────────────────────────────────────────────────────────────────────
// AI copy generation for social media posts
// Uses the OpenAI-compatible API (gpt-4.1-mini)
// ─────────────────────────="────────────────────────────────────────────────────
import type { SocialPlatform } from "./types";

export interface AnimalSocialData {
  name: string;
  species: string;
  breed?: string;
  age?: string;
  sex?: string;
  color?: string;
  bio?: string;
  goodWith?: string[];
  notGoodWith?: string[];
  lifecycleStatus?: string;
  linkUrl: string;
  orgName?: string;
  orgHandle?: Record<string, string>; // platform -> handle
}

export interface BlogSocialData {
  title: string;
  summary?: string;
  body?: string;
  tags?: string[];
  linkUrl: string;
  orgName?: string;
  orgHandle?: Record<string, string>;
}

export type SocialContentData = AnimalSocialData | BlogSocialData;

const PLATFORM_INSTRUCTIONS: Record<SocialPlatform, string> = {
  facebook: `Write a warm, engaging Facebook post (up to 500 words). Include all key details, a personal story-like tone, and a clear call-to-action. End with the link. Use line breaks for readability. Do NOT use hashtags.`,
  bluesky:  `Write a punchy Bluesky post (max 280 characters including the link). Include 2-3 relevant hashtags. The link will be appended automatically — leave space for it.`,
  threads:  `Write a friendly Threads post (max 450 characters). Include 3-5 relevant hashtags. Warm, conversational tone.`,
  mastodon: `Write a Mastodon post (max 450 characters). Include 3-5 relevant hashtags. Friendly, community-focused tone. The link will be appended.`,
  instagram: `Write an Instagram caption (max 2000 characters). Start with an attention-grabbing first line. Include a call-to-action and 15-20 relevant hashtags at the end, separated by a line break.`,
};

function isAnimal(data: SocialContentData): data is AnimalSocialData {
  return "name" in data && "species" in data;
}

function buildAnimalContext(data: AnimalSocialData): string {
  const parts = [
    `Animal name: ${data.name}`,
    `Species: ${data.species}`,
    data.breed ? `Breed: ${data.breed}` : null,
    data.age ? `Age: ${data.age}` : null,
    data.sex ? `Sex: ${data.sex}` : null,
    data.color ? `Color: ${data.color}` : null,
    data.bio ? `Bio: ${data.bio}` : null,
    data.goodWith?.length ? `Good with: ${data.goodWith.join(", ")}` : null,
    data.notGoodWith?.length ? `Not good with: ${data.notGoodWith.join(", ")}` : null,
    data.lifecycleStatus ? `Status: ${data.lifecycleStatus}` : null,
    `Rescue/org: ${data.orgName ?? "our rescue"}`,
    `Profile link: ${data.linkUrl}`,
  ];
  return parts.filter(Boolean).join("\n");
}

function buildBlogContext(data: BlogSocialData): string {
  const parts = [
    `Article title: ${data.title}`,
    data.summary ? `Summary: ${data.summary}` : null,
    data.body ? `Content excerpt: ${data.body.slice(0, 500)}` : null,
    data.tags?.length ? `Tags: ${data.tags.join(", ")}` : null,
    `Org: ${data.orgName ?? "our rescue"}`,
    `Link: ${data.linkUrl}`,
  ];
  return parts.filter(Boolean).join("\n");
}

export async function generateSocialCopy(
  data: SocialContentData,
  platforms: SocialPlatform[]
): Promise<Record<SocialPlatform, string>> {
  const OpenAI = (await import("openai")).default;
  // Use the sandbox-provided OPENAI_API_KEY and base URL (pre-configured for gpt-4.1-mini)
  const client = new OpenAI({
    apiKey:  process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_BASE_URL ?? undefined,
  });

  const context = isAnimal(data) ? buildAnimalContext(data) : buildBlogContext(data);
  const contentType = isAnimal(data) ? "adoptable animal profile" : "blog post / resource article";

  const results: Partial<Record<SocialPlatform, string>> = {};

  // Generate all platforms in parallel
  await Promise.all(
    platforms.map(async (platform) => {
      const orgHandle = data.orgHandle?.[platform];
      const handleNote = orgHandle ? `Our handle on this platform is @${orgHandle}.` : "";

      const prompt = `You are a social media manager for an animal rescue organization.
Generate a social media post for the following ${contentType}.

${PLATFORM_INSTRUCTIONS[platform]}

${handleNote}

Content details:
${context}

Return ONLY the post text, no explanations or meta-commentary.`;

      try {
        const response = await client.chat.completions.create({
          model: "gpt-4.1-mini",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 600,
          temperature: 0.8,
        });
        results[platform] = response.choices[0]?.message?.content?.trim() ?? "";
      } catch {
        results[platform] = "";
      }
    })
  );

  return results as Record<SocialPlatform, string>;
}
