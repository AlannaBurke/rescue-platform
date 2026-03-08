import type { Metadata } from "next";
import Link from "next/link";
import { getClient } from "@/lib/apollo-client";
import { GET_ANIMALS_LIST } from "@/lib/graphql/animals";
import type { Animal } from "@/types/drupal";

export const metadata: Metadata = {
  title: "Rainbow Bridge",
  description:
    "In loving memory of the animals who passed through our care and crossed the Rainbow Bridge.",
};

function RainbowBridgeCard({ animal }: { animal: Animal }) {
  const species = animal.animalSpecies?.name ?? "Animal";
  const passedDate = animal.dateOfPassing?.time
    ? new Date(animal.dateOfPassing.time).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;
  const intakeDate = animal.intakeDate?.time
    ? new Date(animal.intakeDate.time).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      })
    : null;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center hover:shadow-md transition-shadow">
      {/* Memorial icon */}
      <div className="flex justify-center mb-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-violet-50 border-2 border-violet-100">
          <span className="text-3xl">🌈</span>
        </div>
      </div>

      <h3 className="text-lg font-bold text-gray-900 mb-1">{animal.title}</h3>
      <p className="text-sm text-violet-600 font-medium mb-3">{species}</p>

      {(passedDate || intakeDate) && (
        <div className="text-xs text-gray-400 space-y-1 mb-4">
          {intakeDate && <p>Came to us: {intakeDate}</p>}
          {passedDate && <p>Crossed the bridge: {passedDate}</p>}
        </div>
      )}

      {animal.body?.summary && (
        <p className="text-sm text-gray-500 leading-relaxed line-clamp-3">
          {animal.body.summary}
        </p>
      )}
    </div>
  );
}

export default async function RainbowBridgePage() {
  let animals: Animal[] = [];

  try {
    const { data } = await getClient().query({
      query: GET_ANIMALS_LIST,
      variables: { first: 200 },
    });
    animals = (((data as any)?.nodeAnimals?.nodes as Animal[]) || []).filter(
      (a) =>
        !a.excludePublic &&
        a.lifecycleStatus?.name === "Deceased (Rainbow Bridge)"
    );
    // Most recently passed first
    animals.sort((a, b) => {
      const dateA = a.dateOfPassing?.time
        ? new Date(a.dateOfPassing.time).getTime()
        : 0;
      const dateB = b.dateOfPassing?.time
        ? new Date(b.dateOfPassing.time).getTime()
        : 0;
      return dateB - dateA;
    });
  } catch {
    // Graceful fallback
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50 border-b border-violet-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 text-center">
          <div className="text-5xl mb-4">🌈</div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-4">
            Rainbow Bridge
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            This page is a memorial to the animals who passed through our care
            and touched our hearts. They were loved, they were cared for, and
            they will never be forgotten. Run free, little ones.
          </p>
        </div>
      </div>

      {/* Poem */}
      <div className="bg-white border-b border-gray-100">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-10 text-center">
          <blockquote className="text-gray-500 italic leading-relaxed text-sm">
            <p className="mb-3">
              &ldquo;Just this side of heaven is a place called Rainbow Bridge.
              When an animal dies that has been especially close to someone here,
              that pet goes to Rainbow Bridge. There are meadows and hills for
              all of our special friends so they can run and play together.
              There is plenty of food, water and sunshine, and our friends are
              warm and comfortable.&rdquo;
            </p>
            <footer className="text-xs text-gray-400 not-italic">
              — Author Unknown
            </footer>
          </blockquote>
        </div>
      </div>

      {/* Memorial grid */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        {animals.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🌈</div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              No memorials yet
            </h2>
            <p className="text-gray-500">
              This page will honor animals who have crossed the Rainbow Bridge.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {animals.map((animal) => (
                <RainbowBridgeCard key={animal.id} animal={animal} />
              ))}
            </div>
            <p className="text-center text-sm text-gray-400 mt-8">
              In memory of {animals.length} beloved animal
              {animals.length !== 1 ? "s" : ""}
            </p>
          </>
        )}
      </div>

      {/* Support CTA */}
      <div className="bg-violet-50 border-t border-violet-100 py-10">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-3">
            Honor Their Memory
          </h2>
          <p className="text-gray-600 mb-5 text-sm leading-relaxed">
            One of the best ways to honor an animal who has passed is to help
            another animal in need. A donation in their memory helps us continue
            our mission of rescue, rehabilitation, and rehoming.
          </p>
          <Link
            href="/donate"
            className="inline-flex items-center gap-2 bg-violet-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-violet-700 transition-colors"
          >
            Make a Memorial Donation
          </Link>
        </div>
      </div>
    </div>
  );
}
