import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, Stethoscope } from "lucide-react";
import { getClient } from "@/lib/apollo-client";
import { GET_VETS } from "@/lib/graphql/site";
import VetDirectory from "@/components/vets/VetDirectory";
import type { VetNode } from "@/components/vets/VetDirectory";

export const metadata: Metadata = {
  title: "Find a Vet | Veterinary Resources",
  description:
    "Browse our trusted veterinary partners — including exotic and small animal specialists. Filter by species, emergency availability, rescue discount, and more.",
};

export default async function VetsPage() {
  const { data } = await getClient().query({ query: GET_VETS, variables: { first: 100 } });
  const vets: VetNode[] = data?.nodeVets?.nodes ?? [];

  return (
    <div className="min-h-screen bg-stone-50">

      {/* Banner */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white py-14 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-semibold text-primary-100 mb-5">
            <Stethoscope className="h-4 w-4" />
            Veterinary Resources
          </div>
          <h1
            className="text-4xl sm:text-5xl text-white mb-4"
            style={{ fontFamily: "'Fredoka One', ui-rounded, system-ui, sans-serif" }}
          >
            Find a Vet
          </h1>
          <p className="text-primary-100 max-w-xl mx-auto leading-relaxed">
            Our trusted veterinary partners — including exotic and small animal specialists.
            Filter by species, emergency availability, rescue discount, and more.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">

        {/* Client-side filterable directory */}
        <VetDirectory vets={vets} />

        {/* Emergency reminder */}
        <div className="mt-10 bg-rose-50 border border-rose-200 rounded-3xl p-6 flex gap-4">
          <AlertTriangle className="h-6 w-6 text-rose-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3
              className="text-rose-800 mb-1"
              style={{ fontFamily: "'Fredoka One', ui-rounded, system-ui, sans-serif" }}
            >
              Emergency Reminder
            </h3>
            <p className="text-rose-700 text-sm leading-relaxed">
              If your animal is not eating, has labored breathing, is lethargic, or shows any
              signs of GI stasis — seek emergency veterinary care immediately. Do not wait.
              Small animals can deteriorate very quickly.
            </p>
            <Link href="/resources?category=emergency" className="inline-block mt-3 text-sm font-semibold text-rose-700 underline">
              View emergency care guides →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
