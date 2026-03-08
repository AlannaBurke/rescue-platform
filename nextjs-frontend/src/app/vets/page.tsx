import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Phone, Globe, MapPin, Star, AlertTriangle, Stethoscope } from "lucide-react";
import { getClient } from "@/lib/apollo-client";
import { GET_VETS } from "@/lib/graphql/site";
import { drupalImageUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Vets & Care",
  description: "Our trusted veterinary partners and emergency care resources for small animals.",
};

interface VetNode {
  id: string;
  title: string;
  path: string;
  vetPracticeName: string;
  vetDoctorNames: string | null;
  vetSpecialties: string | null;
  vetPhone: string | null;
  vetEmergencyPhone: string | null;
  vetEmail: string | null;
  vetWebsite: { url: string; title: string } | null;
  vetStreet: string | null;
  vetCity: string | null;
  vetState: string | null;
  vetZip: string | null;
  vetHours: string | null;
  vetIsEmergency: boolean;
  vetIsPreferred: boolean;
  vetPublicNotes: string | null;
  vetPhoto: { url: string; alt: string } | null;
}

export default async function VetsPage() {
  const { data } = await getClient().query({ query: GET_VETS, variables: { first: 50 } });
  const vets: VetNode[] = data?.nodeVets?.nodes ?? [];

  const preferred  = vets.filter((v) => v.vetIsPreferred && !v.vetIsEmergency);
  const emergency  = vets.filter((v) => v.vetIsEmergency);
  const others     = vets.filter((v) => !v.vetIsPreferred && !v.vetIsEmergency);

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
            Vets &amp; Care
          </h1>
          <p className="text-primary-100 max-w-xl mx-auto leading-relaxed">
            Our trusted veterinary partners who specialize in exotic and small animals.
            Always seek emergency care immediately if your animal is in distress.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-12">

        {/* Emergency vets */}
        {emergency.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-100">
                <AlertTriangle className="h-5 w-5 text-rose-600" />
              </div>
              <h2
                className="text-2xl text-stone-800"
                style={{ fontFamily: "'Fredoka One', ui-rounded, system-ui, sans-serif" }}
              >
                Emergency &amp; 24-Hour Care
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {emergency.map((vet) => <VetCard key={vet.id} vet={vet} variant="emergency" />)}
            </div>
          </section>
        )}

        {/* Preferred vets */}
        {preferred.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-100">
                <Star className="h-5 w-5 text-primary-600" />
              </div>
              <h2
                className="text-2xl text-stone-800"
                style={{ fontFamily: "'Fredoka One', ui-rounded, system-ui, sans-serif" }}
              >
                Our Preferred Vets
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {preferred.map((vet) => <VetCard key={vet.id} vet={vet} variant="preferred" />)}
            </div>
          </section>
        )}

        {/* Other vets */}
        {others.length > 0 && (
          <section>
            <h2
              className="text-2xl text-stone-800 mb-5"
              style={{ fontFamily: "'Fredoka One', ui-rounded, system-ui, sans-serif" }}
            >
              Additional Resources
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {others.map((vet) => <VetCard key={vet.id} vet={vet} variant="default" />)}
            </div>
          </section>
        )}

        {vets.length === 0 && (
          <div className="text-center py-20">
            <Stethoscope className="h-12 w-12 text-stone-300 mx-auto mb-4" />
            <p className="text-stone-500">No vet listings yet. Check back soon.</p>
          </div>
        )}

        {/* Emergency reminder */}
        <div className="bg-rose-50 border border-rose-200 rounded-3xl p-6 flex gap-4">
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

function VetCard({ vet, variant }: { vet: VetNode; variant: "emergency" | "preferred" | "default" }) {
  const address = [vet.vetStreet, vet.vetCity, vet.vetState, vet.vetZip].filter(Boolean).join(", ");
  const imgSrc  = vet.vetPhoto?.url ? drupalImageUrl(vet.vetPhoto.url) : null;

  const borderColor = variant === "emergency"
    ? "border-rose-200"
    : variant === "preferred"
    ? "border-primary-200"
    : "border-stone-100";

  return (
    <div className={`bg-white rounded-3xl p-6 shadow-soft border ${borderColor} flex gap-4`}>
      {imgSrc && (
        <div className="flex-shrink-0 w-16 h-16 rounded-2xl overflow-hidden bg-stone-100">
          <Image src={imgSrc} alt={vet.vetPracticeName} width={64} height={64} className="object-cover w-full h-full" unoptimized />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3
            className="text-lg text-stone-800 leading-tight"
            style={{ fontFamily: "'Fredoka One', ui-rounded, system-ui, sans-serif" }}
          >
            {vet.vetPracticeName}
          </h3>
          <div className="flex gap-1 flex-shrink-0">
            {vet.vetIsEmergency && (
              <span className="inline-flex items-center rounded-full bg-rose-100 px-2 py-0.5 text-xs font-semibold text-rose-700">
                Emergency
              </span>
            )}
            {vet.vetIsPreferred && (
              <span className="inline-flex items-center rounded-full bg-primary-100 px-2 py-0.5 text-xs font-semibold text-primary-700">
                Preferred
              </span>
            )}
          </div>
        </div>

        {vet.vetSpecialties && (
          <p className="text-xs text-stone-500 mb-3">{vet.vetSpecialties}</p>
        )}

        <div className="space-y-1.5 text-sm">
          {vet.vetPhone && (
            <a href={`tel:${vet.vetPhone.replace(/\D/g, "")}`} className="flex items-center gap-2 text-stone-600 hover:text-primary-700 no-underline transition-colors">
              <Phone className="h-3.5 w-3.5 text-primary-400 flex-shrink-0" />
              {vet.vetPhone}
            </a>
          )}
          {vet.vetEmergencyPhone && vet.vetEmergencyPhone !== vet.vetPhone && (
            <a href={`tel:${vet.vetEmergencyPhone.replace(/\D/g, "")}`} className="flex items-center gap-2 text-rose-600 hover:text-rose-800 no-underline transition-colors font-semibold">
              <Phone className="h-3.5 w-3.5 text-rose-400 flex-shrink-0" />
              {vet.vetEmergencyPhone} (Emergency)
            </a>
          )}
          {address && (
            <div className="flex items-start gap-2 text-stone-500">
              <MapPin className="h-3.5 w-3.5 text-stone-400 flex-shrink-0 mt-0.5" />
              <span>{address}</span>
            </div>
          )}
          {vet.vetWebsite?.url && (
            <a href={vet.vetWebsite.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary-600 hover:text-primary-800 no-underline transition-colors">
              <Globe className="h-3.5 w-3.5 flex-shrink-0" />
              {vet.vetWebsite.title || "Website"}
            </a>
          )}
        </div>

        {vet.vetHours && (
          <p className="mt-2 text-xs text-stone-400 italic">{vet.vetHours}</p>
        )}
        {vet.vetPublicNotes && (
          <p className="mt-2 text-xs text-stone-500 bg-stone-50 rounded-xl p-2">{vet.vetPublicNotes}</p>
        )}
      </div>
    </div>
  );
}
