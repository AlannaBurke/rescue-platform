import Link from "next/link";
import Image from "next/image";
import { Heart, Users, Home, Calendar, ArrowRight, Sparkles, Star } from "lucide-react";
import { getClient } from "@/lib/apollo-client";
import { GET_ANIMALS_LIST } from "@/lib/graphql/animals";
import { GET_BLOG_POSTS, GET_EVENTS } from "@/lib/graphql/content";
import AnimalCard from "@/components/animals/AnimalCard";
import BlogPostCard from "@/components/blog/BlogPostCard";
import EventCard from "@/components/events/EventCard";
import type { Animal, BlogPost } from "@/types/drupal";
import type { GetAnimalsListQuery, GetBlogPostsQuery } from "@/types/graphql";

const stats = [
  { label: "Animals Rescued", value: "500+", icon: Heart, color: "bg-[#e8f8f9] text-[#1a7f87]", iconColor: "text-[#2099a1]" },
  { label: "Happy Adoptions", value: "450+", icon: Home, color: "bg-[#fdf5ef] text-[#b86440]", iconColor: "text-[#e8a87c]" },
  { label: "Active Fosters", value: "60+", icon: Users, color: "bg-[#eef4f0] text-[#2f7044]", iconColor: "text-[#4a8c60]" },
  { label: "Events This Year", value: "24", icon: Calendar, color: "bg-[#f0edf8] text-[#6e4fba]", iconColor: "text-[#8b6ecf]" },
];

const howToHelp = [
  {
    illustration: "/illustrations/foster-banner.png",
    icon: "🏠",
    title: "Foster",
    description: "Open your home temporarily to an animal in need. Fosters save lives by freeing up space and providing love.",
    href: "/foster",
    cta: "Become a Foster",
    bg: "bg-[#e8f8f9]",
    border: "border-[#c5eef1]",
    ctaStyle: "bg-[#2099a1] text-white hover:bg-[#1a7f87]",
  },
  {
    illustration: "/illustrations/icon-volunteer.png",
    icon: "🤝",
    title: "Volunteer",
    description: "Help with transport, events, photography, social media, and more. Every skill is valuable.",
    href: "/volunteer",
    cta: "Volunteer With Us",
    bg: "bg-[#fdf5ef]",
    border: "border-[#fae8d8]",
    ctaStyle: "bg-[#e8a87c] text-white hover:bg-[#d4845a]",
  },
  {
    illustration: "/illustrations/donate-banner.png",
    icon: "💝",
    title: "Donate",
    description: "Your donation funds medical care, food, and supplies for animals in our care.",
    href: "/donate",
    cta: "Make a Donation",
    bg: "bg-[#eef4f0]",
    border: "border-[#d4e8da]",
    ctaStyle: "bg-[#4a8c60] text-white hover:bg-[#2f7044]",
  },
];

