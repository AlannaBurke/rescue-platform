import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Heart, Search, FileText } from "lucide-react";
import { getClient } from "@/lib/apollo-client";
import { GET_ANIMALS_LIST } from "@/lib/graphql/animals";
import AnimalCard from "@/components/animals/AnimalCard";
import AnimalFilters from "@/components/animals/AnimalFilters";
import type { Animal } from "@/types/drupal";
import type { GetAnimalsListQuery } from "@/types/graphql";

export const metadata: Metadata = {
  title: "Adopt",
  description:
    "Browse our adoptable animals and find your perfect companion. Every animal deserves a loving forever home.",
};

async function AnimalsGrid({
  searchParams,
}: {
  searchParams: { species?: string; sex?: string; size?: string };
}) {
  const { data } = await getClient().query<GetAnimalsListQuery>({
    query: GET_ANIMALS_LIST,
    variables: { first: 50 },
  });

  let animals: Animal[] = data?.nodeAnimals?.nodes || [];

  // Client-side filtering based on search params
  if (searchParams.species) {
    animals = animals.filter(
      (a) =>
        a.animalSpecies?.name?.toLowerCase() ===
        searchParams.species?.toLowerCase()
    );
  }
  if (searchParams.sex) {
    animals = animals.filter(
      (a) => a.animalSex?.toLowerCase() === searchParams.sex?.toLowerCase()
    );
  }
  if (searchParams.size) {
    animals = animals.filter(
      (a) =>
        a.animalSize?.toLowerCase().replace(" ", "_") ===
        searchParams.size?.toLowerCase()
    );
  }

  // Only show published, adoptable animals (not adopted)
  const adoptableAnimals = animals.filter(
    (a) => a.status && a.animalStatus?.name !== "Adopted" && a.animalStatus?.name !== "Deceased"
  );

  if (adoptableAnimals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-50 mb-4">
          <Search className="h-8 w-8 text-rose-300" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No animals found
        </h3>
        <p className="text-gray-500 max-w-sm">
          Try adjusting your filters, or check back soon — new animals arrive
          regularly!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {adoptableAnimals.map((animal) => (
        <AnimalCard key={animal.id} animal={animal} />
      ))}
    </div>
  );
}

export default async function AdoptPage({
  searchParams,
}: {
  searchParams: Promise<{ species?: string; sex?: string; size?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50 border-b border-rose-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 text-center">
          <div className="flex justify-center mb-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-rose-500 shadow-lg">
              <Heart className="h-7 w-7 text-white fill-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-4">
            Find Your Forever Friend
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
            Every animal in our care is looking for a loving home. Browse our
            available animals and take the first step toward changing a life —
            yours and theirs.
          </p>
          <Link
            href="/adopt/apply"
            className="inline-flex items-center gap-2 bg-rose-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-rose-600 transition-colors shadow-sm"
          >
            <FileText className="h-5 w-5" />
            Start Your Application
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <Suspense fallback={<div className="h-64 bg-white rounded-2xl animate-pulse" />}>
              <AnimalFilters />
            </Suspense>
          </aside>

          {/* Animals grid */}
          <div className="flex-1 min-w-0">
            <Suspense
              fallback={
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-80 bg-white rounded-2xl animate-pulse border border-gray-100"
                    />
                  ))}
                </div>
              }
            >
              <AnimalsGrid searchParams={params} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
