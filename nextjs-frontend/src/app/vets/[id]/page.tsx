import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { draftMode } from "next/headers";
import {
  Phone, Globe, MapPin, Star, AlertTriangle, Stethoscope,
  CheckCircle2, Heart, Tag, DollarSign, Mail, Clock, Users,
  ArrowLeft, ExternalLink
} from "lucide-react";
import { getClient } from "@/lib/apollo-client";
import { GET_VET } from "@/lib/graphql/site";
import { drupalImageUrl } from "@/lib/utils";
import PublicShareBar from "@/components/social/PublicShareBar";

// ─── Types ───────────────────────────────────────────────────────────────────

interface StaffMember {
  staffName: string | null;
  staffRole: string | null;
  staffPhone: string | null;
  staffEmail: string | null;
  staffNotes: string | null;
}

interface ProcedureEntry {
  procDate: { time: string; timestamp: number } | null;
  procName: string | null;
  procCost: string | null;
  procNotes: string | null;
}

interface VetDetail {
  id: string;
  title: string;
  path: string;
  status: boolean;
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
  vetPhoto: { url: string; alt: string; width: number; height: number } | null;
  vetSeesExotics: boolean | null;
  vetSpecies: string[] | null;
  vetRescueDiscount: boolean | null;
  vetDiscountDetails: string | null;
  vetEndorsement: string | null;
  vetCostRating: number | null;
  vetStaff: StaffMember[] | null;
  vetProcedures: ProcedureEntry[] | null;
  body: { value: string; processed: string } | null;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const ENDORSEMENT_LABELS: Record<string, string> = {
  listed: "Listed",
  recommended: "Recommended",
  endorsed_partner: "Endorsed Partner",
};

const SPECIES_LABELS: Record<string, string> = {
  rabbit: "Rabbit",
  guinea_pig: "Guinea Pig",
  rat: "Rat",
  chinchilla: "Chinchilla",
  hamster: "Hamster",
  ferret: "Ferret",
  bird: "Bird",
  reptile: "Reptile",
  hedgehog: "Hedgehog",
  sugar_glider: "Sugar Glider",
  other: "Other Exotics",
};

function CostRating({ rating }: { rating: number | null }) {
  if (!rating) return null;
  return (
    <div className="flex items-center gap-0.5" title={`Cost: ${rating}/5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <DollarSign key={i} className={`h-4 w-4 ${i < rating ? "text-emerald-600" : "text-stone-200"}`} />
      ))}
      <span className="ml-1 text-sm text-stone-500">({rating}/5)</span>
    </div>
  );
}

// ─── Metadata ────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const { data } = await getClient().query({ query: GET_VET, variables: { id } });
  const vet: VetDetail | null = data?.nodeVet ?? null;
  if (!vet) return { title: "Vet Not Found" };
  return {
    title: `${vet.vetPracticeName} | Vets & Care`,
    description: vet.vetPublicNotes ?? `${vet.vetPracticeName} — veterinary care in ${vet.vetCity ?? "our area"}.`,
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function VetDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { isEnabled: isPreview } = await draftMode();
  const { data } = await getClient().query({ query: GET_VET, variables: { id } });
  const vet: VetDetail | null = data?.nodeVet ?? null;

  if (!vet || (!vet.status && !isPreview)) notFound();

  const address = [vet.vetStreet, vet.vetCity, vet.vetState, vet.vetZip].filter(Boolean).join(", ");
  const imgSrc = vet.vetPhoto?.url ? drupalImageUrl(vet.vetPhoto.url) : null;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";
  const canonicalUrl = `${siteUrl}/vets/${id}`;

  return (
    <div className="min-h-screen bg-stone-50">

      {/* Back nav */}
      <div className="bg-white border-b border-stone-100">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-3">
          <Link href="/vets" className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-primary-700 no-underline transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Vet Directory
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* Header card */}
        <div className="bg-white rounded-3xl shadow-soft border border-stone-100 overflow-hidden">
          <div className={`p-6 ${vet.vetIsEmergency ? "bg-rose-50" : vet.vetEndorsement === "endorsed_partner" ? "bg-amber-50" : vet.vetIsPreferred ? "bg-primary-50" : "bg-white"}`}>
            <div className="flex gap-5 items-start">
              {imgSrc ? (
                <div className="flex-shrink-0 w-20 h-20 rounded-2xl overflow-hidden bg-stone-100 border border-stone-100 shadow-sm">
                  <Image src={imgSrc} alt={vet.vetPracticeName} width={80} height={80} className="object-cover w-full h-full" unoptimized />
                </div>
              ) : (
                <div className="flex-shrink-0 w-20 h-20 rounded-2xl bg-stone-100 flex items-center justify-center">
                  <Stethoscope className="h-8 w-8 text-stone-400" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h1
                  className="text-3xl text-stone-800 leading-tight mb-2"
                  style={{ fontFamily: "'Fredoka One', ui-rounded, system-ui, sans-serif" }}
                >
                  {vet.vetPracticeName}
                </h1>
                <div className="flex flex-wrap gap-2 mb-3">
                  {vet.vetIsEmergency && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-3 py-1 text-sm font-semibold text-rose-700">
                      <AlertTriangle className="h-3.5 w-3.5" /> 24hr Emergency
                    </span>
                  )}
                  {vet.vetEndorsement && vet.vetEndorsement !== "listed" && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-800">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      {ENDORSEMENT_LABELS[vet.vetEndorsement] ?? vet.vetEndorsement}
                    </span>
                  )}
                  {vet.vetIsPreferred && !vet.vetEndorsement && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary-100 px-3 py-1 text-sm font-semibold text-primary-700">
                      <Star className="h-3.5 w-3.5" /> Preferred
                    </span>
                  )}
                  {vet.vetSeesExotics && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-violet-100 px-3 py-1 text-sm font-semibold text-violet-700">
                      <Heart className="h-3.5 w-3.5" /> Sees Exotics
                    </span>
                  )}
                  {vet.vetRescueDiscount && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
                      <Tag className="h-3.5 w-3.5" /> Rescue Discount
                    </span>
                  )}
                </div>
                <CostRating rating={vet.vetCostRating} />
              </div>
            </div>
          </div>

          {/* Contact grid */}
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-stone-100">
            {vet.vetPhone && (
              <a href={`tel:${vet.vetPhone.replace(/\D/g, "")}`} className="flex items-center gap-3 p-3 rounded-2xl bg-stone-50 hover:bg-primary-50 transition-colors no-underline group">
                <div className="w-9 h-9 rounded-xl bg-primary-100 flex items-center justify-center flex-shrink-0">
                  <Phone className="h-4 w-4 text-primary-600" />
                </div>
                <div>
                  <p className="text-xs text-stone-400 font-medium">Main Phone</p>
                  <p className="text-sm font-semibold text-stone-700 group-hover:text-primary-700">{vet.vetPhone}</p>
                </div>
              </a>
            )}
            {vet.vetEmergencyPhone && vet.vetEmergencyPhone !== vet.vetPhone && (
              <a href={`tel:${vet.vetEmergencyPhone.replace(/\D/g, "")}`} className="flex items-center gap-3 p-3 rounded-2xl bg-rose-50 hover:bg-rose-100 transition-colors no-underline group">
                <div className="w-9 h-9 rounded-xl bg-rose-100 flex items-center justify-center flex-shrink-0">
                  <Phone className="h-4 w-4 text-rose-600" />
                </div>
                <div>
                  <p className="text-xs text-rose-400 font-medium">Emergency Line</p>
                  <p className="text-sm font-semibold text-rose-700">{vet.vetEmergencyPhone}</p>
                </div>
              </a>
            )}
            {vet.vetEmail && (
              <a href={`mailto:${vet.vetEmail}`} className="flex items-center gap-3 p-3 rounded-2xl bg-stone-50 hover:bg-primary-50 transition-colors no-underline group">
                <div className="w-9 h-9 rounded-xl bg-primary-100 flex items-center justify-center flex-shrink-0">
                  <Mail className="h-4 w-4 text-primary-600" />
                </div>
                <div>
                  <p className="text-xs text-stone-400 font-medium">Email</p>
                  <p className="text-sm font-semibold text-stone-700 group-hover:text-primary-700 truncate">{vet.vetEmail}</p>
                </div>
              </a>
            )}
            {vet.vetWebsite?.url && (
              <a href={vet.vetWebsite.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-2xl bg-stone-50 hover:bg-primary-50 transition-colors no-underline group">
                <div className="w-9 h-9 rounded-xl bg-primary-100 flex items-center justify-center flex-shrink-0">
                  <Globe className="h-4 w-4 text-primary-600" />
                </div>
                <div>
                  <p className="text-xs text-stone-400 font-medium">Website</p>
                  <p className="text-sm font-semibold text-stone-700 group-hover:text-primary-700 flex items-center gap-1">
                    {vet.vetWebsite.title || "Visit Website"} <ExternalLink className="h-3 w-3" />
                  </p>
                </div>
              </a>
            )}
            {address && (
              <a href={`https://maps.google.com/?q=${encodeURIComponent(address)}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-2xl bg-stone-50 hover:bg-primary-50 transition-colors no-underline group sm:col-span-2">
                <div className="w-9 h-9 rounded-xl bg-primary-100 flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-4 w-4 text-primary-600" />
                </div>
                <div>
                  <p className="text-xs text-stone-400 font-medium">Address</p>
                  <p className="text-sm font-semibold text-stone-700 group-hover:text-primary-700">{address}</p>
                </div>
              </a>
            )}
          </div>
        </div>

        {/* Two-column detail */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">

            {/* Description */}
            {vet.body?.processed && (
              <div className="bg-white rounded-3xl shadow-soft border border-stone-100 p-6">
                <h2 className="text-xl text-stone-800 mb-4" style={{ fontFamily: "'Fredoka One', ui-rounded, system-ui, sans-serif" }}>About</h2>
                <div
                  className="prose prose-stone prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: vet.body.processed }}
                />
              </div>
            )}

            {/* Public notes */}
            {vet.vetPublicNotes && !vet.body?.processed && (
              <div className="bg-white rounded-3xl shadow-soft border border-stone-100 p-6">
                <p className="text-stone-600 leading-relaxed">{vet.vetPublicNotes}</p>
              </div>
            )}

            {/* Staff */}
            {vet.vetStaff && vet.vetStaff.length > 0 && (
              <div className="bg-white rounded-3xl shadow-soft border border-stone-100 p-6">
                <h2 className="text-xl text-stone-800 mb-4 flex items-center gap-2" style={{ fontFamily: "'Fredoka One', ui-rounded, system-ui, sans-serif" }}>
                  <Users className="h-5 w-5 text-primary-500" /> Staff
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {vet.vetStaff.map((s, i) => (
                    <div key={i} className="bg-stone-50 rounded-2xl p-4">
                      <p className="font-semibold text-stone-800">{s.staffName}</p>
                      {s.staffRole && <p className="text-sm text-stone-500 mb-2">{s.staffRole}</p>}
                      {s.staffPhone && (
                        <a href={`tel:${s.staffPhone.replace(/\D/g, "")}`} className="flex items-center gap-1.5 text-sm text-primary-600 no-underline hover:underline">
                          <Phone className="h-3.5 w-3.5" /> {s.staffPhone}
                        </a>
                      )}
                      {s.staffEmail && (
                        <a href={`mailto:${s.staffEmail}`} className="flex items-center gap-1.5 text-sm text-primary-600 no-underline hover:underline">
                          <Mail className="h-3.5 w-3.5" /> {s.staffEmail}
                        </a>
                      )}
                      {s.staffNotes && <p className="text-xs text-stone-400 mt-2 italic">{s.staffNotes}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">

            {/* Hours */}
            {vet.vetHours && (
              <div className="bg-white rounded-3xl shadow-soft border border-stone-100 p-5">
                <h3 className="font-semibold text-stone-700 mb-3 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary-500" /> Hours
                </h3>
                <p className="text-sm text-stone-600 whitespace-pre-line">{vet.vetHours}</p>
              </div>
            )}

            {/* Species */}
            {vet.vetSeesExotics && vet.vetSpecies && vet.vetSpecies.length > 0 && (
              <div className="bg-white rounded-3xl shadow-soft border border-stone-100 p-5">
                <h3 className="font-semibold text-stone-700 mb-3 flex items-center gap-2">
                  <Heart className="h-4 w-4 text-violet-500" /> Species Seen
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {vet.vetSpecies.map((s) => (
                    <span key={s} className="rounded-full bg-violet-50 border border-violet-100 px-2.5 py-1 text-xs text-violet-700 font-medium">
                      {SPECIES_LABELS[s] ?? s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Specialties */}
            {vet.vetSpecialties && (
              <div className="bg-white rounded-3xl shadow-soft border border-stone-100 p-5">
                <h3 className="font-semibold text-stone-700 mb-2 flex items-center gap-2">
                  <Stethoscope className="h-4 w-4 text-primary-500" /> Specialties
                </h3>
                <p className="text-sm text-stone-600">{vet.vetSpecialties}</p>
              </div>
            )}

            {/* Rescue discount */}
            {vet.vetRescueDiscount && (
              <div className="bg-emerald-50 rounded-3xl border border-emerald-100 p-5">
                <h3 className="font-semibold text-emerald-800 mb-2 flex items-center gap-2">
                  <Tag className="h-4 w-4" /> Rescue Discount
                </h3>
                {vet.vetDiscountDetails && (
                  <p className="text-sm text-emerald-700">{vet.vetDiscountDetails}</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Public share bar */}
        <PublicShareBar
          url={canonicalUrl}
          title={`${vet.vetPracticeName} — Vet Directory`}
          description={vet.vetPublicNotes ?? `${vet.vetPracticeName} is a trusted vet in our network.`}
        />
      </div>
    </div>
  );
}
