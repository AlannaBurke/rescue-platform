"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Adopt", href: "/adopt" },
  { name: "Foster", href: "/foster" },
  { name: "Volunteer", href: "/volunteer" },
  { name: "Events", href: "/events" },
  { name: "Blog", href: "/blog" },
  { name: "Donate", href: "/donate" },
  { name: "About", href: "/about" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-500 group-hover:bg-rose-600 transition-colors">
                <Heart className="h-5 w-5 text-white fill-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 tracking-tight">
                Rescue<span className="text-rose-500">Platform</span>
              </span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex md:items-center md:gap-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
              >
                {item.name}
              </Link>
            ))}
            <Link
              href="/adopt"
              className="ml-3 inline-flex items-center gap-1.5 rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-rose-600 transition-colors"
            >
              <Heart className="h-4 w-4 fill-white" />
              Adopt Now
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
            >
              <span className="sr-only">
                {mobileMenuOpen ? "Close menu" : "Open menu"}
              </span>
              {mobileMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={cn(
            "md:hidden transition-all duration-200 ease-in-out overflow-hidden",
            mobileMenuOpen ? "max-h-96 pb-4" : "max-h-0"
          )}
        >
          <div className="space-y-1 pt-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-rose-50 hover:text-rose-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-2">
              <Link
                href="/adopt"
                className="flex w-full items-center justify-center gap-1.5 rounded-full bg-rose-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Heart className="h-4 w-4 fill-white" />
                Adopt Now
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
