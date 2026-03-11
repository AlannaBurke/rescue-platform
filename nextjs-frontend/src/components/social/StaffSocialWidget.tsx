"use client";

/**
 * StaffSocialWidget — shown on content detail pages when the user is in
 * preview/admin mode. Links to the AI Social Publisher pre-loaded with
 * the current content so staff can push it to the rescue's social accounts
 * in one click.
 *
 * This is a client component because it reads the current URL to build the
 * return link, and conditionally renders based on preview mode.
 */

import Link from "next/link";
import { Megaphone, ExternalLink } from "lucide-react";

interface StaffSocialWidgetProps {
  /** Drupal node ID (UUID) */
  contentId: string;
  /** Content type slug used by the social publisher */
  contentType: "animal" | "blog" | "resource" | "event";
  /** Human-readable content title */
  title: string;
  /** Whether to show this widget (only in preview/admin context) */
  show: boolean;
}

export default function StaffSocialWidget({
  contentId,
  contentType,
  title,
  show,
}: StaffSocialWidgetProps) {
  if (!show) return null;

  // Build the social publisher URL with pre-selection params
  const publisherUrl =
    `/admin/social-publish?contentType=${encodeURIComponent(contentType)}&contentId=${encodeURIComponent(contentId)}`;

  return (
    <div className="rounded-2xl border border-teal-200 bg-teal-50 p-5 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-600 text-white shadow-sm flex-shrink-0">
          <Megaphone className="h-4 w-4" />
        </div>
        <div>
          <p className="text-sm font-bold text-teal-900">Share to Our Socials</p>
          <p className="text-xs text-teal-700">Staff only — not visible to the public</p>
        </div>
      </div>

      {/* Content preview */}
      <p className="text-xs text-teal-800 mb-4 line-clamp-2 leading-relaxed">
        <span className="font-semibold">"{title}"</span> — Open the AI Social Publisher to generate
        a caption and post this to Facebook, Instagram, Bluesky, and more.
      </p>

      {/* CTA */}
      <Link
        href={publisherUrl}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-teal-700 active:bg-teal-800 transition-colors no-underline"
      >
        <Megaphone className="h-4 w-4" />
        Open Social Publisher
        <ExternalLink className="h-3.5 w-3.5 opacity-75" />
      </Link>
    </div>
  );
}
