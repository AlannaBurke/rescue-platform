"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ContentCounts {
  animal: number;
  blog_post: number;
  event: number;
  resource: number;
  vet: number;
  organization: number;
  person: number;
  expense: number;
  medical_record: number;
}

interface FormCounts {
  adoption_application: number;
  foster_application: number;
  surrender_intake: number;
  volunteer_application: number;
  contact: number;
}

interface DashboardData {
  content: ContentCounts;
  forms: FormCounts;
}

// ─── Quick-link card ──────────────────────────────────────────────────────────

function QuickCard({
  icon,
  label,
  description,
  href,
  count,
  badge,
  external = false,
  urgent = false,
}: {
  icon: string;
  label: string;
  description: string;
  href: string;
  count?: number;
  badge?: string;
  external?: boolean;
  urgent?: boolean;
}) {
  const inner = (
    <div
      className={`group bg-white rounded-2xl border shadow-sm active:scale-95 transition-all duration-150 p-4 sm:p-5 flex flex-col gap-2 cursor-pointer h-full min-h-[100px] ${
        urgent
          ? "border-orange-300 shadow-orange-100"
          : "border-amber-100 hover:shadow-md hover:border-amber-300"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-3xl leading-none">{icon}</span>
        <div className="flex flex-col items-end gap-1">
          {count !== undefined && count > 0 && (
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                urgent
                  ? "bg-orange-100 text-orange-800"
                  : "bg-amber-100 text-amber-800"
              }`}
            >
              {count}
            </span>
          )}
          {badge && (
            <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-1 rounded-full">
              {badge}
            </span>
          )}
        </div>
      </div>
      <div>
        <p
          className={`font-semibold text-base leading-tight ${
            urgent
              ? "text-orange-900 group-hover:text-orange-700"
              : "text-amber-900 group-hover:text-amber-700"
          } transition-colors`}
        >
          {label}
        </p>
        <p className="text-sm text-amber-600 mt-0.5 leading-snug hidden sm:block">
          {description}
        </p>
      </div>
    </div>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="block h-full">
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} className="block h-full">
      {inner}
    </Link>
  );
}

// ─── Collapsible section ──────────────────────────────────────────────────────

function Section({
  icon,
  title,
  subtitle,
  color,
  children,
  defaultOpen = true,
}: {
  icon: string;
  title: string;
  subtitle: string;
  color: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section>
      <button
        onClick={() => setOpen((o) => !o)}
        className={`w-full rounded-2xl p-4 sm:p-5 mb-4 ${color} flex items-center gap-3 text-left`}
        aria-expanded={open}
      >
        <span className="text-2xl sm:text-3xl">{icon}</span>
        <div className="flex-1 min-w-0">
          <h2 className="text-lg sm:text-xl font-bold text-white leading-tight">{title}</h2>
          <p className="text-sm text-white/80 hidden sm:block">{subtitle}</p>
        </div>
        <span className="text-white/80 text-xl ml-auto flex-shrink-0">
          {open ? "▲" : "▼"}
        </span>
      </button>

      {open && (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {children}
        </div>
      )}
    </section>
  );
}