export default async function HomePage() {
  const { data: animalsData } = await getClient().query<GetAnimalsListQuery>({
    query: GET_ANIMALS_LIST,
    variables: { first: 12 },
  });

  const allAnimals: Animal[] = animalsData?.nodeAnimals?.nodes || [];
  const featuredAnimals = allAnimals
    .filter(
      (a) =>
        a.status &&
        !a.excludePublic &&
        (a.isFeatured ||
          a.lifecycleStatus?.name === "Available" ||
          a.animalStatus?.name === "Available")
    )
    .sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0))
    .slice(0, 3);

  const { data: blogData } = await getClient().query<GetBlogPostsQuery>({
    query: GET_BLOG_POSTS,
    variables: { first: 3 },
  });

  const latestPosts: BlogPost[] = (blogData?.nodeBlogPosts?.nodes || [])
    .filter((p: BlogPost) => p.status)
    .slice(0, 3);

  let upcomingEvents: any[] = [];
  try {
    const { data: eventsData } = await getClient().query({
      query: GET_EVENTS,
      variables: { first: 20 },
    });
    const now = new Date();
    upcomingEvents = ((eventsData as any)?.nodeEvents?.nodes ?? [])
      .filter((e: any) => e.eventDate && new Date(e.eventDate.time) >= now)
      .sort((a: any, b: any) => new Date(a.eventDate.time).getTime() - new Date(b.eventDate.time).getTime())
      .slice(0, 3);
  } catch (e) {
    // Events are optional on homepage
  }

  return (
    <div className="min-h-screen">

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-[#e8f8f9] via-[#f9fafb] to-[#fdf5ef] overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#c5eef1] rounded-full opacity-30 blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#fae8d8] rounded-full opacity-30 blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#2099a1]/10 text-[#1a7f87] text-sm font-bold mb-6">
                <Sparkles className="w-4 h-4" />
                Every little life matters
              </div>
              <h1
                className="text-5xl sm:text-6xl text-[#0a3d42] mb-6 leading-tight"
                style={{ fontFamily: "'Fredoka One', ui-rounded, system-ui, sans-serif" }}
              >
                Give a Small Animal a{" "}
                <span className="text-[#2099a1]">Second Chance</span>
              </h1>
              <p className="text-lg text-[#484838] mb-8 leading-relaxed max-w-lg">
                We rescue, rehabilitate, and rehome rabbits, guinea pigs, and other
                small animals in need. Find your perfect companion, become a foster,
                or support our mission today.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/adopt"
                  className="inline-flex items-center gap-2 rounded-full bg-[#2099a1] px-7 py-3.5 text-base font-bold text-white shadow-[0_4px_24px_-4px_rgba(32,153,161,0.4)] hover:bg-[#1a7f87] hover:shadow-[0_8px_32px_-4px_rgba(32,153,161,0.35)] transition-all duration-200 no-underline"
                >
                  <Heart className="h-5 w-5 fill-white" />
                  Meet Our Animals
                </Link>
                <Link
                  href="/foster"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-base font-bold text-[#484838] shadow-[0_2px_15px_-3px_rgba(32,153,161,0.12)] border border-[#e8e8e0] hover:border-[#2099a1] hover:text-[#1a7f87] transition-all duration-200 no-underline"
                >
                  Become a Foster
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </div>

            {/* Illustration */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#c5eef1] to-[#fae8d8] rounded-[3rem] blur-2xl opacity-50 scale-110" />
                <div className="relative rounded-[3rem] overflow-hidden shadow-[0_8px_32px_-4px_rgba(32,153,161,0.25)]">
                  <Image
                    src="/illustrations/hero-animals.png"
                    alt="Cute small animals in a watercolor garden"
                    width={520}
                    height={420}
                    className="w-full max-w-md lg:max-w-lg object-cover"
                    priority
                  />
                </div>
                {/* Floating badge */}
                <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl px-4 py-3 shadow-[0_4px_24px_-4px_rgba(32,153,161,0.2)] flex items-center gap-2.5">
                  <div className="flex -space-x-1">
                    {["🐰","🐹","🐾"].map((e, i) => (
                      <span key={i} className="text-xl">{e}</span>
                    ))}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#0a3d42]">500+ Rescued</div>
                    <div className="text-xs text-[#8c8c7c]">and counting</div>
                  </div>
                </div>
                {/* Star badge */}
                <div className="absolute -top-4 -right-4 bg-[#2099a1] rounded-2xl px-3 py-2 shadow-[0_4px_24px_-4px_rgba(32,153,161,0.4)] flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-white fill-white" />
                  <span className="text-xs font-bold text-white">501(c)(3)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave bottom */}
        <div className="overflow-hidden leading-none">
          <svg viewBox="0 0 1440 40" xmlns="http://www.w3.org/2000/svg" className="w-full block">
            <path fill="white" d="M0,20 C360,40 1080,0 1440,20 L1440,40 L0,40 Z" />
          </svg>
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────────────────── */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className={`flex flex-col items-center text-center p-5 rounded-3xl ${stat.color} border border-white/50`}
              >
                <stat.icon className={`h-6 w-6 ${stat.iconColor} mb-2`} />
                <p
                  className="text-3xl font-bold"
                  style={{ fontFamily: "'Fredoka One', ui-rounded, system-ui, sans-serif" }}
                >
                  {stat.value}
                </p>
                <p className="text-sm font-medium mt-0.5 opacity-75">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED ANIMALS ─────────────────────────────────────── */}
      {featuredAnimals.length > 0 && (
        <section className="py-16 bg-[#f9fafb]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-8">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#e8f8f9] text-[#1a7f87] text-xs font-bold mb-3">
                  <Heart className="w-3.5 h-3.5 fill-[#2099a1]" />
                  Looking for a Home
                </div>
                <h2
                  className="text-3xl text-[#0a3d42]"
                  style={{ fontFamily: "'Fredoka One', ui-rounded, system-ui, sans-serif" }}
                >
                  Meet Our Animals
                </h2>
                <p className="text-[#8c8c7c] mt-1">These little ones are ready to meet you.</p>
              </div>
              <Link
                href="/adopt"
                className="hidden sm:inline-flex items-center gap-1.5 text-sm font-bold text-[#2099a1] hover:text-[#1a7f87] no-underline"
              >
                See all animals
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredAnimals.map((animal) => (
                <AnimalCard key={animal.id} animal={animal} />
              ))}
            </div>
            <div className="mt-8 text-center sm:hidden">
              <Link
                href="/adopt"
                className="inline-flex items-center gap-2 rounded-full bg-[#2099a1] px-6 py-3 text-sm font-bold text-white hover:bg-[#1a7f87] transition-colors no-underline"
              >
                <Heart className="h-4 w-4 fill-white" />
                See all animals
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── HOW TO HELP ──────────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2
              className="text-3xl text-[#0a3d42]"
              style={{ fontFamily: "'Fredoka One', ui-rounded, system-ui, sans-serif" }}
            >
              How You Can Help
            </h2>
            <p className="text-[#8c8c7c] mt-2">Every action makes a difference in an animal&apos;s life.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {howToHelp.map((item) => (
              <div
                key={item.title}
                className={`flex flex-col items-center text-center p-6 rounded-3xl ${item.bg} border ${item.border} hover:shadow-[0_4px_24px_-4px_rgba(32,153,161,0.15)] transition-all duration-200`}
              >
                <div className="w-24 h-24 mb-4 flex items-center justify-center">
                  <Image
                    src={item.illustration}
                    alt={item.title}
                    width={96}
                    height={96}
                    className="object-contain drop-shadow-md"
                  />
                </div>
                <h3
                  className="text-xl text-[#0a3d42] mb-2"
                  style={{ fontFamily: "'Fredoka One', ui-rounded, system-ui, sans-serif" }}
                >
                  {item.title}
                </h3>
                <p className="text-[#686858] text-sm leading-relaxed mb-5 flex-1">
                  {item.description}
                </p>
                <Link
                  href={item.href}
                  className={`inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-bold ${item.ctaStyle} transition-all duration-200 no-underline shadow-sm`}
                >
                  {item.cta}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SANCTUARY TEASER ─────────────────────────────────────── */}
      <section className="py-16 bg-gradient-to-br from-[#f0edf8] to-[#e8f8f9]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="rounded-3xl overflow-hidden shadow-[0_4px_24px_-4px_rgba(139,110,207,0.2)]">
              <Image
                src="/illustrations/sanctuary-banner.png"
                alt="Peaceful sanctuary garden illustration"
                width={600}
                height={400}
                className="w-full object-cover"
              />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ddd5f0] text-[#6e4fba] text-xs font-bold mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                Sanctuary Program
              </div>
              <h2
                className="text-3xl text-[#0a3d42] mb-4"
                style={{ fontFamily: "'Fredoka One', ui-rounded, system-ui, sans-serif" }}
              >
                Our Sanctuary Animals
              </h2>
              <p className="text-[#484838] leading-relaxed mb-4">
                Some animals come to us with special needs, medical conditions, or
                behavioral challenges that make traditional adoption difficult. Our
                sanctuary program provides these animals with a permanent, loving
                home for life.
              </p>
              <p className="text-[#484838] leading-relaxed mb-6">
                You can support our sanctuary animals through sponsorship, which
                helps cover their ongoing care, medical needs, and enrichment.
              </p>
              <Link
                href="/sanctuary"
                className="inline-flex items-center gap-2 rounded-full bg-[#8b6ecf] px-6 py-3 text-sm font-bold text-white hover:bg-[#6e4fba] transition-all duration-200 no-underline shadow-sm"
              >
                <Heart className="h-4 w-4 fill-white" />
                Meet Our Sanctuary Animals
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── RAINBOW BRIDGE TEASER ────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ffe0e0] text-[#cc2828] text-xs font-bold mb-4">
                <Heart className="w-3.5 h-3.5 fill-[#f4a5a5]" />
                In Loving Memory
              </div>
              <h2
                className="text-3xl text-[#0a3d42] mb-4"
                style={{ fontFamily: "'Fredoka One', ui-rounded, system-ui, sans-serif" }}
              >
                Rainbow Bridge
              </h2>
              <p className="text-[#484838] leading-relaxed mb-4">
                We honor and remember every animal who passed through our care.
                Each one touched our hearts and left their paw prints on our souls.
                Their stories live on in our memorial gallery.
              </p>
              <p className="text-[#8c8c7c] text-sm italic mb-6">
                &ldquo;Just this side of heaven is a place called Rainbow Bridge...&rdquo;
              </p>
              <Link
                href="/rainbow-bridge"
                className="inline-flex items-center gap-2 rounded-full border-2 border-[#f4a5a5] px-6 py-3 text-sm font-bold text-[#cc2828] hover:bg-[#fff5f5] transition-all duration-200 no-underline"
              >
                Visit the Memorial
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="rounded-3xl overflow-hidden shadow-[0_4px_24px_-4px_rgba(244,165,165,0.2)]">
              <Image
                src="/illustrations/rainbow-bridge.png"
                alt="Rainbow Bridge memorial illustration"
                width={600}
                height={400}
                className="w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── BLOG ─────────────────────────────────────────────────── */}
      {latestPosts.length > 0 && (
        <section className="py-16 bg-[#f9fafb]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2
                  className="text-3xl text-[#0a3d42]"
                  style={{ fontFamily: "'Fredoka One', ui-rounded, system-ui, sans-serif" }}
                >
                  From Our Blog
                </h2>
                <p className="text-[#8c8c7c] mt-1">Stories, updates, and news from our rescue.</p>
              </div>
              <Link
                href="/blog"
                className="hidden sm:inline-flex items-center gap-1.5 text-sm font-bold text-[#2099a1] hover:text-[#1a7f87] no-underline"
              >
                Read all posts
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestPosts.map((post) => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── EVENTS ───────────────────────────────────────────────── */}
      {upcomingEvents.length > 0 && (
        <section className="py-16 bg-[#fdf5ef]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2
                  className="text-3xl text-[#0a3d42]"
                  style={{ fontFamily: "'Fredoka One', ui-rounded, system-ui, sans-serif" }}
                >
                  Upcoming Events
                </h2>
                <p className="text-[#8c8c7c] mt-1">Come meet our animals and support our mission.</p>
              </div>
              <Link
                href="/events"
                className="hidden sm:inline-flex items-center gap-1.5 text-sm font-bold text-[#b86440] hover:text-[#8f4a2e] no-underline"
              >
                See all events
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event: any) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── DONATE CTA ───────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-[#0a3d42] to-[#105f66] py-16 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#2099a1] rounded-full opacity-10 blur-3xl translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#4ec8d1] rounded-full opacity-10 blur-3xl -translate-x-1/4 translate-y-1/4" />
        </div>
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <h3
                className="text-3xl text-white mb-2"
                style={{ fontFamily: "'Fredoka One', ui-rounded, system-ui, sans-serif" }}
              >
                Support Our Mission
              </h3>
              <p className="text-[#8ddde3] max-w-lg">
                100% of donations go directly to animal care. We are a registered
                501(c)(3) nonprofit. Every dollar makes a difference.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 flex-shrink-0">
              <Link
                href="/donate"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#e8a87c] px-7 py-3.5 text-base font-bold text-white hover:bg-[#d4845a] transition-all duration-200 shadow-[0_4px_24px_-4px_rgba(232,168,124,0.4)] no-underline"
              >
                <Heart className="h-5 w-5 fill-white" />
                Donate Today
              </Link>
              <Link
                href="/adopt"
                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white/30 px-7 py-3.5 text-base font-bold text-white hover:bg-white/10 transition-all duration-200 no-underline"
              >
                Meet Our Animals
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
