import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  Heart,
  ArrowLeft,
  Dog,
  Cat,
  Calendar,
  Ruler,
  Tag,
  CheckCircle,
  XCircle,
  FileText,
  MapPin,
  Pill,
  Clock,
  Home,
} from "lucide-react";
import { getClient } from "@/lib/apollo-client";
import { GET_ANIMAL } from "@/lib/graphql/animals";
import { formatAge, capitalize, formatDate, drupalImageUrl } from "@/lib/utils";
import type { Animal } from "@/types/drupal";
import type { GetAnimalQuery } from "@/types/graphql";

interface AnimalPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: AnimalPageProps): Promise<Metadata> {
  const { id } = await params;
  const { data } = await getClient().query<GetAnimalQuery>({
    query: GET_ANIMAL,
    variables: { id },
  });

  const animal: Animal | null = data?.nodeAnimal ?? null;
  if (!animal) return { title: "Animal Not Found" };

  return {
    title: animal.title,
    description:
      animal.body?.summary ||
      `Meet ${animal.title}, a ${animal.animalSpecies?.name ?? "animal"} in our care.`,
  };
}

function AnimalPlaceholder({ species }: { species?: string }) {
  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-rose-50 to-orange-50">
      {species?.toLowerCase() === "dog" ? (
        <Dog className="h-32 w-32 text-rose-200" />
      ) : species?.toLowerCase() === "cat" ? (
        <Cat className="h-32 w-32 text-rose-200" />
      ) : (
        <Heart className="h-32 w-32 text-rose-200 fill-rose-100" />
      )}
    </div>
  );
}

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value?: string | null;
}) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 flex-shrink-0">
        <Icon className="h-4 w-4 text-rose-500" />
      </div>
      <div>
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">
          {label}
        </p>
        <p className="text-sm font-medium text-gray-900 mt-0.5">{value}</p>
      </div>
    </div>
  );
}

// Map of compatibility keys to display labels and emoji
const COMPAT_MAP: Record<string, { label: string; icon: string }> = {
  dogs:          { label: "Dogs",          icon: "🐕" },
  cats:          { label: "Cats",          icon: "🐈" },
  kids:          { label: "Children",      icon: "👶" },
  rabbits:       { label: "Rabbits",       icon: "🐇" },
  guinea_pigs:   { label: "Guinea Pigs",   icon: "🐹" },
  rats:          { label: "Rats",          icon: "🐀" },
  birds:         { label: "Birds",         icon: "🐦" },
  reptiles:      { label: "Reptiles",      icon: "🦎" },
  small_animals: { label: "Small Animals", icon: "🐾" },
};

