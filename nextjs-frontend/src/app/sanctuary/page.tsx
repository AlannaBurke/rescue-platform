import type { Metadata } from "next";
import Link from "next/link";
import { Home, Star } from "lucide-react";
import { getClient } from "@/lib/apollo-client";
import { GET_ANIMALS_LIST } from "@/lib/graphql/animals";
import AnimalCard from "@/components/animals/AnimalCard";
import type { Animal } from "@/types/drupal";

export const metadata: Metadata = {
  title: "Sanctuary Animals",
  description:
    "Meet our permanent sanctuary residents — animals who have found their forever home with us.",
};

export default async function SanctuaryPage() {
  let animals: Animal[] = [];

  try {
    const { data } = await getClient().query({
      query: GET_ANIMALS_LIST,
      variables: { first: 100 },
    });
    // Filter to sanctuary animals that are not excluded from public view
    animals = (((data as any)?.nodeAnimals?.nodes as Animal[]) || []).filter(
      (a) =>
        !a.excludePublic &&
        a.lifecycleStatus?.name === "Sanctuary"
    );
    // Featured animals first
    animals.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
  } catch {
    // Graceful fallback when API is unavailable
  }

  const featured = animals.filter((a) => a.isFeatured);
  const regular = animals.filter((a) => !a.isFeatured);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 border-b border-emerald-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 text-center">
          <div className="flex justify-center mb-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 shadow-lg">
              <Home className="h-7 w-7 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-4">
            Our Sanctuary Family
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Some animals come to us with needs that make traditional adoption
            difficult — chronic health conditions, advanced age, or simply a
            personality that thrives best in a stable, permanent environment.
            These are our sanctuary residents. They are not available for
            adoption, but they are deeply loved and cared for as permanent
            members of our family.
          </p>
        </div>
      </div>

      {/* What is Sanctuary? */}
      <div className="bg-white border-b border-gray-100">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-100">
              <div className="text-3xl mb-3">🏡</div>
              <h3 className="font-bold text-gray-900 mb-2">Permanent Home</h3>
              <p className="text-sm text-gray-600">
                Sanctuary animals live with us for the rest of their natural
                lives, receiving consistent, specialized care.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-teal-50 border border-teal-100">
              <div className="text-3xl mb-3">💊</div>
              <h3 className="font-bold text-gray-900 mb-2">Medical Care</h3>
              <p className="text-sm text-gray-600">
                Many sanctuary residents have ongoing medical needs. We are
                committed to providing the care they require.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-cyan-50 border border-cyan-100">
              <div className="text-3xl mb-3">❤️</div>
              <h3 className="font-bold text-gray-900 mb-2">Support Them</h3>
              <p className="text-sm text-gray-600">
                Sanctuary care is expensive. Your donations directly fund the
                food, housing, and medical care for these animals.
              </p>
            </div>
          </div>
          <div className="text-center mt-6">
            <Link
              href="/donate"
              className="inline-flex items-center gap-2 bg-emerald-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-emerald-700 transition-colors"
            >
              Support Our Sanctuary
            </Link>
          </div>
        </div>
      </div>

      {/* Animals */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        {animals.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🌿</div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              No sanctuary residents at this time
            </h2>
            <p className="text-gray-500">Check back soon.</p>
          </div>
        ) : (
          <>
            {/* Featured sanctuary members */}
            {featured.length > 0 && (
              <div className="mb-10">
                <div className="flex items-center gap-2 mb-5">
                  <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                  <h2 className="text-xl font-bold text-gray-900">
                    Featured Residents
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {featured.map((animal) => (
                    <AnimalCard key={animal.id} animal={animal} />
                  ))}
                </div>
              </div>
            )}

            {/* All sanctuary members */}
            {regular.length > 0 && (
              <div>
                {featured.length > 0 && (
                  <h2 className="text-xl font-bold text-gray-900 mb-5">
                    All Sanctuary Residents
                  </h2>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {regular.map((animal) => (
                    <AnimalCard key={animal.id} animal={animal} />
                  ))}
                </div>
              </div>
            )}

            <p className="text-center text-sm text-gray-400 mt-8">
              {animals.length} sanctuary resident{animals.length !== 1 ? "s" : ""}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