// ─── Main dashboard ───────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const drupalBase =
    process.env.NEXT_PUBLIC_DRUPAL_BASE_URL ?? "http://localhost:8888";

  useEffect(() => {
    fetch("/api/admin/dashboard-stats")
      .then((r) => r.json())
      .then((d: DashboardData) => setData(d))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  const c = data?.content;
  const f = data?.forms;

  const totalPendingApps =
    (f?.adoption_application ?? 0) +
    (f?.foster_application ?? 0) +
    (f?.volunteer_application ?? 0) +
    (f?.surrender_intake ?? 0);

  return (
    <div className="min-h-screen bg-amber-50">

      {/* ── Top bar ── */}
      <div className="bg-white border-b border-amber-200 px-4 sm:px-6 py-3 sm:py-4 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <span className="text-2xl flex-shrink-0">🐾</span>
            <div className="min-w-0">
              <h1 className="text-base sm:text-xl font-bold text-amber-900 leading-tight truncate">
                Rescue Admin
              </h1>
              <p className="text-xs text-amber-600 hidden sm:block">
                Manage your rescue's website and operations
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <a
              href="/"
              className="text-xs sm:text-sm text-amber-700 hover:text-amber-900 border border-amber-200 rounded-lg px-2 sm:px-3 py-1.5 hover:bg-amber-50 transition-colors whitespace-nowrap"
            >
              ← Site
            </a>
            <a
              href={`${drupalBase}/user/login`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs sm:text-sm bg-amber-600 hover:bg-amber-700 text-white rounded-lg px-2 sm:px-3 py-1.5 transition-colors whitespace-nowrap"
            >
              Drupal →
            </a>
          </div>
        </div>
      </div>

      {/* ── Urgent alerts bar (only if pending apps) ── */}
      {!loading && totalPendingApps > 0 && (
        <div className="bg-orange-50 border-b border-orange-200 px-4 py-2">
          <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm text-orange-800">
            <span className="text-base">🔔</span>
            <span className="font-semibold">{totalPendingApps} pending application{totalPendingApps !== 1 ? "s" : ""}</span>
            <span className="text-orange-600 hidden sm:inline">— review them in Manage Rescue below</span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8 space-y-6 sm:space-y-10">

        {/* ── Quick stats strip (mobile-first) ── */}
        {!loading && data && (
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-4">
            {[
              { label: "Animals", value: c?.animal ?? 0, icon: "🐾" },
              { label: "Blog Posts", value: c?.blog_post ?? 0, icon: "📝" },
              { label: "Events", value: c?.event ?? 0, icon: "📅" },
              {
                label: "Pending",
                value: totalPendingApps,
                icon: "📋",
                urgent: totalPendingApps > 0,
              },
              { label: "Resources", value: c?.resource ?? 0, icon: "📚" },
            ].map(({ label, value, icon, urgent }) => (
              <div
                key={label}
                className={`rounded-xl p-2 sm:p-3 text-center ${
                  urgent && value > 0 ? "bg-orange-100" : "bg-white border border-amber-100"
                }`}
              >
                <div className="text-xl sm:text-2xl mb-0.5">{icon}</div>
                <div
                  className={`text-xl sm:text-2xl font-bold ${
                    urgent && value > 0 ? "text-orange-800" : "text-amber-900"
                  }`}
                >
                  {value}
                </div>
                <div className="text-xs text-amber-600 leading-tight">{label}</div>
              </div>
            ))}
          </div>
        )}

        {/* ── SECTION 1: Manage Site ── */}
        <Section
          icon="🌐"
          title="Manage Site"
          subtitle="Everything that appears on your public-facing website"
          color="bg-amber-600"
        >
          <QuickCard
            icon="🐾"
            label="Animals"
            description="Add, edit, or update adoptable animals, fosters, and sanctuary residents"
            href={`${drupalBase}/admin/content?type=animal`}
            count={loading ? undefined : c?.animal}
            external
          />

          <QuickCard
            icon="📝"
            label="Blog Posts"
            description="Write and publish articles, stories, and rescue updates"
            href={`${drupalBase}/admin/content?type=blog_post`}
            count={loading ? undefined : c?.blog_post}
            external
          />

          <QuickCard
            icon="📅"
            label="Events"
            description="Create adoption events, fundraisers, and community gatherings"
            href={`${drupalBase}/admin/content?type=event`}
            count={loading ? undefined : c?.event}
            external
          />

          <QuickCard
            icon="📚"
            label="Resources"
            description="Publish care guides, FAQs, and educational content for adopters"
            href={`${drupalBase}/admin/content?type=resource`}
            count={loading ? undefined : c?.resource}
            external
          />

          <QuickCard
            icon="🏥"
            label="Vets & Clinics"
            description="Maintain your list of recommended veterinarians and exotic specialists"
            href={`${drupalBase}/admin/content?type=vet`}
            count={loading ? undefined : c?.vet}
            external
          />

          <QuickCard
            icon="📥"
            label="Import Vets (CSV)"
            description="Bulk-add vet practices from a spreadsheet — download the template to get started"
            href="/admin/vet-import"
          />

          <QuickCard
            icon="🏠"
            label="About & Pages"
            description="Edit your organization info, mission, and static pages"
            href={`${drupalBase}/admin/content?type=organization`}
            count={loading ? undefined : c?.organization}
            external
          />

          <QuickCard
            icon="⚙️"
            label="Site Settings"
            description="Update your rescue name, social media handles, and contact info"
            href={`${drupalBase}/admin/content?type=site_settings`}
            external
          />

          <QuickCard
            icon="🧭"
            label="Navigation"
            description="Manage menus and navigation links across the site"
            href={`${drupalBase}/admin/structure/menu`}
            external
          />

          <QuickCard
            icon="📣"
            label="Social Publisher"
            description="Generate AI-powered posts and publish to Facebook, Bluesky, Instagram, and more"
            href="/admin/social-publish"
            badge="AI"
          />

          <QuickCard
            icon="🖼️"
            label="Media Library"
            description="Upload and manage photos, documents, and other media files"
            href={`${drupalBase}/admin/content/media`}
            external
          />
        </Section>

        {/* ── SECTION 2: Manage Rescue ── */}
        <Section
          icon="🏡"
          title="Manage Rescue"
          subtitle="Internal operations: applications, records, finances, and volunteers"
          color="bg-teal-600"
        >
          <QuickCard
            icon="📋"
            label="Adoptions"
            description="Review and process incoming adoption applications"
            href={`${drupalBase}/admin/webform/manage/adoption_application/results/submissions`}
            count={loading ? undefined : f?.adoption_application}
            urgent={(f?.adoption_application ?? 0) > 0}
            external
          />

          <QuickCard
            icon="🏠"
            label="Foster Apps"
            description="Review foster home applications and match animals to fosters"
            href={`${drupalBase}/admin/webform/manage/foster_application/results/submissions`}
            count={loading ? undefined : f?.foster_application}
            urgent={(f?.foster_application ?? 0) > 0}
            external
          />

          <QuickCard
            icon="🤝"
            label="Volunteers"
            description="Review volunteer sign-ups and manage your volunteer roster"
            href={`${drupalBase}/admin/webform/manage/volunteer_application/results/submissions`}
            count={loading ? undefined : f?.volunteer_application}
            external
          />

          <QuickCard
            icon="📦"
            label="Surrenders"
            description="Review owner-surrender intake forms and plan animal intake"
            href={`${drupalBase}/admin/webform/manage/surrender_intake/results/submissions`}
            count={loading ? undefined : f?.surrender_intake}
            urgent={(f?.surrender_intake ?? 0) > 0}
            external
          />

          <QuickCard
            icon="💬"
            label="Messages"
            description="Read and respond to messages submitted through the contact form"
            href={`${drupalBase}/admin/webform/manage/contact/results/submissions`}
            count={loading ? undefined : f?.contact}
            external
          />

          <QuickCard
            icon="👥"
            label="People"
            description="Manage team members, fosters, volunteers, and adopters"
            href={`${drupalBase}/admin/content?type=person`}
            count={loading ? undefined : c?.person}
            external
          />

          <QuickCard
            icon="🩺"
            label="Medical"
            description="Track vaccinations, treatments, and health records"
            href={`${drupalBase}/admin/content?type=medical_record`}
            count={loading ? undefined : c?.medical_record}
            external
          />

          <QuickCard
            icon="💰"
            label="Expenses"
            description="Log and track rescue expenses: vet bills, supplies, and more"
            href={`${drupalBase}/admin/content?type=expense`}
            count={loading ? undefined : c?.expense}
            external
          />

          <QuickCard
            icon="👤"
            label="User Accounts"
            description="Manage staff and volunteer login accounts and permissions"
            href={`${drupalBase}/admin/people`}
            external
          />
        </Section>

        {/* ── Footer ── */}
        <footer className="text-center text-xs text-amber-400 pb-4">
          Rescue Platform — Open Source CMS for Small Animal Rescues ·{" "}
          <a
            href="https://github.com/AlannaBurke/rescue-platform"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-amber-600"
          >
            GitHub
          </a>
        </footer>

      </div>

      {/* ── Mobile bottom quick-action bar ── */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-amber-200 px-4 py-2 flex items-center justify-around sm:hidden z-40 shadow-lg">
        <a
          href={`${drupalBase}/node/add/animal`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-0.5 text-amber-700 active:text-amber-900"
        >
          <span className="text-2xl">🐾</span>
          <span className="text-[10px] font-medium">Add Animal</span>
        </a>
        <a
          href={`${drupalBase}/node/add/blog_post`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-0.5 text-amber-700 active:text-amber-900"
        >
          <span className="text-2xl">📝</span>
          <span className="text-[10px] font-medium">New Post</span>
        </a>
        <Link
          href="/admin/social-publish"
          className="flex flex-col items-center gap-0.5 text-amber-700 active:text-amber-900"
        >
          <span className="text-2xl">📣</span>
          <span className="text-[10px] font-medium">Social</span>
        </Link>
        <a
          href={`${drupalBase}/admin/webform/manage/adoption_application/results/submissions`}
          target="_blank"
          rel="noopener noreferrer"
          className="relative flex flex-col items-center gap-0.5 text-amber-700 active:text-amber-900"
        >
          <span className="text-2xl">📋</span>
          {!loading && (f?.adoption_application ?? 0) > 0 && (
            <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
              {f!.adoption_application}
            </span>
          )}
          <span className="text-[10px] font-medium">Apps</span>
        </a>
        <a
          href={`${drupalBase}/admin/content`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-0.5 text-amber-700 active:text-amber-900"
        >
          <span className="text-2xl">⚙️</span>
          <span className="text-[10px] font-medium">All Content</span>
        </a>
      </div>

      {/* Bottom padding on mobile to avoid content hiding behind the bottom bar */}
      <div className="h-16 sm:hidden" />

    </div>
  );
}