function CompatibilitySection({ animal }: { animal: Animal }) {
  const goodWith    = animal.goodWith    ?? [];
  const notGoodWith = animal.notGoodWith ?? [];
  if (goodWith.length === 0 && notGoodWith.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
      <h3 className="text-sm font-semibold text-gray-900 mb-1">Compatibility</h3>
      {goodWith.map((key) => {
        const meta = COMPAT_MAP[key] ?? { label: key, icon: "🐾" };
        return (
          <div key={`good-${key}`} className="flex items-center gap-3 py-2.5 border-b border-gray-100 last:border-0">
            <span className="text-xl">{meta.icon}</span>
            <span className="flex-1 text-sm text-gray-700">Good with {meta.label}</span>
            <div className="flex items-center gap-1 text-green-600">
              <CheckCircle className="h-4 w-4" />
              <span className="text-xs font-medium">Yes</span>
            </div>
          </div>
        );
      })}
      {notGoodWith.map((key) => {
        const meta = COMPAT_MAP[key] ?? { label: key, icon: "🐾" };
        return (
          <div key={`no-${key}`} className="flex items-center gap-3 py-2.5 border-b border-gray-100 last:border-0">
            <span className="text-xl">{meta.icon}</span>
            <span className="flex-1 text-sm text-gray-700">Good with {meta.label}</span>
            <div className="flex items-center gap-1 text-red-500">
              <XCircle className="h-4 w-4" />
              <span className="text-xs font-medium">No</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function lifecycleColor(status?: string) {
  switch (status) {
    case "Available for Adoption": return "bg-green-100 text-green-800";
    case "Adoption Pending":       return "bg-yellow-100 text-yellow-800";
    case "In Foster":              return "bg-blue-100 text-blue-800";
    case "Adopted":                return "bg-purple-100 text-purple-800";
    case "Sanctuary":              return "bg-emerald-100 text-emerald-800";
    case "Hospice":                return "bg-orange-100 text-orange-800";
    case "Pregnancy Watch":        return "bg-pink-100 text-pink-800";
    case "Deceased (Rainbow Bridge)": return "bg-violet-100 text-violet-800";
    default:                       return "bg-gray-100 text-gray-800";
  }
}

export default async function AnimalPage({ params }: AnimalPageProps) {
  const { id } = await params;

  const { data } = await getClient().query<GetAnimalQuery>({
    query: GET_ANIMAL,
    variables: { id },
  });

  const animal: Animal | null = data?.nodeAnimal ?? null;
  if (!animal || !animal.status) notFound();

  const age = formatAge(animal.animalAgeYears, animal.animalAgeMonths);
  const speciesName = animal.animalSpecies?.name;
  const lifecycleName = (animal as any).lifecycleStatus?.name as string | undefined;

  const isAvailable =
    lifecycleName === "Available for Adoption" ||
    lifecycleName === "In Foster";
  const isSanctuary  = lifecycleName === "Sanctuary";
  const isHospice    = lifecycleName === "Hospice";
  const isRainbow    = lifecycleName === "Deceased (Rainbow Bridge)";
  const isAdopted    = lifecycleName === "Adopted";

  // History log sorted newest first
  const historyLog: any[] = ((animal as any).historyLog ?? []).slice().sort(
    (a: any, b: any) =>
      new Date(b.logDate?.time ?? 0).getTime() -
      new Date(a.logDate?.time ?? 0).getTime()
  );

  // Active medications (no end date or end date in the future)
  const now = Date.now();
  const activeMeds: any[] = ((animal as any).medicationLog ?? []).filter(
    (m: any) => !m.medEndDate?.time || new Date(m.medEndDate.time).getTime() > now
  );

  // Placement history sorted newest first
  const placements: any[] = ((animal as any).placementHistory ?? []).slice().sort(
    (a: any, b: any) =>
      new Date(b.placementStartDate?.time ?? 0).getTime() -
      new Date(a.placementStartDate?.time ?? 0).getTime()
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
          <Link
            href="/adopt"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-rose-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to all animals
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── Left column ── */}
          <div className="lg:col-span-1 space-y-4">
            {/* Photo */}
            <div className="aspect-square rounded-2xl overflow-hidden bg-white shadow-sm border border-gray-100 relative">
              {animal.animalPhotos && animal.animalPhotos.length > 0 ? (
                <Image
                  src={drupalImageUrl(animal.animalPhotos[0].url)}
                  alt={animal.animalPhotos[0].alt || animal.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  priority
                />
              ) : (
                <AnimalPlaceholder species={speciesName} />
              )}
            </div>
            {/* Photo gallery (additional photos) */}
            {animal.animalPhotos && animal.animalPhotos.length > 1 && (
              <div className="grid grid-cols-3 gap-2">
                {animal.animalPhotos.slice(1, 4).map((photo, i) => (
                  <div key={i} className="aspect-square rounded-xl overflow-hidden relative bg-gray-100">
                    <Image
                      src={drupalImageUrl(photo.url)}
                      alt={photo.alt || `${animal.title} photo ${i + 2}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 33vw, 11vw"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Quick details */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-1">
                About {animal.title}
              </h3>
              <div className="divide-y divide-gray-50">
                <DetailRow icon={Tag}      label="ID"      value={animal.animalId} />
                <DetailRow icon={speciesName === "Dog" ? Dog : Cat} label="Species" value={speciesName} />
                <DetailRow icon={FileText} label="Breed"   value={animal.animalBreed} />
                <DetailRow icon={Calendar} label="Age"     value={age !== "Age unknown" ? age : undefined} />
                <DetailRow icon={Ruler}    label="Size"    value={animal.animalSize ? capitalize(animal.animalSize) : undefined} />
                <DetailRow icon={Heart}    label="Sex"     value={animal.animalSex ? capitalize(animal.animalSex) : undefined} />
                <DetailRow icon={Tag}      label="Color"   value={animal.animalColor} />
                <DetailRow icon={MapPin}   label="Source"  value={(animal as any).animalSource?.value} />
                {animal.intakeDate?.time && (
                  <DetailRow icon={Calendar} label="In Our Care Since" value={formatDate(animal.intakeDate.time)} />
                )}
                {isAdopted && (animal as any).adoptionDate?.time && (
                  <DetailRow icon={Heart} label="Adopted" value={formatDate((animal as any).adoptionDate.time)} />
                )}
                {isRainbow && (animal as any).dateOfPassing?.time && (
                  <DetailRow icon={Calendar} label="Crossed the Bridge" value={formatDate((animal as any).dateOfPassing.time)} />
                )}
              </div>
            </div>

            {/* Compatibility */}
            <CompatibilitySection animal={animal} />

            {/* Active medications */}
            {activeMeds.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Pill className="h-4 w-4 text-blue-500" />
                  <h3 className="text-sm font-semibold text-gray-900">
                    Current Medications
                  </h3>
                </div>
                <div className="space-y-3">
                  {activeMeds.map((med: any) => (
                    <div key={med.id} className="rounded-lg bg-blue-50 border border-blue-100 p-3">
                      <p className="text-sm font-semibold text-blue-900">{med.medName}</p>
                      {med.medDosage && (
                        <p className="text-xs text-blue-700 mt-0.5">Dose: {med.medDosage}</p>
                      )}
                      {med.medFrequency && (
                        <p className="text-xs text-blue-700">Frequency: {med.medFrequency}</p>
                      )}
                      {med.medStartDate?.time && (
                        <p className="text-xs text-blue-500 mt-1">
                          Started: {formatDate(med.medStartDate.time)}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Right column ── */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900">{animal.title}</h1>
                  <p className="text-lg text-gray-500 mt-1">
                    {[speciesName, animal.animalBreed].filter(Boolean).join(" · ")}
                  </p>
                </div>
                {lifecycleName && (
                  <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${lifecycleColor(lifecycleName)}`}>
                    {lifecycleName}
                  </span>
                )}
              </div>
            </div>

            {/* Bio */}
            {animal.body?.value && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  About {animal.title}
                </h2>
                <div
                  className="drupal-content text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: animal.body.value }}
                />
              </div>
            )}

            {/* Staff notes */}
            {animal.animalNotes?.value && (
              <div className="bg-amber-50 rounded-2xl border border-amber-100 p-6">
                <h2 className="text-sm font-semibold text-amber-800 uppercase tracking-wide mb-3">
                  Staff Notes
                </h2>
                <div
                  className="text-amber-900 text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: animal.animalNotes.value }}
                />
              </div>
            )}

            {/* Current foster */}
            {(animal as any).currentFoster?.title && (
              <div className="bg-blue-50 rounded-2xl border border-blue-100 p-5 flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                  <Home className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-blue-500 uppercase tracking-wide">Currently Fostered By</p>
                  <p className="text-sm font-semibold text-blue-900">{(animal as any).currentFoster.title}</p>
                </div>
              </div>
            )}

            {/* Placement history */}
            {placements.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <h2 className="text-lg font-semibold text-gray-900">Placement History</h2>
                </div>
                <div className="space-y-3">
                  {placements.map((p: any) => (
                    <div key={p.id} className="rounded-lg bg-gray-50 border border-gray-100 p-4">
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <div>
                          <span className="inline-flex items-center rounded-full bg-blue-100 text-blue-800 px-2.5 py-0.5 text-xs font-medium capitalize">
                            {p.placementType ?? "Placement"}
                          </span>
                          {p.placementPerson?.title && (
                            <p className="text-sm font-medium text-gray-900 mt-1">
                              {p.placementPerson.title}
                            </p>
                          )}
                        </div>
                        <div className="text-xs text-gray-400 text-right">
                          {p.placementStartDate?.time && (
                            <p>{formatDate(p.placementStartDate.time)}</p>
                          )}
                          {p.placementEndDate?.time && (
                            <p>→ {formatDate(p.placementEndDate.time)}</p>
                          )}
                          {!p.placementEndDate?.time && p.placementStartDate?.time && (
                            <p className="text-blue-500 font-medium">Current</p>
                          )}
                        </div>
                      </div>
                      {p.placementNotes?.value && (
                        <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                          {p.placementNotes.value.replace(/<[^>]+>/g, "")}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* History / activity log */}
            {historyLog.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <h2 className="text-lg font-semibold text-gray-900">Activity Log</h2>
                </div>
                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-3.5 top-0 bottom-0 w-px bg-gray-100" />
                  <div className="space-y-4">
                    {historyLog.map((entry: any) => (
                      <div key={entry.id} className="relative flex gap-4 pl-10">
                        {/* Dot */}
                        <div className="absolute left-0 top-1 flex h-7 w-7 items-center justify-center rounded-full bg-rose-100 border-2 border-white shadow-sm">
                          <span className="text-xs">📋</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            {entry.logType && (
                              <span className="inline-flex items-center rounded-full bg-rose-50 text-rose-700 px-2 py-0.5 text-xs font-medium capitalize">
                                {entry.logType}
                              </span>
                            )}
                            {entry.logDate?.time && (
                              <span className="text-xs text-gray-400">
                                {formatDate(entry.logDate.time)}
                              </span>
                            )}
                          </div>
                          {entry.logDetails?.value && (
                            <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                              {entry.logDetails.value.replace(/<[^>]+>/g, "")}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── CTAs based on lifecycle status ── */}

            {/* Available for adoption */}
            {isAvailable && (
              <div className="bg-gradient-to-br from-rose-500 to-rose-600 rounded-2xl p-6 text-white">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 flex-shrink-0">
                    <Heart className="h-6 w-6 text-white fill-white" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold mb-2">
                      Ready to adopt {animal.title}?
                    </h2>
                    <p className="text-rose-100 text-sm mb-4">
                      Fill out our adoption application and we&apos;ll be in touch
                      within 1–2 business days to discuss next steps.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <Link
                        href={`/adopt/apply?animal=${animal.id}`}
                        className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-colors shadow-sm"
                      >
                        <Heart className="h-4 w-4 fill-rose-500 text-rose-500" />
                        Apply to Adopt
                      </Link>
                      <Link
                        href="/contact"
                        className="inline-flex items-center gap-2 rounded-full bg-rose-600/50 px-5 py-2.5 text-sm font-semibold text-white hover:bg-rose-600/70 transition-colors"
                      >
                        Ask a Question
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Adopted */}
            {isAdopted && (
              <div className="bg-purple-50 rounded-2xl border border-purple-100 p-6 text-center">
                <p className="text-purple-800 font-semibold text-lg mb-1">
                  🎉 {animal.title} has been adopted!
                </p>
                <p className="text-purple-600 text-sm mb-4">
                  This animal has found their forever home. Browse our other
                  available animals below.
                </p>
                <Link
                  href="/adopt"
                  className="inline-flex items-center gap-2 rounded-full bg-rose-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-rose-600 transition-colors"
                >
                  <Heart className="h-4 w-4 fill-white" />
                  See Available Animals
                </Link>
              </div>
            )}

            {/* Sanctuary */}
            {isSanctuary && (
              <div className="bg-emerald-50 rounded-2xl border border-emerald-100 p-6 text-center">
                <p className="text-emerald-800 font-semibold text-lg mb-1">
                  🏡 {animal.title} is a permanent sanctuary resident
                </p>
                <p className="text-emerald-700 text-sm mb-4">
                  This animal is not available for adoption, but you can support
                  their care with a donation.
                </p>
                <div className="flex justify-center gap-3 flex-wrap">
                  <Link
                    href="/donate"
                    className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
                  >
                    Support {animal.title}
                  </Link>
                  <Link
                    href="/sanctuary"
                    className="inline-flex items-center gap-2 rounded-full border border-emerald-300 px-5 py-2.5 text-sm font-semibold text-emerald-700 hover:bg-emerald-50 transition-colors"
                  >
                    Meet Our Sanctuary Family
                  </Link>
                </div>
              </div>
            )}

            {/* Hospice */}
            {isHospice && (
              <div className="bg-orange-50 rounded-2xl border border-orange-100 p-6 text-center">
                <p className="text-orange-800 font-semibold text-lg mb-1">
                  💛 {animal.title} is in hospice care
                </p>
                <p className="text-orange-700 text-sm mb-4">
                  {animal.title} is receiving specialized end-of-life care. Your
                  support helps us provide comfort and dignity in their final days.
                </p>
                <Link
                  href="/donate"
                  className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 transition-colors"
                >
                  Support {animal.title}
                </Link>
              </div>
            )}

            {/* Rainbow Bridge */}
            {isRainbow && (
              <div className="bg-violet-50 rounded-2xl border border-violet-100 p-6 text-center">
                <p className="text-violet-800 font-semibold text-lg mb-1">
                  🌈 {animal.title} has crossed the Rainbow Bridge
                </p>
                <p className="text-violet-600 text-sm mb-4">
                  {animal.title} is no longer with us, but will always be
                  remembered and loved. Consider a memorial donation in their
                  honor.
                </p>
                <div className="flex justify-center gap-3 flex-wrap">
                  <Link
                    href="/donate"
                    className="inline-flex items-center gap-2 rounded-full bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 transition-colors"
                  >
                    Make a Memorial Donation
                  </Link>
                  <Link
                    href="/rainbow-bridge"
                    className="inline-flex items-center gap-2 rounded-full border border-violet-300 px-5 py-2.5 text-sm font-semibold text-violet-700 hover:bg-violet-50 transition-colors"
                  >
                    Rainbow Bridge Memorial
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
