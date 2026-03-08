"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

const SPECIES_OPTIONS = ["All", "Dog", "Cat", "Rabbit", "Bird", "Other"];
const SEX_OPTIONS = ["Any", "Male", "Female"];
const SIZE_OPTIONS = ["Any", "Extra Small", "Small", "Medium", "Large", "Extra Large"];
const AGE_OPTIONS = ["Any", "Puppy/Kitten", "Young", "Adult", "Senior"];

interface FilterButtonProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

function FilterButton({ label, active, onClick }: FilterButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-3 py-1.5 rounded-full text-sm font-medium transition-all",
        active
          ? "bg-rose-500 text-white shadow-sm"
          : "bg-white text-gray-600 border border-gray-200 hover:border-rose-300 hover:text-rose-600"
      )}
    >
      {label}
    </button>
  );
}

export default function AnimalFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const species = searchParams.get("species") || "All";
  const sex = searchParams.get("sex") || "Any";
  const size = searchParams.get("size") || "Any";

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === "All" || value === "Any") {
        params.delete(key);
      } else {
        params.set(key, value.toLowerCase().replace(" ", "_"));
      }
      router.push(`/adopt?${params.toString()}`);
    },
    [router, searchParams]
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
        <SlidersHorizontal className="h-4 w-4 text-rose-500" />
        Filter Animals
      </div>

      {/* Species */}
      <div>
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
          Species
        </p>
        <div className="flex flex-wrap gap-2">
          {SPECIES_OPTIONS.map((option) => (
            <FilterButton
              key={option}
              label={option}
              active={species === option || (option === "All" && species === "All")}
              onClick={() => updateFilter("species", option)}
            />
          ))}
        </div>
      </div>

      {/* Sex */}
      <div>
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
          Sex
        </p>
        <div className="flex flex-wrap gap-2">
          {SEX_OPTIONS.map((option) => (
            <FilterButton
              key={option}
              label={option}
              active={
                sex === option.toLowerCase() ||
                (option === "Any" && sex === "Any")
              }
              onClick={() => updateFilter("sex", option)}
            />
          ))}
        </div>
      </div>

      {/* Size */}
      <div>
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
          Size
        </p>
        <div className="flex flex-wrap gap-2">
          {SIZE_OPTIONS.map((option) => (
            <FilterButton
              key={option}
              label={option}
              active={
                size === option.toLowerCase().replace(" ", "_") ||
                (option === "Any" && size === "Any")
              }
              onClick={() => updateFilter("size", option)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
