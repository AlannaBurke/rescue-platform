import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Heart, Users, Home, Star, Award } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about our mission to rescue, rehabilitate, and rehome small animals in need.",
};

const stats = [
  { label: "Animals Rescued", value: "500+", icon: Heart },
  { label: "Successful Adoptions", value: "420+", icon: Home },
  { label: "Active Fosters", value: "30+", icon: Users },
  { label: "Years of Service", value: "8+", icon: Star },
];

const values = [
  {
    title: "Every Life Matters",
    description:
      "We believe every small animal deserves a safe, loving home — regardless of age, health status, or background. We do not euthanize for space.",
    icon: "💛",
  },
  {
    title: "Education First",
    description:
      "We empower adopters and fosters with the knowledge they need to provide excellent care. Happy animals start with informed humans.",
    icon: "📚",
  },
  {
    title: "Community Driven",
    description:
      "Our rescue runs entirely on volunteers, fosters, and donors. We are a community of people who believe small animals deserve big love.",
    icon: "🤝",
  },
  {
    title: "Transparency",
    description:
      "We are open about our operations, finances, and outcomes. You can trust that your support goes directly to the animals in our care.",
    icon: "🔍",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-stone-50">

      {/* Hero banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-8 left-16 w-64 h-64 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-8 right-16 w-48 h-48 rounded-full bg-warm-400 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24 flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-semibold text-primary-100 mb-6">
              <Heart className="h-4 w-4 fill-current" />
              Our Story
            </div>
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl text-white mb-6"
              style={{ fontFamily: "'Fredoka One', ui-rounded, system-ui, sans-serif" }}
            >
              About Our Rescue
            </h1>
            <p className="text-lg text-primary-100 max-w-xl leading-relaxed">
              We are a volunteer-run, foster-based rescue dedicated to giving small animals
              — rabbits, guinea pigs, rats, and more — a second chance at a happy life.
            </p>
          </div>
          <div className="flex-shrink-0 w-full max-w-sm lg:max-w-md">
            <Image
              src="/images/defaults/about-banner.png"
              alt="Our rescue animals"
              width={600}
              height={338}
              className="rounded-3xl shadow-2xl w-full"
              priority
            />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-stone-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary-50 mb-3">
                    <Icon className="h-6 w-6 text-primary-600" />
                  </div>
                  <div
                    className="text-3xl text-primary-700 mb-1"
                    style={{ fontFamily: "'Fredoka One', ui-rounded, system-ui, sans-serif" }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-sm text-stone-500 font-medium">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2
            className="text-3xl sm:text-4xl text-stone-800 mb-4"
            style={{ fontFamily: "'Fredoka One', ui-rounded, system-ui, sans-serif" }}
          >
            Our Mission
          </h2>
          <p className="text-lg text-stone-600 leading-relaxed">
            We rescue small animals from shelters, owner surrenders, and neglect situations.
            Every animal receives veterinary care, socialization, and a loving foster home
            while we find them their perfect forever family.
          </p>
        </div>

        {/* Values grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {values.map((value) => (
            <div
              key={value.title}
              className="bg-white rounded-3xl p-6 shadow-[0_4px_24px_-4px_rgba(32,153,161,0.15)] border border-stone-100"
            >
              <div className="text-3xl mb-3">{value.icon}</div>
              <h3
                className="text-xl text-primary-800 mb-2"
                style={{ fontFamily: "'Fredoka One', ui-rounded, system-ui, sans-serif" }}
              >
                {value.title}
              </h3>
              <p className="text-stone-600 leading-relaxed text-sm">{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* What we do */}
      <section className="bg-primary-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2
            className="text-3xl sm:text-4xl text-stone-800 mb-8 text-center"
            style={{ fontFamily: "'Fredoka One', ui-rounded, system-ui, sans-serif" }}
          >
            What We Do
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Rescue & Intake",
                body: "We accept animals from shelters, owner surrenders, and cruelty cases. Every animal is assessed, vetted, and placed in a foster home within 48 hours of intake.",
                emoji: "🏠",
              },
              {
                title: "Medical Care",
                body: "All animals receive a full veterinary exam, vaccinations, spay/neuter, and any necessary treatment before adoption. We partner with exotic-animal-savvy vets.",
                emoji: "🩺",
              },
              {
                title: "Forever Homes",
                body: "We carefully match animals with families based on lifestyle, experience, and the animal's personality. We offer lifetime support to every adopter.",
                emoji: "💕",
              },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-3xl p-6 shadow-soft">
                <div className="text-4xl mb-4">{item.emoji}</div>
                <h3
                  className="text-xl text-primary-800 mb-2"
                  style={{ fontFamily: "'Fredoka One', ui-rounded, system-ui, sans-serif" }}
                >
                  {item.title}
                </h3>
                <p className="text-stone-600 text-sm leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nonprofit status */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-br from-warm-50 to-warm-100 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-shrink-0">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-warm-200">
              <Award className="h-10 w-10 text-warm-700" />
            </div>
          </div>
          <div>
            <h2
              className="text-2xl text-stone-800 mb-2"
              style={{ fontFamily: "'Fredoka One', ui-rounded, system-ui, sans-serif" }}
            >
              501(c)(3) Nonprofit Organization
            </h2>
            <p className="text-stone-600 leading-relaxed mb-4">
              We are a registered 501(c)(3) nonprofit organization. All donations are
              tax-deductible to the fullest extent permitted by law. Our EIN is available
              upon request.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/support"
                className="inline-flex items-center gap-2 rounded-full bg-warm-500 px-5 py-2.5 text-sm font-bold text-white hover:bg-warm-600 transition-colors no-underline"
              >
                <Heart className="h-4 w-4 fill-white" />
                Support Our Mission
              </Link>
              <Link
                href="/volunteer"
                className="inline-flex items-center gap-2 rounded-full border-2 border-warm-400 px-5 py-2.5 text-sm font-bold text-warm-700 hover:bg-warm-50 transition-colors no-underline"
              >
                Volunteer With Us
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
