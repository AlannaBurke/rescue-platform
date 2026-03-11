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
}: {
  icon: string;
  label: string;
  description: string;
  href: string;
  count?: number;
  badge?: string;
  external?: boolean;
}) {
  const inner = (
    <div className="group bg-white rounded-2xl border border-amber-100 shadow-sm hover:shadow-md hover:border-amber-300 transition-all p-5 flex flex-col gap-2 cursor-pointer h-full">
      <div className="flex items-start justify-between">
        <span className="text-3xl">{icon}</span>
        {count !== undefined && (
          <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2.5 py-1 rounded-full">
            {count}
          </span>
        )}
        {badge && (
          <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-1 rounded-full">
            {badge}
          </span>
        )}
      </div>
      <div>
        <p className="font-semibold text-amber-900 group-hover:text-amber-700 transition-colors">
          {label}
        </p>
        <p className="text-sm text-amber-600 mt-0.5 leading-snug">{description}</p>
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

// ─── Section header ───────────────────────────────────────────────────────────

function SectionHeader({
  icon,
  title,
  subtitle,
  color,
}: {
  icon: string;
  title: string;
  subtitle: string;
  color: string;
}) {
  return (
    <div className={`rounded-2xl p-5 mb-5 ${color}`}>
      <div className="flex items-center gap-3">
        <span className="text-3xl">{icon}</span>
        <div>
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <p className="text-sm text-white/80">{subtitle}</p>
        </div>
      </div>
    </div>
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

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Top bar */}
      <div className="bg-white border-b border-amber-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🐾</span>
          <div>
            <h1 className="text-xl font-bold text-amber-900">Rescue Platform Admin</h1>
            <p className="text-xs text-amber-600">Manage your rescue's website and operations</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/"
            className="text-sm text-amber-700 hover:text-amber-900 border border-amber-200 rounded-lg px-3 py-1.5 hover:bg-amber-50 transition-colors"
          >
            ← View Public Site
          </a>
          <a
            href={`${drupalBase}/user/login`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm bg-amber-600 hover:bg-amber-700 text-white rounded-lg px-3 py-1.5 transition-colors"
          >
            Drupal Admin →
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">

        {/* ── SECTION 1: Manage Site ── */}
        <section>
          <SectionHeader
            icon="🌐"
            title="Manage Site"
            subtitle="Everything that appears on your public-facing website"
            color="bg-amber-600"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">

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

          </div>
        </section>

        {/* ── SECTION 2: Manage Rescue ── */}
        <section>
          <SectionHeader
            icon="🏡"
            title="Manage Rescue"
            subtitle="Internal operations: applications, records, finances, and volunteers"
            color="bg-teal-600"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">

            <QuickCard
              icon="📋"
              label="Adoption Applications"
              description="Review and process incoming adoption applications"
              href={`${drupalBase}/admin/webform/manage/adoption_application/results/submissions`}
              count={loading ? undefined : f?.adoption_application}
              external
            />

            <QuickCard
              icon="🏠"
              label="Foster Applications"
              description="Review foster home applications and match animals to fosters"
              href={`${drupalBase}/admin/webform/manage/foster_application/results/submissions`}
              count={loading ? undefined : f?.foster_application}
              external
            />

            <QuickCard
              icon="🤝"
              label="Volunteer Applications"
              description="Review volunteer sign-ups and manage your volunteer roster"
              href={`${drupalBase}/admin/webform/manage/volunteer_application/results/submissions`}
              count={loading ? undefined : f?.volunteer_application}
              external
            />

            <QuickCard
              icon="📦"
              label="Surrender Requests"
              description="Review owner-surrender intake forms and plan animal intake"
              href={`${drupalBase}/admin/webform/manage/surrender_intake/results/submissions`}
              count={loading ? undefined : f?.surrender_intake}
              external
            />

            <QuickCard
              icon="💬"
              label="Contact Messages"
              description="Read and respond to messages submitted through the contact form"
              href={`${drupalBase}/admin/webform/manage/contact/results/submissions`}
              count={loading ? undefined : f?.contact}
              external
            />

            <QuickCard
              icon="👥"
              label="People & Staff"
              description="Manage team members, fosters, volunteers, and adopters"
              href={`${drupalBase}/admin/content?type=person`}
              count={loading ? undefined : c?.person}
              external
            />

            <QuickCard
              icon="🩺"
              label="Medical Records"
              description="Track vaccinations, treatments, and health history for each animal"
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

          </div>
        </section>

        {/* ── Quick stats bar ── */}
        {!loading && data && (
          <section className="bg-white rounded-2xl border border-amber-100 shadow-sm p-6">
            <h3 className="font-semibold text-amber-900 mb-4">Quick Overview</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 text-center">
              {[
                { label: "Animals", value: c?.animal ?? 0, icon: "🐾" },
                { label: "Blog Posts", value: c?.blog_post ?? 0, icon: "📝" },
                { label: "Events", value: c?.event ?? 0, icon: "📅" },
                { label: "Resources", value: c?.resource ?? 0, icon: "📚" },
                {
                  label: "Pending Apps",
                  value:
                    (f?.adoption_application ?? 0) +
                    (f?.foster_application ?? 0) +
                    (f?.volunteer_application ?? 0),
                  icon: "📋",
                },
              ].map(({ label, value, icon }) => (
                <div key={label} className="bg-amber-50 rounded-xl p-3">
                  <div className="text-2xl mb-1">{icon}</div>
                  <div className="text-2xl font-bold text-amber-900">{value}</div>
                  <div className="text-xs text-amber-600">{label}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Footer ── */}
        <footer className="text-center text-xs text-amber-400 pb-4">
          Rescue Platform — Open Source CMS for Small Animal Rescues ·{" "}
          <a
            href="https://github.com/your-org/rescue-platform"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-amber-600"
          >
            GitHub
          </a>
        </footer>

      </div>
    </div>
  );
}
