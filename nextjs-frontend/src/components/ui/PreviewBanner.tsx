"use client";

/**
 * PreviewBanner
 *
 * Shown at the top of every page when Next.js Draft Mode is active.
 * Provides an "Exit Preview" button that disables draft mode and returns
 * the editor to the same page.
 */

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Eye, X } from "lucide-react";

export default function PreviewBanner() {
  const pathname = usePathname();

  return (
    <div className="sticky top-0 z-50 flex items-center justify-between gap-4 bg-amber-400 px-4 py-2 text-sm font-medium text-amber-900 shadow-md">
      <span className="flex items-center gap-2">
        <Eye className="h-4 w-4 shrink-0" />
        <strong>Preview Mode</strong> — You are viewing unpublished content.
        This page is not visible to the public.
      </span>
      <Link
        href={`/api/preview/disable?returnTo=${encodeURIComponent(pathname)}`}
        className="flex items-center gap-1.5 rounded-full bg-amber-900/10 px-3 py-1 text-xs font-semibold hover:bg-amber-900/20 transition-colors whitespace-nowrap"
      >
        <X className="h-3.5 w-3.5" />
        Exit Preview
      </Link>
    </div>
  );
}
