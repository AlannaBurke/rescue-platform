"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import type { SocialPlatform } from "@/lib/social/types";
import { PLATFORM_LIMITS } from "@/lib/social/types";

// ─── Types ────────────────────────────────────────────────────────────────────

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

// ─── Mobile step indicator ────────────────────────────────────────────────────
function StepIndicator({
  step,
  currentStep,
  label,
}: {
  step: number;
  currentStep: number;
  label: string;
}) {
  const done = currentStep > step;
  const active = currentStep === step;
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
          done
            ? "bg-green-500 text-white"
            : active
            ? "bg-amber-600 text-white"
            : "bg-amber-100 text-amber-400"
        }`}
      >
        {done ? "✓" : step}
      </div>
      <span className={`text-[10px] font-medium ${active ? "text-amber-900" : "text-amber-400"}`}>
        {label}
      </span>
    </div>
  );
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
  // Mobile stepper: 1=pick content, 2=pick platforms, 3=review+publish
  const [mobileStep, setMobileStep] = useState(1);

  // ── Fetch content list ──────────────────────────────────────────────────────
  const fetchContent = useCallback(async (type: "animal" | "blog" | "resource") => {
    setLoadingContent(true);
    setSelectedContent(null);
    setCopies({});
    setResults({});
    try {
      const res = await fetch(`/api/social/content?type=${type}`);
      const json = await res.json() as { items: ContentOption[] };
      setContentOptions(
        (json.items ?? []).map((item) => ({
          ...item,
          imageUrls: (item.imageUrls ?? []).map(drupalImageUrl),
        }))
      );
    } catch {
      setContentOptions([]);
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
    } else if (selectedContent.type === "blog") {
      data = {
        title:       node.title,
        body:        node.body ? stripHtml((node.body as { value: string }).value) : undefined,
        tags:        (node.tags as { name: string }[] | undefined)?.map((t) => t.name),
        contentType: "blog_post",
        linkUrl:     selectedContent.linkUrl,
      };
    } else {
      data = {
        title:       node.title,
        body:        node.body ? stripHtml((node.body as { value: string }).value) : undefined,
        tags:        (node.tags as { name: string }[] | undefined)?.map((t) => t.name),
        category:    node.resourceCategory as string | undefined,
        contentType: "resource",
        linkUrl:     selectedContent.linkUrl,
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
      // On mobile, advance to step 3 after generating
      setMobileStep(3);
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
    <div className="min-h-screen bg-amber-50 pb-20 sm:pb-0">

      {/* ── Header ── */}
      <div className="bg-white border-b border-amber-200 px-4 sm:px-6 py-3 sm:py-4 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <Link href="/admin" className="text-amber-700 hover:text-amber-900 text-sm flex-shrink-0">
            ← Back
          </Link>
          <h1 className="text-lg sm:text-2xl font-bold text-amber-900 truncate">
            📣 Social Publisher
          </h1>
        </div>
      </div>

      {/* ── Mobile step indicator ── */}
      <div className="sm:hidden bg-white border-b border-amber-100 px-4 py-3">
        <div className="flex items-center justify-between max-w-xs mx-auto">
          <StepIndicator step={1} currentStep={mobileStep} label="Content" />
          <div className="flex-1 h-px bg-amber-200 mx-2" />
          <StepIndicator step={2} currentStep={mobileStep} label="Platforms" />
          <div className="flex-1 h-px bg-amber-200 mx-2" />
          <StepIndicator step={3} currentStep={mobileStep} label="Publish" />
        </div>
      </div>

      {/* ── Desktop: 3-column layout / Mobile: stepped ── */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8">

        {/* ─── DESKTOP: side-by-side layout ─── */}
        <div className="hidden sm:grid sm:grid-cols-3 gap-8">

          {/* Left: content picker + platforms */}
          <div className="col-span-1 space-y-6">
            {/* Content type tabs */}
            <div className="bg-white rounded-2xl shadow-sm border border-amber-100 p-4">
              <h2 className="font-semibold text-amber-900 mb-3">1. Choose Content</h2>
              <div className="flex gap-2 mb-4 flex-wrap">
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
                      <span className="text-xs text-amber-600">{maxChars} · {maxImages} imgs</span>
                      <span className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${on ? "bg-amber-500 border-amber-500" : "border-gray-300"}`} />
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

          {/* Right: copy editor + publish */}
          <div className="col-span-2 space-y-6">
            {!selectedContent ? (
              <div className="bg-white rounded-2xl shadow-sm border border-amber-100 p-12 text-center text-amber-500">
                <p className="text-4xl mb-3">📣</p>
                <p className="font-medium">Select content on the left to get started</p>
              </div>
            ) : (
              <DesktopRightColumn
                selectedContent={selectedContent}
                selectedPlatforms={selectedPlatforms}
                copies={copies}
                setCopies={setCopies}
                status={status}
                results={results}
                generateCopy={generateCopy}
                publish={publish}
              />
            )}
          </div>
        </div>

        {/* ─── MOBILE: stepped layout ─── */}
        <div className="sm:hidden space-y-4">

          {/* Step 1: Choose content */}
          {mobileStep === 1 && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl shadow-sm border border-amber-100 p-4">
                <h2 className="font-semibold text-amber-900 mb-3 text-base">Choose what to post</h2>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {(["animal", "blog", "resource"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setContentType(t)}
                      className={`py-2.5 rounded-xl text-sm font-medium transition-colors ${
                        contentType === t
                          ? "bg-amber-600 text-white"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {t === "animal" ? "🐾 Animals" : t === "blog" ? "📝 Blog" : "📚 Resources"}
                    </button>
                  ))}
                </div>
                {loadingContent ? (
                  <p className="text-sm text-amber-600 animate-pulse py-4 text-center">Loading…</p>
                ) : (
                  <div className="space-y-2">
                    {contentOptions.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => {
                          setSelectedContent(opt);
                          setCopies({});
                          setResults({});
                          setStatus("idle");
                          setMobileStep(2);
                        }}
                        className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-colors flex items-center gap-3 ${
                          selectedContent?.id === opt.id
                            ? "bg-amber-600 text-white"
                            : "bg-amber-50 text-amber-800"
                        }`}
                      >
                        <span className="font-medium flex-1">{opt.title}</span>
                        {opt.imageUrls.length > 0 && (
                          <span className="text-xs opacity-70 flex-shrink-0">🖼 {opt.imageUrls.length}</span>
                        )}
                        <span className="text-amber-400 flex-shrink-0">→</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Choose platforms */}
          {mobileStep === 2 && (
            <div className="space-y-4">
              {selectedContent && (
                <div className="bg-amber-100 rounded-2xl p-3 flex items-center gap-3">
                  {selectedContent.imageUrls[0] && (
                    <img
                      src={selectedContent.imageUrls[0]}
                      alt=""
                      className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                    />
                  )}
                  <div className="min-w-0">
                    <p className="font-semibold text-amber-900 text-sm truncate">{selectedContent.title}</p>
                    <button
                      onClick={() => setMobileStep(1)}
                      className="text-xs text-amber-600 underline"
                    >
                      Change
                    </button>
                  </div>
                </div>
              )}

              <div className="bg-white rounded-2xl shadow-sm border border-amber-100 p-4">
                <h2 className="font-semibold text-amber-900 mb-3 text-base">Choose platforms</h2>
                <div className="space-y-2">
                  {ALL_PLATFORMS.map((p) => {
                    const { label, icon, maxChars } = PLATFORM_LIMITS[p];
                    const on = selectedPlatforms.has(p);
                    return (
                      <button
                        key={p}
                        onClick={() => togglePlatform(p)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all ${
                          on
                            ? "border-amber-500 bg-amber-50"
                            : "border-gray-200 bg-white opacity-50"
                        }`}
                      >
                        <span className="text-2xl">{icon}</span>
                        <span className="font-medium flex-1 text-left text-amber-900">{label}</span>
                        <span className="text-xs text-amber-500">{maxChars} chars</span>
                        <span className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${on ? "bg-amber-500 border-amber-500 text-white text-xs" : "border-gray-300"}`}>
                          {on ? "✓" : ""}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                onClick={generateCopy}
                disabled={status === "generating" || selectedPlatforms.size === 0 || !selectedContent}
                className="w-full py-4 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white rounded-2xl font-bold text-base transition-colors flex items-center justify-center gap-2"
              >
                {status === "generating" ? (
                  <><span className="animate-spin text-xl">⟳</span> Generating copy…</>
                ) : (
                  <>✨ Generate Copy for {selectedPlatforms.size} Platform{selectedPlatforms.size !== 1 ? "s" : ""}</>
                )}
              </button>
            </div>
          )}

          {/* Step 3: Review + publish */}
          {mobileStep === 3 && (
            <div className="space-y-4">
              {selectedContent && (
                <div className="bg-amber-100 rounded-2xl p-3 flex items-center gap-3">
                  {selectedContent.imageUrls[0] && (
                    <img
                      src={selectedContent.imageUrls[0]}
                      alt=""
                      className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-amber-900 text-sm truncate">{selectedContent.title}</p>
                    <p className="text-xs text-amber-600">{selectedPlatforms.size} platform{selectedPlatforms.size !== 1 ? "s" : ""} selected</p>
                  </div>
                  <button
                    onClick={() => setMobileStep(2)}
                    className="text-xs text-amber-600 underline flex-shrink-0"
                  >
                    Edit
                  </button>
                </div>
              )}

              {Object.keys(copies).length === 0 && status !== "generating" && (
                <button
                  onClick={generateCopy}
                  disabled={status === "generating"}
                  className="w-full py-4 bg-amber-600 text-white rounded-2xl font-bold text-base flex items-center justify-center gap-2"
                >
                  ✨ Generate Copy
                </button>
              )}

              {ALL_PLATFORMS.filter((p) => selectedPlatforms.has(p)).map((platform) => {
                const { label, icon, maxChars } = PLATFORM_LIMITS[platform];
                const text = copies[platform] ?? "";
                const result = results[platform];
                const charCount = text.length;
                const over = charCount > maxChars;

                return (
                  <div key={platform} className="bg-white rounded-2xl shadow-sm border border-amber-100 overflow-hidden">
                    <div className={`px-4 py-3 flex items-center gap-3 ${PLATFORM_COLORS[platform]} text-white`}>
                      <span className="text-xl">{icon}</span>
                      <span className="font-semibold">{label}</span>
                      <span className={`ml-auto text-sm ${over ? "font-bold" : "opacity-80"}`}>
                        {charCount}/{maxChars}
                        {over && " ⚠️"}
                      </span>
                    </div>
                    <div className="p-4">
                      {copies[platform] !== undefined ? (
                        <textarea
                          value={text}
                          onChange={(e) => setCopies((prev) => ({ ...prev, [platform]: e.target.value }))}
                          rows={5}
                          className={`w-full rounded-xl border p-3 text-sm resize-none focus:outline-none focus:ring-2 ${
                            over
                              ? "border-red-300 focus:ring-red-300"
                              : "border-amber-200 focus:ring-amber-400"
                          }`}
                        />
                      ) : (
                        <p className="text-amber-400 text-sm italic py-4 text-center">
                          {status === "generating" ? "Generating…" : "Tap Generate Copy above"}
                        </p>
                      )}
                      {result && (
                        <div className={`mt-2 flex items-center gap-2 text-sm rounded-lg px-3 py-2 ${
                          result.success ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                        }`}>
                          {result.success ? (
                            <>✅ Posted!{" "}{result.postUrl && <a href={result.postUrl} target="_blank" rel="noopener noreferrer" className="underline">View →</a>}</>
                          ) : (
                            <>❌ {result.error}</>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {Object.keys(copies).length > 0 && (
                <button
                  onClick={publish}
                  disabled={status === "publishing"}
                  className="w-full py-4 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-2xl font-bold text-base transition-colors flex items-center justify-center gap-2"
                >
                  {status === "publishing" ? (
                    <><span className="animate-spin text-xl">⟳</span> Publishing…</>
                  ) : (
                    <>🚀 Publish to {selectedPlatforms.size} Platform{selectedPlatforms.size !== 1 ? "s" : ""}</>
                  )}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Mobile bottom navigation ── */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-amber-200 px-4 py-2 flex items-center justify-between sm:hidden z-40 shadow-lg">
        <button
          onClick={() => setMobileStep(Math.max(1, mobileStep - 1))}
          disabled={mobileStep === 1}
          className="flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-medium text-amber-700 disabled:opacity-30"
        >
          ← Back
        </button>
        <div className="flex gap-1.5">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`w-2 h-2 rounded-full transition-colors ${
                s === mobileStep ? "bg-amber-600" : s < mobileStep ? "bg-green-500" : "bg-amber-200"
              }`}
            />
          ))}
        </div>
        {mobileStep < 3 ? (
          <button
            onClick={() => {
              if (mobileStep === 1 && selectedContent) setMobileStep(2);
              else if (mobileStep === 2) setMobileStep(3);
            }}
            disabled={(mobileStep === 1 && !selectedContent) || (mobileStep === 2 && selectedPlatforms.size === 0)}
            className="flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-medium bg-amber-600 text-white disabled:opacity-30"
          >
            Next →
          </button>
        ) : (
          <div className="w-20" />
        )}
      </div>
    </div>
  );
}

// ─── Desktop right column (extracted to avoid duplication) ────────────────────
function DesktopRightColumn({
  selectedContent,
  selectedPlatforms,
  copies,
  setCopies,
  status,
  results,
  generateCopy,
  publish,
}: {
  selectedContent: ContentOption;
  selectedPlatforms: Set<SocialPlatform>;
  copies: Partial<Record<SocialPlatform, string>>;
  setCopies: React.Dispatch<React.SetStateAction<Partial<Record<SocialPlatform, string>>>>;
  status: PublishStatus;
  results: Partial<Record<SocialPlatform, PlatformResult>>;
  generateCopy: () => Promise<void>;
  publish: () => Promise<void>;
}) {
  return (
    <>
      {/* Generate button */}
      <div className="bg-white rounded-2xl shadow-sm border border-amber-100 p-4 flex items-center gap-4">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-amber-900 truncate">{selectedContent.title}</p>
          <p className="text-sm text-amber-600 truncate">{selectedContent.linkUrl}</p>
        </div>
        <button
          onClick={generateCopy}
          disabled={status === "generating" || selectedPlatforms.size === 0}
          className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white rounded-xl font-semibold transition-colors flex items-center gap-2 flex-shrink-0"
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
            <div className={`px-4 py-3 flex items-center gap-3 ${PLATFORM_COLORS[platform]} text-white`}>
              <span className="text-xl">{icon}</span>
              <span className="font-semibold">{label}</span>
              <span className="ml-auto text-sm opacity-80">
                {charCount}/{maxChars} chars
                {over && " ⚠️ Too long"}
              </span>
            </div>
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
              {result && (
                <div className={`mt-2 flex items-center gap-2 text-sm rounded-lg px-3 py-2 ${
                  result.success ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                }`}>
                  {result.success ? (
                    <>✅ Posted!{" "}{result.postUrl && <a href={result.postUrl} target="_blank" rel="noopener noreferrer" className="underline">View post →</a>}</>
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
        <div className="bg-white rounded-2xl shadow-sm border border-amber-100 p-4 flex items-center justify-between gap-4">
          <div className="text-sm text-amber-700 min-w-0">
            Ready to publish to{" "}
            <strong>{Array.from(selectedPlatforms).map((p) => PLATFORM_LIMITS[p].label).join(", ")}</strong>
          </div>
          <button
            onClick={publish}
            disabled={status === "publishing"}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-xl font-bold transition-colors flex items-center gap-2 flex-shrink-0"
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
  );
}
