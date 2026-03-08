import Link from "next/link";
import { Heart, Users, Home, Calendar, ArrowRight } from "lucide-react";
import { getClient } from "@/lib/apollo-client";
import { GET_ANIMALS_LIST } from "@/lib/graphql/animals";
import { GET_BLOG_POSTS } from "@/lib/graphql/content";
import AnimalCard from "@/components/animals/AnimalCard";
import BlogPostCard from "@/components/blog/BlogPostCard";
import type { Animal, BlogPost } from "@/types/drupal";
import type { GetAnimalsListQuery, GetBlogPostsQuery } from "@/types/graphql";

const stats = [
  { label: "Animals Rescued", value: "500+", icon: Heart },
  { label: "Happy Adoptions", value: "450+", icon: Home },
  { label: "Active Fosters", value: "60+", icon: Users },
  { label: "Events This Year", value: "24", icon: Calendar },
];

export default async function HomePage() {
  // Fetch featured animals (first available ones)
  const { data: animalsData } = await getClient().query<GetAnimalsListQuery>({
    query: GET_ANIMALS_LIST,
    variables: { first: 12 },
  });

  const allAnimals: Animal[] = animalsData?.nodeAnimals?.nodes || [];
  const featuredAnimals = allAnimals
    .filter(
      (a) =>
        a.status &&
        (a.animalStatus?.name === "Available" ||
          a.animalStatus?.name === "In Foster")
    )
    .slice(0, 3);

  // Fetch latest blog posts
  const { data: blogData } = await getClient().query<GetBlogPostsQuery>({
    query: GET_BLOG_POSTS,
    variables: { first: 3 },
  });

  const latestPosts: BlogPost[] = (blogData?.nodeBlogPosts?.nodes || [])
    .filter((p: BlogPost) => p.status)
    .slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="text-center max-w-3xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-500 shadow-xl">
                <Heart className="h-8 w-8 text-white fill-white" />
              </div>
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-gray-900 mb-6 leading-tight">
              Every Animal Deserves a{" "}
              <span className="text-rose-500">Second Chance</span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 leading-relaxed">
              We rescue, rehabilitate, and rehome animals in need. Find your
              perfect companion, become a foster, or support our mission today.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/adopt"
                className="inline-flex items-center gap-2 rounded-full bg-rose-500 px-7 py-3.5 text-base font-semibold text-white shadow-lg hover:bg-rose-600 transition-colors"
              >
                <Heart className="h-5 w-5 fill-white" />
                Meet Our Animals
              </Link>
              <Link
                href="/foster"
                className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-base font-semibold text-gray-700 shadow-sm border border-gray-200 hover:border-rose-200 hover:text-rose-600 transition-colors"
              >
                Become a Foster
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center text-center p-4 rounded-2xl bg-rose-50 border border-rose-100"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-500 mb-3">
                  <stat.icon className="h-5 w-5 text-white" />
                </div>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Animals */}
      {featuredAnimals.length > 0 && (
        <section className="py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">
                  Looking for a Home
                </h2>
                <p className="text-gray-500 mt-1">
                  These animals are ready to meet you.
                </p>
              </div>
              <Link
                href="/adopt"
                className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-rose-600 hover:text-rose-700"
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
                className="inline-flex items-center gap-2 rounded-full bg-rose-500 px-6 py-3 text-sm font-semibold text-white hover:bg-rose-600 transition-colors"
              >
                <Heart className="h-4 w-4 fill-white" />
                See all animals
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* How to Help */}
      <section className="bg-white py-14 border-t border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900">How You Can Help</h2>
            <p className="text-gray-500 mt-2">
              Every action makes a difference in an animal&apos;s life.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: "🏠",
                title: "Foster",
                description:
                  "Open your home temporarily to an animal in need. Fosters save lives by freeing up space and providing love.",
                href: "/foster",
                cta: "Become a Foster",
              },
              {
                icon: "🤝",
                title: "Volunteer",
                description:
                  "Help with transport, events, photography, social media, and more. Every skill is valuable.",
                href: "/volunteer",
                cta: "Volunteer With Us",
              },
              {
                icon: "💝",
                title: "Donate",
                description:
                  "Your donation funds medical care, food, and supplies for animals in our care.",
                href: "/donate",
                cta: "Make a Donation",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="flex flex-col items-center text-center p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:border-rose-100 hover:bg-rose-50/30 transition-colors"
              >
                <span className="text-5xl mb-4">{item.icon}</span>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-5 flex-1">
                  {item.description}
                </p>
                <Link
                  href={item.href}
                  className="inline-flex items-center gap-1.5 rounded-full bg-rose-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-rose-600 transition-colors"
                >
                  {item.cta}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Blog Posts */}
      {latestPosts.length > 0 && (
        <section className="py-14 border-t border-gray-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">
                  From Our Blog
                </h2>
                <p className="text-gray-500 mt-1">
                  Stories, updates, and news from our rescue.
                </p>
              </div>
              <Link
                href="/blog"
                className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-rose-600 hover:text-rose-700"
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

      {/* Final CTA */}
      <section className="bg-gradient-to-br from-rose-500 to-rose-600 py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <Heart className="h-12 w-12 text-white fill-white mx-auto mb-4 opacity-80" />
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Change a Life?
          </h2>
          <p className="text-rose-100 text-lg mb-8 max-w-2xl mx-auto">
            Whether you adopt, foster, volunteer, or donate — every act of
            kindness brings an animal one step closer to their forever home.
          </p>
          <Link
            href="/adopt"
            className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-base font-bold text-rose-600 hover:bg-rose-50 transition-colors shadow-lg"
          >
            <Heart className="h-5 w-5 fill-rose-500 text-rose-500" />
            Find Your Match Today
          </Link>
        </div>
      </section>
    </div>
  );
}
