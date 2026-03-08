import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Heart, ExternalLink, Target } from "lucide-react";
import { getClient } from "@/lib/apollo-client";
import { GET_GIVING } from "@/lib/graphql/site";
import { drupalImageUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Support & Giving",
  description: "Every way you can help our rescue — from Venmo and wishlists to calling the vet.",
};

interface GivingNode {
  id: string;
  title: string;
  givingType: string;
  givingHandle: string | null;
  givingUrl: { url: string; title: string } | null;
  givingInstructions: string | null;
  givingGoal: string | null;
  givingIsActive: boolean;
  givingSortWeight: number | null;
  givingImage: { url: string; alt: string } | null;
  body: { summary: string; processed: string } | null;
}

const TYPE_CONFIG: Record<string, { label: string; emoji: string; color: string; bgColor: string }> = {
  venmo:        { label: "Venmo",          emoji: "💙", color: "text-[#3d95ce]",  bgColor: "bg-[#e8f4fd]" },
  cashapp:      { label: "Cash App",       emoji: "💚", color: "text-[#00d64f]",  bgColor: "bg-[#e6fff0]" },
  paypal:       { label: "PayPal",         emoji: "💛", color: "text-[#003087]",  bgColor: "bg-[#e8edf7]" },
  zelle:        { label: "Zelle",          emoji: "💜", color: "text-[#6d1ed4]",  bgColor: "bg-[#f0e8fd]" },
  amazon_wish:  { label: "Amazon Wishlist",emoji: "📦", color: "text-[#ff9900]",  bgColor: "bg-[#fff8e6]" },
  chewy_wish:   { label: "Chewy Wishlist", emoji: "🐾", color: "text-[#e84c4c]",  bgColor: "bg-[#fde8e8]" },
  gofundme:     { label: "GoFundMe",       emoji: "🎯", color: "text-[#00b964]",  bgColor: "bg-[#e6f9f0]" },
  vet_payment:  { label: "Vet Payment",    emoji: "🩺", color: "text-primary-700", bgColor: "bg-primary-50" },
  gift_card:    { label: "Gift Card",      emoji: "🎁", color: "text-warm-700",    bgColor: "bg-warm-50" },
  volunteer:    { label: "Volunteer Time", emoji: "🤝", color: "text-sage-700",    bgColor: "bg-sage-100" },
  foster:       { label: "Foster",         emoji: "🏠", color: "text-lavender-700",bgColor: "bg-lavender-100" },
  other:        { label: "Other",          emoji: "💝", color: "text-stone-700",   bgColor: "bg-stone-100" },
};

