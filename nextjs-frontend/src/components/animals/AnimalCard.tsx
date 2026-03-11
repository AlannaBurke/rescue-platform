import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";
import { cn, formatAge, capitalize, drupalImageUrl } from "@/lib/utils";
import type { Animal } from "@/types/drupal";

interface AnimalCardProps {
  animal: Animal;
}

function AnimalPlaceholderImage({ species }: { species?: string }) {
  const isdog = species?.toLowerCase() === "dog";
  const isCat = species?.toLowerCase() === "cat";

  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-rose-50 to-orange-50">
      {isdog ? (
        <Dog className="h-16 w-16 text-rose-200" />
      ) : isCat ? (
        <Cat className="h-16 w-16 text-rose-200" />
      ) : (
        <Heart className="h-16 w-16 text-rose-200 fill-rose-100" />
      )}
    </div>
  );
}

function StatusBadge({ status }: { status?: string }) {
  const colorMap: Record<string, string> = {
    Available: "bg-green-100 text-green-800 border-green-200",
    "In Foster": "bg-blue-100 text-blue-800 border-blue-200",
    Adopted: "bg-purple-100 text-purple-800 border-purple-200",
    Pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    Medical: "bg-red-100 text-red-800 border-red-200",
    Sanctuary: "bg-gray-100 text-gray-800 border-gray-200",
    Deceased: "bg-gray-100 text-gray-500 border-gray-200",
  };

  const colorClass =
    colorMap[status || ""] || "bg-gray-100 text-gray-800 border-gray-200";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        colorClass
      )}
    >
      {status || "Unknown"}
    </span>
  );
}

// Map of all possible compatibility keys to display labels and emoji
const COMPAT_MAP: Record<string, { label: string; icon: string }> = {
  dogs:          { label: "Dogs",              icon: "🐕" },
  cats:          { label: "Cats",              icon: "🐈" },
  kids:          { label: "Kids",              icon: "👶" },
  rabbits:       { label: "Rabbits",           icon: "🐇" },
  guinea_pigs:   { label: "Guinea Pigs",       icon: "🐹" },
  rats:          { label: "Rats",              icon: "🐀" },
  birds:         { label: "Birds",             icon: "🐦" },
  reptiles:      { label: "Reptiles",          icon: "🦎" },
  small_animals: { label: "Small Animals",     icon: "🐾" },
};

function CompatibilityIcons({ animal }: { animal: Animal }) {
  const goodWith    = animal.goodWith    ?? [];
  const notGoodWith = animal.notGoodWith ?? [];

  // Only render if at least one value is explicitly set
  if (goodWith.length === 0 && notGoodWith.length === 0) return null;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {goodWith.map((key) => {
        const meta = COMPAT_MAP[key] ?? { label: key, icon: "🐾" };
        return (
          <span
            key={`good-${key}`}
            className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-700"
            title={`Good with ${meta.label}`}
          >
            <span>{meta.icon}</span>
            <span>{meta.label}</span>
          </span>
        );
      })}
      {notGoodWith.map((key) => {
        const meta = COMPAT_MAP[key] ?? { label: key, icon: "🐾" };
        return (
          <span
            key={`no-${key}`}
            className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-red-50 text-red-600 line-through opacity-60"
            title={`Not good with ${meta.label}`}
          >
            <span>{meta.icon}</span>
            <span>{meta.label}</span>
          </span>
        );
      })}
    </div>
  );
}

export default function AnimalCard({ animal }: AnimalCardProps) {
  const speciesName = animal.animalSpecies?.name;
  const statusName = animal.animalStatus?.name;
  const age = formatAge(animal.animalAgeYears, animal.animalAgeMonths);

  // Build a short excerpt from the body
  const excerpt = animal.body?.summary || animal.body?.value?.replace(/<[^>]*>/g, "").slice(0, 120) + "…" || "";

  return (
    <Link
      href={`/adopt/${animal.id}`}
      className="group flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md hover:border-rose-100 transition-all duration-200"
    >
      {/* Image area */}
      <div className="relative h-52 overflow-hidden bg-gray-100">
        {animal.animalPhotos && animal.animalPhotos.length > 0 ? (
          <Image
            src={drupalImageUrl(animal.animalPhotos[0].url)}
            alt={animal.animalPhotos[0].alt || animal.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <AnimalPlaceholderImage species={speciesName} />
        )}
        {/* Status badge overlay */}
        <div className="absolute top-3 left-3">
          <StatusBadge status={statusName} />
        </div>
        {/* Hover heart */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm">
            <Heart className="h-4 w-4 text-rose-500" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        {/* Name and species */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-rose-600 transition-colors leading-tight">
            {animal.title}
          </h3>
          <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
            {speciesName && (
              <span className="flex items-center gap-1.5">
                <span className="mr-0.5">{speciesName === "Dog" ? "🐕" : speciesName === "Cat" ? "🐈" : "🐾"}</span>
                {speciesName}
              </span>
            )}
            {animal.animalBreed && (
              <>
                <span className="text-gray-300">·</span>
                <span>{animal.animalBreed}</span>
              </>
            )}
          </div>
        </div>

        {/* Details row */}
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-gray-600">
          {age !== "Age unknown" && (
            <span className="flex items-center gap-1">
              <span className="text-gray-400">Age:</span> {age}
            </span>
          )}
          {animal.animalSex && (
            <span className="flex items-center gap-1">
              <span className="text-gray-400">Sex:</span>{" "}
              {capitalize(animal.animalSex)}
            </span>
          )}
          {animal.animalSize && (
            <span className="flex items-center gap-1">
              <span className="text-gray-400">Size:</span>{" "}
              {capitalize(animal.animalSize)}
            </span>
          )}
        </div>

        {/* Excerpt */}
        {excerpt && (
          <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 flex-1">
            {excerpt}
          </p>
        )}

        {/* Compatibility */}
        <CompatibilityIcons animal={animal} />

        {/* CTA */}
        <div className="pt-1">
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-rose-600 group-hover:text-rose-700">
            Meet {animal.title}
            <span className="group-hover:translate-x-0.5 transition-transform">→</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
