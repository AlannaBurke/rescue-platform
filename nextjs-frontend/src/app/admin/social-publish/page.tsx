"use client";

import { useState, useEffect, useCallback } from "react";
import type { SocialPlatform } from "@/lib/social/types";
import { PLATFORM_LIMITS } from "@/lib/social/types";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AnimalNode {
  id: string;
  title: string;
  species?: string;
  breed?: string;
  age?: string;
  sex?: string;
  color?: string;
  body?: { value: string };
  goodWith?: string[];
  notGoodWith?: string[];
  lifecycleStatus?: string;
  animalPhotos?: { url: string; alt?: string }[];
  path?: { alias?: string };
}

interface ContentOption {
  id: string;
  title: string;
  type: "animal" | "blog" | "resource";
  imageUrls: string[];
  altTexts: string[];
  linkUrl: string;
  rawData: Record<string, unknown>;
}

type PublishStatus = "idle" | "generating" | "publishing" | "done";

interface PlatformResult {
  success: boolean;
  postUrl?: string;
  error?: string;
}

const ALL_PLATFORMS: SocialPlatform[] = ["facebook", "bluesky", "threads", "mastodon", "instagram"];

const PLATFORM_COLORS: Record<SocialPlatform, string> = {
  facebook:  "bg-blue-600",
  bluesky:   "bg-sky-500",
  threads:   "bg-gray-900",
  mastodon:  "bg-purple-600",
  instagram: "bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500",
};

// ─── Helper: strip HTML tags ──────────────────────────────────────────────────
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

