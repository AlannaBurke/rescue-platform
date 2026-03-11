"use client";

/**
 * PublicShareBar — a polished share section shown at the bottom of public
 * content pages. Pre-populates the title, URL, and description for each
 * platform so visitors can share with one click.
 *
 * Supports: Facebook, X/Twitter, Bluesky, Threads, WhatsApp, Email,
 * and a native share / copy-link fallback.
 */

import { useState } from "react";
import { Copy, Check, Share2, Mail } from "lucide-react";

interface PublicShareBarProps {
  /** Page title — used in share text */
  title: string;
  /** Short description or summary — used in share text */
  description?: string;
  /** Canonical URL of the page (server-rendered, no window.location needed) */
  url: string;
  /** Optional label shown above the share buttons */
  label?: string;
}

// ─── Platform definitions ─────────────────────────────────────────────────────

interface PlatformDef {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  buildUrl: (title: string, url: string, description?: string) => string;
}

const FacebookIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const XIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const BlueskyIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.769c0 .69.378 5.65.624 6.479.815 2.736 3.713 3.66 6.383 3.364.136-.02.275-.039.415-.056-.138.022-.276.04-.415.056-3.912.58-7.387 2.005-2.83 7.078 5.013 5.19 6.87-1.113 7.823-4.308.953 3.195 2.05 9.271 7.733 4.308 4.267-4.308 1.172-6.498-2.74-7.078a8.741 8.741 0 01-.415-.056c.14.017.279.036.415.056 2.67.297 5.568-.628 6.383-3.364.246-.828.624-5.79.624-6.478 0-.69-.139-1.861-.902-2.204-.659-.299-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8z" />
  </svg>
);

const ThreadsIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.5 12.068c0-3.516.85-6.37 2.495-8.423C5.845 1.341 8.598.16 12.179.136h.014c2.64.018 4.905.73 6.73 2.117 1.714 1.302 2.88 3.13 3.464 5.432l-2.03.506c-.47-1.875-1.37-3.356-2.677-4.4-1.388-1.055-3.192-1.595-5.365-1.61-2.924.02-5.145.936-6.6 2.72-1.37 1.685-2.065 4.129-2.065 7.267 0 3.138.695 5.582 2.065 7.267 1.455 1.784 3.676 2.7 6.6 2.72 2.173-.015 3.977-.555 5.365-1.61 1.307-1.044 2.207-2.525 2.677-4.4l2.03.506c-.584 2.302-1.75 4.13-3.464 5.432-1.825 1.387-4.09 2.099-6.73 2.117z" />
  </svg>
);

const WhatsAppIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const PLATFORMS: PlatformDef[] = [
  {
    id: "facebook",
    label: "Facebook",
    icon: <FacebookIcon />,
    color: "bg-[#1877F2] hover:bg-[#166fe5] text-white",
    buildUrl: (title, url) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(title)}`,
  },
  {
    id: "x",
    label: "X / Twitter",
    icon: <XIcon />,
    color: "bg-black hover:bg-gray-800 text-white",
    buildUrl: (title, url) =>
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
  },
  {
    id: "bluesky",
    label: "Bluesky",
    icon: <BlueskyIcon />,
    color: "bg-[#0085ff] hover:bg-[#006fd6] text-white",
    buildUrl: (title, url) =>
      `https://bsky.app/intent/compose?text=${encodeURIComponent(title + "\n" + url)}`,
  },
  {
    id: "threads",
    label: "Threads",
    icon: <ThreadsIcon />,
    color: "bg-black hover:bg-gray-800 text-white",
    buildUrl: (title, url) =>
      `https://www.threads.net/intent/post?text=${encodeURIComponent(title + "\n" + url)}`,
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    icon: <WhatsAppIcon />,
    color: "bg-[#25D366] hover:bg-[#1ebe5d] text-white",
    buildUrl: (title, url) =>
      `https://wa.me/?text=${encodeURIComponent(title + "\n" + url)}`,
  },
  {
    id: "email",
    label: "Email",
    icon: <Mail className="h-4 w-4" />,
    color: "bg-stone-600 hover:bg-stone-700 text-white",
    buildUrl: (title, url, description) => {
      const body = description ? `${description}\n\n${url}` : url;
      return `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`;
    },
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function PublicShareBar({
  title,
  description,
  url,
  label = "Share this",
}: PublicShareBarProps) {
  const [copied, setCopied] = useState(false);
  const [nativeShareAvailable] = useState(
    typeof navigator !== "undefined" && typeof navigator.share === "function"
  );

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback: select text
    }
  };

  const handleNativeShare = () => {
    navigator.share({ title, text: description, url }).catch(() => {
      // User cancelled or not supported — fall back silently
    });
  };

  return (
    <div className="mt-10 border-t border-stone-100 pt-8">
      {/* Label */}
      <div className="flex items-center gap-3 mb-5">
        <Share2 className="h-5 w-5 text-stone-400 flex-shrink-0" />
        <p className="text-sm font-semibold text-stone-500 uppercase tracking-wide">{label}</p>
        <div className="flex-1 h-px bg-stone-100" />
      </div>

      {/* Platform buttons — scrollable row on mobile */}
      <div className="flex flex-wrap gap-2 sm:gap-3">
        {PLATFORMS.map((p) => (
          <a
            key={p.id}
            href={p.buildUrl(title, url, description)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Share on ${p.label}`}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all no-underline shadow-sm active:scale-95 ${p.color}`}
          >
            {p.icon}
            <span className="hidden sm:inline">{p.label}</span>
          </a>
        ))}

        {/* Native share (mobile) */}
        {nativeShareAvailable && (
          <button
            onClick={handleNativeShare}
            aria-label="Share via device"
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold bg-stone-100 text-stone-700 hover:bg-stone-200 transition-all shadow-sm active:scale-95 sm:hidden"
          >
            <Share2 className="h-4 w-4" />
            <span>More</span>
          </button>
        )}

        {/* Copy link */}
        <button
          onClick={handleCopy}
          aria-label="Copy link"
          className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold bg-stone-100 text-stone-700 hover:bg-stone-200 transition-all shadow-sm active:scale-95"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 text-green-600" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              <span className="hidden sm:inline">Copy link</span>
              <span className="sm:hidden">Copy</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
