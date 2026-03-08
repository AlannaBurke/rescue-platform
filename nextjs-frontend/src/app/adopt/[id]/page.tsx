import type { Metadata } from "next";
import Link from "next/link";
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
} from "lucide-react";
import { getClient } from "@/lib/apollo-client";
import { GET_ANIMAL } from "@/lib/graphql/animals";
import { formatAge, capitalize, formatDate } from "@/lib/utils";
import type { Animal } from "@/types/drupal";
import type { GetAnimalQuery } from "@/types/graphql"

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
      `Meet ${animal.title}, a ${animal.animalSpecies?.name ?? "animal"} available for adoption.`,
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

function CompatibilityRow({
  label,
  value,
  icon,
}: {
  label: string;
  value?: boolean | null;
  icon: string;
}) {
  if (value === undefined || value === null) return null;
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-gray-100 last:border-0">
      <span className="text-xl">{icon}</span>
      <span className="flex-1 text-sm text-gray-700">{label}</span>
      {value ? (
        <div className="flex items-center gap-1 text-green-600">
          <CheckCircle className="h-4 w-4" />
          <span className="text-xs font-medium">Yes</span>
        </div>
      ) : (
        <div className="flex items-center gap-1 text-red-500">
          <XCircle className="h-4 w-4" />
          <span className="text-xs font-medium">No</span>
        </div>
      )}
    </div>
  );
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
  const statusName = animal.animalStatus?.name;

  const isAvailable =
    statusName === "Available" || statusName === "In Foster";

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
          {/* Left column: image + quick details */}
          <div className="lg:col-span-1 space-y-4">
            {/* Photo */}
            <div className="aspect-square rounded-2xl overflow-hidden bg-white shadow-sm border border-gray-100">
              <AnimalPlaceholder species={speciesName} />
            </div>

            {/* Quick details card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-1">
                About {animal.title}
              </h3>
              <div className="divide-y divide-gray-50">
                <DetailRow
                  icon={Tag}
                  label="ID"
                  value={animal.animalId}
                />
                <DetailRow
                  icon={speciesName === "Dog" ? Dog : Cat}
                  label="Species"
                  value={speciesName}
                />
                <DetailRow
                  icon={FileText}
                  label="Breed"
                  value={animal.animalBreed}
                />
                <DetailRow
                  icon={Calendar}
                  label="Age"
                  value={age !== "Age unknown" ? age : undefined}
                />
                <DetailRow
                  icon={Ruler}
                  label="Size"
                  value={animal.animalSize ? capitalize(animal.animalSize) : undefined}
                />
                <DetailRow
                  icon={Heart}
                  label="Sex"
                  value={animal.animalSex ? capitalize(animal.animalSex) : undefined}
                />
                <DetailRow
                  icon={Tag}
                  label="Color"
                  value={animal.animalColor}
                />
                {animal.intakeDate?.time && (
                  <DetailRow
                    icon={Calendar}
                    label="In Our Care Since"
                    value={formatDate(animal.intakeDate.time)}
                  />
                )}
              </div>
            </div>

            {/* Compatibility card */}
            {(animal.goodWithDogs !== undefined ||
              animal.goodWithCats !== undefined ||
              animal.goodWithKids !== undefined) && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-1">
                  Compatibility
                </h3>
                <CompatibilityRow
                  label="Good with other dogs"
                  value={animal.goodWithDogs}
                  icon="🐕"
                />
                <CompatibilityRow
                  label="Good with cats"
                  value={animal.goodWithCats}
                  icon="🐈"
                />
                <CompatibilityRow
                  label="Good with children"
                  value={animal.goodWithKids}
                  icon="👶"
                />
              </div>
            )}
          </div>

          {/* Right column: main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900">
                    {animal.title}
                  </h1>
                  <p className="text-lg text-gray-500 mt-1">
                    {[speciesName, animal.animalBreed]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                </div>
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
                    statusName === "Available"
                      ? "bg-green-100 text-green-800"
                      : statusName === "In Foster"
                      ? "bg-blue-100 text-blue-800"
                      : statusName === "Adopted"
                      ? "bg-purple-100 text-purple-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {statusName || "Status Unknown"}
                </span>
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
                  dangerouslySetInnerHTML={{
                    __html: animal.body.value,
                  }}
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
                  dangerouslySetInnerHTML={{
                    __html: animal.animalNotes.value,
                  }}
                />
              </div>
            )}

            {/* Adoption CTA */}
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
                      Fill out our adoption application and we&apos;ll be in
                      touch within 1–2 business days to discuss next steps.
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

            {/* Already adopted */}
            {statusName === "Adopted" && (
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
          </div>
        </div>
      </div>
    </div>
  );
}
