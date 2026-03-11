"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Phone, Globe, MapPin, Star, AlertTriangle, Stethoscope,
  Search, Filter, DollarSign, Tag, CheckCircle2, Heart, X,
  ChevronDown, Mail, Clock, Users
} from "lucide-react";
import { drupalImageUrl } from "@/lib/utils";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface StaffMember {
  staffName: string | null;
  staffRole: string | null;
  staffPhone: string | null;
  staffEmail: string | null;
  staffNotes: string | null;
}

export interface VetNode {
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
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const ENDORSEMENT_LABELS: Record<string, string> = {
  listed: "Listed",
  recommended: "Recommended",
  endorsed_partner: "Endorsed Partner",
};

const ENDORSEMENT_COLORS: Record<string, string> = {
  listed: "bg-stone-100 text-stone-700",
  recommended: "bg-primary-100 text-primary-700",
  endorsed_partner: "bg-amber-100 text-amber-800",
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

const ALL_SPECIES = Object.keys(SPECIES_LABELS);

function CostRating({ rating }: { rating: number | null }) {
  if (!rating) return null;
  return (
    <div className="flex items-center gap-0.5" title={`Cost: ${rating}/5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <DollarSign
          key={i}
          className={`h-3.5 w-3.5 ${i < rating ? "text-emerald-600" : "text-stone-200"}`}
        />
      ))}
    </div>
  );
}

// ─── VetCard ─────────────────────────────────────────────────────────────────

function VetCard({ vet, expanded, onToggle }: {
  vet: VetNode;
  expanded: boolean;
  onToggle: () => void;
}) {
  const address = [vet.vetStreet, vet.vetCity, vet.vetState, vet.vetZip].filter(Boolean).join(", ");
  const imgSrc = vet.vetPhoto?.url ? drupalImageUrl(vet.vetPhoto.url) : null;

  const borderColor = vet.vetIsEmergency
    ? "border-rose-200"
    : vet.vetEndorsement === "endorsed_partner"
    ? "border-amber-200"
    : vet.vetIsPreferred
    ? "border-primary-200"
    : "border-stone-100";

  const headerBg = vet.vetIsEmergency
    ? "bg-rose-50"
    : vet.vetEndorsement === "endorsed_partner"
    ? "bg-amber-50"
    : vet.vetIsPreferred
    ? "bg-primary-50"
    : "bg-white";

  return (
    <div className={`bg-white rounded-3xl shadow-soft border ${borderColor} overflow-hidden transition-shadow hover:shadow-md`}>
      {/* Card Header */}
      <div className={`${headerBg} p-5`}>
        <div className="flex gap-4">
          {imgSrc ? (
            <div className="flex-shrink-0 w-14 h-14 rounded-2xl overflow-hidden bg-stone-100 border border-stone-100">
              <Image
                src={imgSrc}
                alt={vet.vetPracticeName}
                width={56}
                height={56}
                className="object-cover w-full h-full"
                unoptimized
              />
            </div>
          ) : (
            <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-stone-100 flex items-center justify-center">
              <Stethoscope className="h-6 w-6 text-stone-400" />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <Link
                href={`/vets/${vet.id}`}
                className="no-underline hover:underline"
              >
                <h3
                  className="text-lg text-stone-800 leading-tight hover:text-primary-700 transition-colors"
                  style={{ fontFamily: "'Fredoka One', ui-rounded, system-ui, sans-serif" }}
                >
                  {vet.vetPracticeName}
                </h3>
              </Link>
              <button
                onClick={onToggle}
                className="flex-shrink-0 p-1 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors"
                aria-label={expanded ? "Collapse" : "Expand"}
              >
                <ChevronDown className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`} />
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {vet.vetIsEmergency && (
                <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2 py-0.5 text-xs font-semibold text-rose-700">
                  <AlertTriangle className="h-3 w-3" /> 24hr Emergency
                </span>
              )}
              {vet.vetEndorsement && vet.vetEndorsement !== "listed" && (
                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${ENDORSEMENT_COLORS[vet.vetEndorsement] ?? "bg-stone-100 text-stone-700"}`}>
                  <CheckCircle2 className="h-3 w-3" />
                  {ENDORSEMENT_LABELS[vet.vetEndorsement] ?? vet.vetEndorsement}
                </span>
              )}
              {vet.vetIsPreferred && !vet.vetEndorsement && (
                <span className="inline-flex items-center gap-1 rounded-full bg-primary-100 px-2 py-0.5 text-xs font-semibold text-primary-700">
                  <Star className="h-3 w-3" /> Preferred
                </span>
              )}
              {vet.vetSeesExotics && (
                <span className="inline-flex items-center gap-1 rounded-full bg-violet-100 px-2 py-0.5 text-xs font-semibold text-violet-700">
                  <Heart className="h-3 w-3" /> Sees Exotics
                </span>
              )}
              {vet.vetRescueDiscount && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                  <Tag className="h-3 w-3" /> Rescue Discount
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm">
          {vet.vetPhone && (
            <a
              href={`tel:${vet.vetPhone.replace(/\D/g, "")}`}
              className="flex items-center gap-1.5 text-stone-600 hover:text-primary-700 no-underline transition-colors font-medium"
            >
              <Phone className="h-3.5 w-3.5 text-primary-400 flex-shrink-0" />
              {vet.vetPhone}
            </a>
          )}
          {vet.vetCity && (
            <span className="flex items-center gap-1.5 text-stone-500">
              <MapPin className="h-3.5 w-3.5 text-stone-400 flex-shrink-0" />
              {vet.vetCity}{vet.vetState ? `, ${vet.vetState}` : ""}
            </span>
          )}
          <CostRating rating={vet.vetCostRating} />
        </div>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="px-5 pb-5 pt-4 border-t border-stone-100 space-y-4">

          {vet.vetSeesExotics && vet.vetSpecies && vet.vetSpecies.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1.5">Species Seen</p>
              <div className="flex flex-wrap gap-1.5">
                {vet.vetSpecies.map((s) => (
                  <span key={s} className="rounded-full bg-violet-50 border border-violet-100 px-2.5 py-0.5 text-xs text-violet-700 font-medium">
                    {SPECIES_LABELS[s] ?? s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {vet.vetSpecialties && (
            <div>
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1">Specialties</p>
              <p className="text-sm text-stone-600">{vet.vetSpecialties}</p>
            </div>
          )}

          {vet.vetRescueDiscount && vet.vetDiscountDetails && (
            <div className="bg-emerald-50 rounded-xl p-3">
              <p className="text-xs font-semibold text-emerald-700 mb-0.5">Rescue Discount</p>
              <p className="text-sm text-emerald-800">{vet.vetDiscountDetails}</p>
            </div>
          )}

          <div className="space-y-1.5 text-sm">
            {vet.vetEmergencyPhone && vet.vetEmergencyPhone !== vet.vetPhone && (
              <a
                href={`tel:${vet.vetEmergencyPhone.replace(/\D/g, "")}`}
                className="flex items-center gap-2 text-rose-600 hover:text-rose-800 no-underline font-semibold transition-colors"
              >
                <Phone className="h-3.5 w-3.5 flex-shrink-0" />
                {vet.vetEmergencyPhone} <span className="text-rose-400 font-normal">(Emergency Line)</span>
              </a>
            )}
            {vet.vetEmail && (
              <a
                href={`mailto:${vet.vetEmail}`}
                className="flex items-center gap-2 text-stone-600 hover:text-primary-700 no-underline transition-colors"
              >
                <Mail className="h-3.5 w-3.5 text-stone-400 flex-shrink-0" />
                {vet.vetEmail}
              </a>
            )}
            {address && (
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2 text-stone-500 hover:text-primary-700 no-underline transition-colors"
              >
                <MapPin className="h-3.5 w-3.5 text-stone-400 flex-shrink-0 mt-0.5" />
                <span>{address}</span>
              </a>
            )}
            {vet.vetWebsite?.url && (
              <a
                href={vet.vetWebsite.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-primary-600 hover:text-primary-800 no-underline transition-colors"
              >
                <Globe className="h-3.5 w-3.5 flex-shrink-0" />
                {vet.vetWebsite.title || "Visit Website"}
              </a>
            )}
          </div>

          {vet.vetHours && (
            <div className="flex items-start gap-2 text-sm text-stone-500">
              <Clock className="h-3.5 w-3.5 text-stone-400 flex-shrink-0 mt-0.5" />
              <span className="whitespace-pre-line">{vet.vetHours}</span>
            </div>
          )}

          {vet.vetStaff && vet.vetStaff.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5" /> Staff
              </p>
              <div className="space-y-2">
                {vet.vetStaff.map((s, i) => (
                  <div key={i} className="flex items-start gap-3 bg-stone-50 rounded-xl p-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-stone-800">{s.staffName}</p>
                      {s.staffRole && <p className="text-xs text-stone-500">{s.staffRole}</p>}
                      {s.staffPhone && (
                        <a href={`tel:${s.staffPhone.replace(/\D/g, "")}`} className="text-xs text-primary-600 no-underline hover:underline">
                          {s.staffPhone}
                        </a>
                      )}
                      {s.staffEmail && (
                        <a href={`mailto:${s.staffEmail}`} className="block text-xs text-primary-600 no-underline hover:underline">
                          {s.staffEmail}
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {vet.vetPublicNotes && (
            <p className="text-sm text-stone-600 bg-stone-50 rounded-xl p-3 italic">{vet.vetPublicNotes}</p>
          )}

          <div className="pt-2">
            <Link
              href={`/vets/${vet.id}`}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-800 no-underline transition-colors"
            >
              View full profile →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── VetDirectory ─────────────────────────────────────────────────────────────

export default function VetDirectory({ vets }: { vets: VetNode[] }) {
  const [search, setSearch] = useState("");
  const [filterEmergency, setFilterEmergency] = useState(false);
  const [filterExotics, setFilterExotics] = useState(false);
  const [filterDiscount, setFilterDiscount] = useState(false);
  const [filterEndorsed, setFilterEndorsed] = useState(false);
  const [filterSpecies, setFilterSpecies] = useState<string[]>([]);
  const [filterMaxCost, setFilterMaxCost] = useState<number>(5);
  const [showFilters, setShowFilters] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleSpecies = (s: string) =>
    setFilterSpecies((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);

  const activeFilterCount = [
    filterEmergency, filterExotics, filterDiscount, filterEndorsed,
    filterSpecies.length > 0, filterMaxCost < 5,
  ].filter(Boolean).length;

  const filtered = useMemo(() => {
    return vets.filter((v) => {
      if (search) {
        const q = search.toLowerCase();
        const haystack = [
          v.vetPracticeName, v.vetCity, v.vetState, v.vetSpecialties,
          v.vetDoctorNames, v.vetPublicNotes,
          ...(v.vetStaff ?? []).map((s) => s.staffName),
          ...(v.vetSpecies ?? []),
        ].filter(Boolean).join(" ").toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      if (filterEmergency && !v.vetIsEmergency) return false;
      if (filterExotics && !v.vetSeesExotics) return false;
      if (filterDiscount && !v.vetRescueDiscount) return false;
      if (filterEndorsed && v.vetEndorsement !== "endorsed_partner" && v.vetEndorsement !== "recommended") return false;
      if (filterSpecies.length > 0) {
        const vetSpecies = v.vetSpecies ?? [];
        if (!filterSpecies.some((s) => vetSpecies.includes(s))) return false;
      }
      if (filterMaxCost < 5 && v.vetCostRating && v.vetCostRating > filterMaxCost) return false;
      return true;
    });
  }, [vets, search, filterEmergency, filterExotics, filterDiscount, filterEndorsed, filterSpecies, filterMaxCost]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const score = (v: VetNode) =>
        (v.vetIsEmergency ? 100 : 0) +
        (v.vetEndorsement === "endorsed_partner" ? 50 : 0) +
        (v.vetEndorsement === "recommended" ? 30 : 0) +
        (v.vetIsPreferred ? 20 : 0);
      return score(b) - score(a);
    });
  }, [filtered]);

  const clearFilters = () => {
    setSearch("");
    setFilterEmergency(false);
    setFilterExotics(false);
    setFilterDiscount(false);
    setFilterEndorsed(false);
    setFilterSpecies([]);
    setFilterMaxCost(5);
  };

  return (
    <div>
      {/* Search + Filter bar */}
      <div className="bg-white rounded-3xl shadow-soft border border-stone-100 p-4 mb-6">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by name, city, species, specialty…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-2xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent bg-stone-50"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <button
            onClick={() => setShowFilters((v) => !v)}
            className={`flex items-center gap-2 px-4 py-3 rounded-2xl border text-sm font-semibold transition-colors ${
              showFilters || activeFilterCount > 0
                ? "bg-primary-600 text-white border-primary-600"
                : "border-stone-200 text-stone-600 hover:border-primary-300 hover:text-primary-700 bg-stone-50"
            }`}
          >
            <Filter className="h-4 w-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="bg-white text-primary-700 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-stone-100 space-y-4">
            <div className="flex flex-wrap gap-2">
              {[
                { label: "Emergency / 24hr", active: filterEmergency, set: setFilterEmergency, icon: <AlertTriangle className="h-3.5 w-3.5" /> },
                { label: "Sees Exotics", active: filterExotics, set: setFilterExotics, icon: <Heart className="h-3.5 w-3.5" /> },
                { label: "Rescue Discount", active: filterDiscount, set: setFilterDiscount, icon: <Tag className="h-3.5 w-3.5" /> },
                { label: "Endorsed / Recommended", active: filterEndorsed, set: setFilterEndorsed, icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
              ].map(({ label, active, set, icon }) => (
                <button
                  key={label}
                  onClick={() => set((v: boolean) => !v)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                    active
                      ? "bg-primary-600 text-white border-primary-600"
                      : "bg-white text-stone-600 border-stone-200 hover:border-primary-300"
                  }`}
                >
                  {icon} {label}
                </button>
              ))}
            </div>

            <div>
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2">Filter by Species</p>
              <div className="flex flex-wrap gap-1.5">
                {ALL_SPECIES.map((s) => (
                  <button
                    key={s}
                    onClick={() => toggleSpecies(s)}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                      filterSpecies.includes(s)
                        ? "bg-violet-600 text-white border-violet-600"
                        : "bg-white text-stone-600 border-stone-200 hover:border-violet-300"
                    }`}
                  >
                    {SPECIES_LABELS[s]}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2">
                Max Cost Rating: {filterMaxCost === 5 ? "Any" : `${"$".repeat(filterMaxCost)} or less`}
              </p>
              <input
                type="range"
                min={1}
                max={5}
                value={filterMaxCost}
                onChange={(e) => setFilterMaxCost(Number(e.target.value))}
                className="w-full max-w-xs accent-primary-600"
              />
            </div>

            {activeFilterCount > 0 && (
              <button onClick={clearFilters} className="text-sm text-stone-500 hover:text-rose-600 transition-colors flex items-center gap-1">
                <X className="h-3.5 w-3.5" /> Clear all filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-stone-500">
          {sorted.length} vet{sorted.length !== 1 ? "s" : ""} found
          {(activeFilterCount > 0 || search) && (
            <> · <button onClick={clearFilters} className="text-primary-600 hover:underline">clear filters</button></>
          )}
        </p>
        <button
          onClick={() => setExpandedId(expandedId ? null : "all")}
          className="text-xs text-stone-400 hover:text-stone-600 transition-colors"
        >
          {expandedId ? "Collapse all" : "Expand all"}
        </button>
      </div>

      {/* Vet grid */}
      {sorted.length === 0 ? (
        <div className="text-center py-20">
          <Stethoscope className="h-12 w-12 text-stone-300 mx-auto mb-4" />
          <p className="text-stone-500 text-lg mb-2">No vets match your filters</p>
          <button onClick={clearFilters} className="text-primary-600 hover:underline text-sm">Clear all filters</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {sorted.map((vet) => (
            <VetCard
              key={vet.id}
              vet={vet}
              expanded={expandedId === vet.id || expandedId === "all"}
              onToggle={() => setExpandedId((prev) => (prev === vet.id ? null : vet.id))}
            />
          ))}
        </div>
      )}
    </div>
  );
}