// ─── Helper: rewrite Drupal image URLs ───────────────────────────────────────
function drupalImageUrl(url: string): string {
  const base = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL ?? "http://localhost:8888";
  return url.replace("http://localhost:8888", base).replace("https://localhost:8888", base);
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function SocialPublishPage() {
  const [contentOptions, setContentOptions] = useState<ContentOption[]>([]);
  const [selectedContent, setSelectedContent] = useState<ContentOption | null>(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState<Set<SocialPlatform>>(new Set(ALL_PLATFORMS));
  const [copies, setCopies] = useState<Partial<Record<SocialPlatform, string>>>({});
  const [status, setStatus] = useState<PublishStatus>("idle");
  const [results, setResults] = useState<Partial<Record<SocialPlatform, PlatformResult>>>({});
  const [loadingContent, setLoadingContent] = useState(true);
  const [contentType, setContentType] = useState<"animal" | "blog" | "resource">("animal");

  // ── Fetch content list ──────────────────────────────────────────────────────
  const fetchContent = useCallback(async (type: "animal" | "blog" | "resource") => {
    setLoadingContent(true);
    setSelectedContent(null);
    setCopies({});
    setResults({});

    try {
      // Use the server-side API proxy to avoid browser CORS/localhost issues
      const res = await fetch(`/api/social/content?type=${type}`, { cache: "no-store" });
      const json = await res.json() as { data: Record<string, { nodes: Record<string, unknown>[] }> };
      const nodeKey = Object.keys(json.data ?? {})[0];
      const nodes = json.data?.[nodeKey]?.nodes ?? [];

      const options: ContentOption[] = nodes.map((node: Record<string, unknown>) => {
        const photos = (node.animalPhotos as { url: string; alt?: string }[] | undefined) ?? [];
        const imageUrls = photos.map((p) => drupalImageUrl(p.url));
        const altTexts  = photos.map((p) => p.alt ?? (node.title as string));
        // path is a plain string in GraphQL Compose (e.g. "/adopt/2")
        const alias     = typeof node.path === "string" ? node.path : undefined;
        const linkUrl   = `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://yourrescue.org"}${alias ?? `/${type}/${node.id}`}`;

        return {
          id:       node.id as string,
          title:    node.title as string,
          type,
          imageUrls,
          altTexts,
          linkUrl,
          rawData:  node,
        };
      });

      setContentOptions(options);
    } catch (err) {
      console.error("Failed to fetch content:", err);
    } finally {
      setLoadingContent(false);
    }
  }, []);

  useEffect(() => { fetchContent(contentType); }, [contentType, fetchContent]);

  // ── Generate AI copy ────────────────────────────────────────────────────────
  const generateCopy = async () => {
    if (!selectedContent) return;
    setStatus("generating");
    setCopies({});
    setResults({});

    const node = selectedContent.rawData;
    let data: Record<string, unknown>;

    if (selectedContent.type === "animal") {
      const ageYears = node.animalAgeYears as number | undefined;
      const ageMonths = node.animalAgeMonths as number | undefined;
      const ageStr = ageYears != null && ageYears > 0
        ? `${ageYears} year${ageYears !== 1 ? "s" : ""}`
        : ageMonths != null
        ? `${ageMonths} month${ageMonths !== 1 ? "s" : ""}`
        : undefined;
      data = {
        name:            node.title,
        species:         (node.animalSpecies as { name: string } | undefined)?.name,
        breed:           node.animalBreed,
        age:             ageStr,
        sex:             node.animalSex,
        color:           node.animalColor,
        bio:             node.body ? stripHtml((node.body as { value: string }).value) : undefined,
        goodWith:        node.goodWith,
        notGoodWith:     node.notGoodWith,
        lifecycleStatus: (node.lifecycleStatus as { name: string } | undefined)?.name,
        linkUrl:         selectedContent.linkUrl,
      };
    } else {
      data = {
        title:   node.title,
        body:    node.body ? stripHtml((node.body as { value: string }).value) : undefined,
        tags:    (node.tags as { name: string }[] | undefined)?.map((t) => t.name),
        linkUrl: selectedContent.linkUrl,
      };
    }

    try {
      const res = await fetch("/api/social/generate", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data,
          platforms: Array.from(selectedPlatforms),
        }),
      });
      const json = await res.json() as { copies: Record<SocialPlatform, string> };
      setCopies(json.copies ?? {});
    } catch (err) {
      console.error("Copy generation failed:", err);
    } finally {
      setStatus("idle");
    }
  };

  // ── Publish ─────────────────────────────────────────────────────────────────
  const publish = async () => {
    if (!selectedContent) return;
    setStatus("publishing");
    setResults({});

    const posts: Partial<Record<SocialPlatform, unknown>> = {};
    for (const platform of selectedPlatforms) {
      const limit = PLATFORM_LIMITS[platform];
      posts[platform] = {
        text:      copies[platform] ?? "",
        imageUrls: selectedContent.imageUrls.slice(0, limit.maxImages),
        altTexts:  selectedContent.altTexts.slice(0, limit.maxImages),
        linkUrl:   selectedContent.linkUrl,
      };
    }

    try {
      const res = await fetch("/api/social/publish", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platforms: Array.from(selectedPlatforms),
          posts,
        }),
      });
      const json = await res.json() as { results: { platform: SocialPlatform; success: boolean; postUrl?: string; error?: string }[] };
      const resultMap: Partial<Record<SocialPlatform, PlatformResult>> = {};
      for (const r of json.results ?? []) {
        resultMap[r.platform] = { success: r.success, postUrl: r.postUrl, error: r.error };
      }
      setResults(resultMap);
    } catch (err) {
      console.error("Publishing failed:", err);
    } finally {
      setStatus("done");
    }
  };

  // ── Toggle platform ─────────────────────────────────────────────────────────
  const togglePlatform = (p: SocialPlatform) => {
    setSelectedPlatforms((prev) => {
      const next = new Set(prev);
      if (next.has(p)) next.delete(p); else next.add(p);
      return next;
    });
  };

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-amber-50">
      {/* Header */}
      <div className="bg-white border-b border-amber-200 px-6 py-4 flex items-center gap-4">
        <a href="/" className="text-amber-700 hover:text-amber-900 text-sm">← Back to site</a>
        <h1 className="text-2xl font-bold text-amber-900">📣 Social Media Publisher</h1>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* ── Left column: content picker ── */}
        <div className="lg:col-span-1 space-y-6">
          {/* Content type tabs */}
          <div className="bg-white rounded-2xl shadow-sm border border-amber-100 p-4">
            <h2 className="font-semibold text-amber-900 mb-3">1. Choose Content</h2>
            <div className="flex gap-2 mb-4">
              {(["animal", "blog", "resource"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setContentType(t)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    contentType === t
                      ? "bg-amber-600 text-white"
                      : "bg-amber-100 text-amber-700 hover:bg-amber-200"
                  }`}
                >
                  {t === "animal" ? "🐾 Animals" : t === "blog" ? "📝 Blog" : "📚 Resources"}
                </button>
              ))}
            </div>

            {loadingContent ? (
              <p className="text-sm text-amber-600 animate-pulse">Loading…</p>
            ) : (
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {contentOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => { setSelectedContent(opt); setCopies({}); setResults({}); setStatus("idle"); }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors ${
                      selectedContent?.id === opt.id
                        ? "bg-amber-600 text-white"
                        : "bg-amber-50 text-amber-800 hover:bg-amber-100"
                    }`}
                  >
                    <span className="font-medium">{opt.title}</span>
                    {opt.imageUrls.length > 0 && (
                      <span className="ml-2 text-xs opacity-70">🖼 {opt.imageUrls.length}</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Platform toggles */}
          <div className="bg-white rounded-2xl shadow-sm border border-amber-100 p-4">
            <h2 className="font-semibold text-amber-900 mb-3">2. Select Platforms</h2>
            <div className="space-y-2">
              {ALL_PLATFORMS.map((p) => {
                const { label, icon, maxChars, maxImages } = PLATFORM_LIMITS[p];
                const on = selectedPlatforms.has(p);
                return (
                  <button
                    key={p}
                    onClick={() => togglePlatform(p)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl border-2 transition-all text-sm ${
                      on
                        ? "border-amber-500 bg-amber-50"
                        : "border-gray-200 bg-white opacity-50"
                    }`}
                  >
                    <span className="text-lg">{icon}</span>
                    <span className="font-medium flex-1 text-left text-amber-900">{label}</span>
                    <span className="text-xs text-amber-600">{maxChars} chars · {maxImages} imgs</span>
                    <span className={`w-4 h-4 rounded-full border-2 ${on ? "bg-amber-500 border-amber-500" : "border-gray-300"}`} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Image preview */}
          {selectedContent && selectedContent.imageUrls.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-amber-100 p-4">
              <h2 className="font-semibold text-amber-900 mb-3">Photos ({selectedContent.imageUrls.length})</h2>
              <div className="grid grid-cols-3 gap-2">
                {selectedContent.imageUrls.slice(0, 9).map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    alt={selectedContent.altTexts[i] ?? ""}
                    className="w-full aspect-square object-cover rounded-lg"
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Right column: copy editor + publish ── */}
        <div className="lg:col-span-2 space-y-6">
          {!selectedContent ? (
            <div className="bg-white rounded-2xl shadow-sm border border-amber-100 p-12 text-center text-amber-500">
              <p className="text-4xl mb-3">📣</p>
              <p className="font-medium">Select content on the left to get started</p>
            </div>
          ) : (
            <>
              {/* Generate button */}
              <div className="bg-white rounded-2xl shadow-sm border border-amber-100 p-4 flex items-center gap-4">
                <div className="flex-1">
                  <p className="font-semibold text-amber-900">{selectedContent.title}</p>
                  <p className="text-sm text-amber-600">{selectedContent.linkUrl}</p>
                </div>
                <button
                  onClick={generateCopy}
                  disabled={status === "generating" || selectedPlatforms.size === 0}
                  className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white rounded-xl font-semibold transition-colors flex items-center gap-2"
                >
                  {status === "generating" ? (
                    <><span className="animate-spin">⟳</span> Generating…</>
                  ) : (
                    <>✨ Generate Copy</>
                  )}
                </button>
              </div>

              {/* Per-platform copy editors */}
              {ALL_PLATFORMS.filter((p) => selectedPlatforms.has(p)).map((platform) => {
                const { label, icon, maxChars } = PLATFORM_LIMITS[platform];
                const text = copies[platform] ?? "";
                const result = results[platform];
                const charCount = text.length;
                const over = charCount > maxChars;

                return (
                  <div key={platform} className="bg-white rounded-2xl shadow-sm border border-amber-100 overflow-hidden">
                    {/* Platform header */}
                    <div className={`px-4 py-3 flex items-center gap-3 ${PLATFORM_COLORS[platform]} text-white`}>
                      <span className="text-xl">{icon}</span>
                      <span className="font-semibold">{label}</span>
                      <span className="ml-auto text-sm opacity-80">
                        {charCount}/{maxChars} chars
                        {over && " ⚠️ Too long"}
                      </span>
                    </div>

                    {/* Text editor */}
                    <div className="p-4">
                      {copies[platform] !== undefined ? (
                        <textarea
                          value={text}
                          onChange={(e) => setCopies((prev) => ({ ...prev, [platform]: e.target.value }))}
                          rows={platform === "facebook" ? 8 : 4}
                          className={`w-full rounded-xl border p-3 text-sm resize-none focus:outline-none focus:ring-2 ${
                            over
                              ? "border-red-300 focus:ring-red-300"
                              : "border-amber-200 focus:ring-amber-400"
                          }`}
                        />
                      ) : (
                        <p className="text-amber-400 text-sm italic py-4 text-center">
                          {status === "generating" ? "Generating…" : "Click Generate Copy to create post text"}
                        </p>
                      )}

                      {/* Result badge */}
                      {result && (
                        <div className={`mt-2 flex items-center gap-2 text-sm rounded-lg px-3 py-2 ${
                          result.success ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                        }`}>
                          {result.success ? (
                            <>
                              ✅ Posted!{" "}
                              {result.postUrl && (
                                <a href={result.postUrl} target="_blank" rel="noopener noreferrer" className="underline">
                                  View post →
                                </a>
                              )}
                            </>
                          ) : (
                            <>❌ Failed: {result.error}</>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Publish button */}
              {Object.keys(copies).length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-amber-100 p-4 flex items-center justify-between">
                  <div className="text-sm text-amber-700">
                    Ready to publish to{" "}
                    <strong>{Array.from(selectedPlatforms).map((p) => PLATFORM_LIMITS[p].label).join(", ")}</strong>
                  </div>
                  <button
                    onClick={publish}
                    disabled={status === "publishing"}
                    className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-xl font-bold transition-colors flex items-center gap-2"
                  >
                    {status === "publishing" ? (
                      <><span className="animate-spin">⟳</span> Publishing…</>
                    ) : (
                      <>🚀 Publish Now</>
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
