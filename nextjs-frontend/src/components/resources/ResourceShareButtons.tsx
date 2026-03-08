"use client";

import { useState } from "react";
import { Instagram, Facebook, Twitter, Copy, Check, ExternalLink } from "lucide-react";

interface Props {
  title: string;
  shareTargets: string[];
  imageUrl: string;
  /** The rescue's social handles, e.g. { instagram: "@rescueplatform" } */
  handles?: Record<string, string>;
}

const PLATFORM_CONFIG: Record<string, {
  label: string;
  icon: React.ReactNode;
  color: string;
  buildUrl: (title: string, url: string, handle?: string) => string;
}> = {
  facebook: {
    label: "Facebook",
    icon: <Facebook className="h-4 w-4" />,
    color: "bg-[#1877f2] hover:bg-[#166fe5]",
    buildUrl: (_title, url) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  twitter: {
    label: "X / Twitter",
    icon: <Twitter className="h-4 w-4" />,
    color: "bg-[#000000] hover:bg-[#333]",
    buildUrl: (title, url, handle) => {
      const text = handle ? `${title} via ${handle}` : title;
      return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    },
  },
  instagram: {
    label: "Instagram",
    icon: <Instagram className="h-4 w-4" />,
    color: "bg-gradient-to-br from-[#f09433] via-[#e6683c] to-[#bc1888] hover:opacity-90",
    // Instagram doesn't support direct share links — we open the image for manual sharing
    buildUrl: (_title, _url, _handle) => "#instagram-share",
  },
  bluesky: {
    label: "Bluesky",
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.815 2.736 3.713 3.66 6.383 3.364.136-.02.275-.039.415-.056-.138.022-.276.04-.415.056-3.912.58-7.387 2.005-2.83 7.078 5.013 5.19 6.87-1.113 7.823-4.308.953 3.195 2.05 9.271 7.733 4.308 4.267-4.308 1.172-6.498-2.74-7.078a8.741 8.741 0 01-.415-.056c.14.017.279.036.415.056 2.67.297 5.568-.628 6.383-3.364.246-.828.624-5.79.624-6.478 0-.69-.139-1.861-.902-2.204-.659-.299-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8z" />
      </svg>
    ),
    color: "bg-[#0085ff] hover:bg-[#006fd6]",
    buildUrl: (title, url, handle) => {
      const text = handle ? `${title} — ${handle}` : title;
      return `https://bsky.app/intent/compose?text=${encodeURIComponent(text + "\n" + url)}`;
    },
  },
  threads: {
    label: "Threads",
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.5 12.068c0-3.516.85-6.37 2.495-8.423C5.845 1.341 8.598.16 12.179.136h.014c2.64.018 4.905.73 6.73 2.117 1.714 1.302 2.88 3.13 3.464 5.432l-2.03.506c-.47-1.875-1.37-3.356-2.677-4.4-1.388-1.055-3.192-1.595-5.365-1.61-2.924.02-5.145.936-6.6 2.72-1.37 1.685-2.065 4.129-2.065 7.267 0 3.138.695 5.582 2.065 7.267 1.455 1.784 3.676 2.7 6.6 2.72 2.173-.015 3.977-.555 5.365-1.61 1.307-1.044 2.207-2.525 2.677-4.4l2.03.506c-.584 2.302-1.75 4.13-3.464 5.432-1.825 1.387-4.09 2.099-6.73 2.117z" />
      </svg>
    ),
    color: "bg-[#000000] hover:bg-[#333]",
    buildUrl: (title, url, handle) => {
      const text = handle ? `${title} — ${handle}` : title;
      return `https://www.threads.net/intent/post?text=${encodeURIComponent(text + "\n" + url)}`;
    },
  },
};

export default function ResourceShareButtons({ title, shareTargets, imageUrl, handles }: Props) {
  const [copied, setCopied] = useState(false);
  const [instagramOpen, setInstagramOpen] = useState(false);

  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleInstagram = () => {
    setInstagramOpen(true);
  };

  return (
    <div className="space-y-2">
      {shareTargets.map((platform) => {
        const config = PLATFORM_CONFIG[platform];
        if (!config) return null;

        const handle = handles?.[platform];

        if (platform === "instagram") {
          return (
            <div key={platform}>
              <button
                onClick={handleInstagram}
                className={`flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-white transition-all ${config.color}`}
              >
                {config.icon}
                Share on {config.label}
              </button>
              {instagramOpen && (
                <div className="mt-2 p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-600 space-y-2">
                  <p className="font-semibold text-stone-700">To share on Instagram:</p>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>
                      <a href={imageUrl} target="_blank" rel="noopener noreferrer" className="text-primary-600 underline inline-flex items-center gap-1">
                        Download the image <ExternalLink className="h-3 w-3" />
                      </a>
                    </li>
                    <li>Open Instagram and create a new post or story</li>
                    <li>Upload the image and add the caption:</li>
                  </ol>
                  <div className="bg-white rounded-lg p-2 border border-stone-200 font-mono text-xs select-all">
                    {title}{handle ? ` — follow us ${handle}` : ""}
                  </div>
                </div>
              )}
            </div>
          );
        }

        const shareUrl = config.buildUrl(title, currentUrl, handle);

        return (
          <a
            key={platform}
            href={shareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-white transition-all no-underline ${config.color}`}
          >
            {config.icon}
            Share on {config.label}
            {handle && <span className="ml-auto text-xs opacity-75">{handle}</span>}
          </a>
        );
      })}

      {/* Copy link */}
      <button
        onClick={handleCopy}
        className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold bg-stone-100 text-stone-700 hover:bg-stone-200 transition-all"
      >
        {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
        {copied ? "Link copied!" : "Copy link"}
      </button>
    </div>
  );
}