export default async function SupportPage() {
  const { data } = await getClient().query({ query: GET_GIVING, variables: { first: 50 } });
  const allItems: GivingNode[] = (data?.nodeSupportGivings?.nodes ?? [])
    .filter((item: GivingNode) => item.givingIsActive)
    .sort((a: GivingNode, b: GivingNode) => (a.givingSortWeight ?? 99) - (b.givingSortWeight ?? 99));

  // Group by type category
  const directDonation = allItems.filter((i) =>
    ["venmo", "cashapp", "paypal", "zelle", "gofundme"].includes(i.givingType)
  );
  const wishlists = allItems.filter((i) =>
    ["amazon_wish", "chewy_wish", "gift_card"].includes(i.givingType)
  );
  const vetSupport = allItems.filter((i) => i.givingType === "vet_payment");
  const timeSupport = allItems.filter((i) => ["volunteer", "foster"].includes(i.givingType));
  const other = allItems.filter((i) =>
    !["venmo", "cashapp", "paypal", "zelle", "gofundme", "amazon_wish", "chewy_wish", "gift_card", "vet_payment", "volunteer", "foster"].includes(i.givingType)
  );

  return (
    <div className="min-h-screen bg-stone-50">

      {/* Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-warm-700 via-warm-600 to-warm-500 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-8 right-16 w-64 h-64 rounded-full bg-white blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 lg:py-20 flex flex-col lg:flex-row items-center gap-10">
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-semibold text-warm-100 mb-5">
              <Heart className="h-4 w-4 fill-current" />
              Support Our Mission
            </div>
            <h1
              className="text-4xl sm:text-5xl text-white mb-4"
              style={{ fontFamily: "'Fredoka One', ui-rounded, system-ui, sans-serif" }}
            >
              Support &amp; Giving
            </h1>
            <p className="text-warm-100 max-w-lg leading-relaxed">
              Every dollar, every item on our wishlist, and every hour of your time makes a
              direct difference in the lives of the animals in our care. Thank you.
            </p>
          </div>
          <div className="flex-shrink-0 w-full max-w-xs lg:max-w-sm">
            <Image
              src="/images/defaults/support-banner.png"
              alt="Support our rescue"
              width={500}
              height={281}
              className="rounded-3xl shadow-2xl w-full"
              priority
            />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-12">

        {/* Direct donations */}
        {directDonation.length > 0 && (
          <section>
            <h2
              className="text-2xl text-stone-800 mb-5 flex items-center gap-2"
              style={{ fontFamily: "'Fredoka One', ui-rounded, system-ui, sans-serif" }}
            >
              💸 Direct Donations
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {directDonation.map((item) => <GivingCard key={item.id} item={item} />)}
            </div>
          </section>
        )}

        {/* Wishlists */}
        {wishlists.length > 0 && (
          <section>
            <h2
              className="text-2xl text-stone-800 mb-5 flex items-center gap-2"
              style={{ fontFamily: "'Fredoka One', ui-rounded, system-ui, sans-serif" }}
            >
              🛒 Wishlists &amp; Supplies
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {wishlists.map((item) => <GivingCard key={item.id} item={item} />)}
            </div>
          </section>
        )}

        {/* Vet support */}
        {vetSupport.length > 0 && (
          <section>
            <h2
              className="text-2xl text-stone-800 mb-5 flex items-center gap-2"
              style={{ fontFamily: "'Fredoka One', ui-rounded, system-ui, sans-serif" }}
            >
              🩺 Vet &amp; Medical Support
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {vetSupport.map((item) => <GivingCard key={item.id} item={item} large />)}
            </div>
          </section>
        )}

        {/* Time & skills */}
        {timeSupport.length > 0 && (
          <section>
            <h2
              className="text-2xl text-stone-800 mb-5 flex items-center gap-2"
              style={{ fontFamily: "'Fredoka One', ui-rounded, system-ui, sans-serif" }}
            >
              🤝 Give Your Time
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {timeSupport.map((item) => <GivingCard key={item.id} item={item} large />)}
            </div>
          </section>
        )}

        {/* Other */}
        {other.length > 0 && (
          <section>
            <h2
              className="text-2xl text-stone-800 mb-5"
              style={{ fontFamily: "'Fredoka One', ui-rounded, system-ui, sans-serif" }}
            >
              More Ways to Help
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {other.map((item) => <GivingCard key={item.id} item={item} />)}
            </div>
          </section>
        )}

        {allItems.length === 0 && (
          <div className="text-center py-20">
            <Heart className="h-12 w-12 text-stone-300 mx-auto mb-4" />
            <p className="text-stone-500">Support options coming soon. Check back!</p>
          </div>
        )}

        {/* Tax deductible note */}
        <div className="bg-primary-50 border border-primary-200 rounded-3xl p-6 text-center">
          <p className="text-primary-800 text-sm">
            We are a registered 501(c)(3) nonprofit. All monetary donations are
            tax-deductible to the fullest extent permitted by law.
            Please save your receipts for tax purposes.
          </p>
        </div>
      </div>
    </div>
  );
}

function GivingCard({ item, large = false }: { item: GivingNode; large?: boolean }) {
  const config = TYPE_CONFIG[item.givingType] ?? TYPE_CONFIG.other;
  const imgSrc = item.givingImage?.url ? drupalImageUrl(item.givingImage.url) : null;
  const summary = item.body?.summary || item.body?.processed?.replace(/<[^>]+>/g, "").slice(0, 150) || "";

  return (
    <div className={`bg-white rounded-3xl overflow-hidden shadow-soft border border-stone-100 flex flex-col ${large ? "p-6" : "p-5"}`}>
      {imgSrc && (
        <div className="relative h-36 -mx-5 -mt-5 mb-4 overflow-hidden bg-stone-100">
          <Image src={imgSrc} alt={item.title} fill className="object-cover" unoptimized />
        </div>
      )}

      <div className="flex items-start gap-3 mb-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-2xl text-xl flex-shrink-0 ${config.bgColor}`}>
          {config.emoji}
        </div>
        <div>
          <h3
            className={`${large ? "text-xl" : "text-lg"} text-stone-800`}
            style={{ fontFamily: "'Fredoka One', ui-rounded, system-ui, sans-serif" }}
          >
            {item.title}
          </h3>
          {item.givingHandle && (
            <p className={`text-sm font-mono font-semibold ${config.color}`}>{item.givingHandle}</p>
          )}
        </div>
      </div>

      {item.givingGoal && (
        <div className="flex items-start gap-2 mb-3 bg-warm-50 rounded-xl p-3">
          <Target className="h-4 w-4 text-warm-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-warm-800 leading-snug">{item.givingGoal}</p>
        </div>
      )}

      {summary && (
        <p className="text-sm text-stone-500 leading-relaxed mb-3 flex-1">{summary}</p>
      )}

      {item.givingInstructions && (
        <p className="text-xs text-stone-400 italic mb-3">{item.givingInstructions}</p>
      )}

      {item.givingUrl?.url && (
        <a
          href={item.givingUrl.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`mt-auto flex items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-bold text-white transition-all no-underline ${config.bgColor} ${config.color} border-2 border-current`}
        >
          <ExternalLink className="h-4 w-4" />
          {item.givingUrl.title || `Give via ${config.label}`}
        </a>
      )}
    </div>
  );
}
