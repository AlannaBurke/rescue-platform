"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { type NavItem, DEFAULT_NAV } from "@/lib/nav-utils";

// Re-export so existing imports still work
export type { NavItem };
export { parseNavItems } from "@/lib/nav-utils";

interface HeaderProps {
  /** Nav items parsed from Drupal site settings. Falls back to DEFAULT_NAV. */
  navItems?: NavItem[];
  orgName?: string;
  orgTagline?: string;
}

export default function Header({ navItems, orgName, orgTagline }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const navigation = navItems ?? DEFAULT_NAV;

  // Separate "Surrender" from main nav — it always goes in the CTA area
  const mainNav = navigation.filter((n) => n.href !== "/surrender");
  const hasSurrender = navigation.some((n) => n.href === "/surrender");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => { setMobileMenuOpen(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-[0_4px_24px_-4px_rgba(32,153,161,0.15)]"
          : "bg-white shadow-[0_2px_15px_-3px_rgba(32,153,161,0.12)]"
      )}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
        <div className="flex h-16 items-center justify-between">

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group no-underline"
            aria-label={`${orgName ?? "Rescue Platform"} — Home`}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2099a1] to-[#105f66] shadow-[0_2px_15px_-3px_rgba(32,153,161,0.4)] group-hover:scale-105 transition-transform duration-200">
              <Heart className="h-5 w-5 text-white fill-white" />
            </div>
            <div className="hidden sm:block">
              <div
                className="text-xl leading-none text-[#105f66]"
                style={{ fontFamily: "'Fredoka One', ui-rounded, system-ui, sans-serif" }}
              >
                {orgName ?? "Rescue Platform"}
              </div>
              <div className="text-xs text-[#8c8c7c] font-medium leading-none mt-0.5">
                {orgTagline ?? "Every little life matters"}
              </div>
            </div>
          </Link>

          {/* Desktop navigation */}
          <div className="hidden lg:flex lg:items-center lg:gap-0.5">
            {mainNav.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "px-3 py-2 text-sm font-semibold rounded-xl transition-all duration-200 no-underline",
                    isActive
                      ? "text-[#1a7f87] bg-[#e8f8f9]"
                      : "text-[#484838] hover:text-[#1a7f87] hover:bg-[#e8f8f9]"
                  )}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Desktop CTAs */}
          <div className="hidden lg:flex lg:items-center lg:gap-2">
            {hasSurrender && (
              <Link
                href="/surrender"
                className="text-sm font-semibold text-[#8c8c7c] hover:text-[#1a7f87] transition-colors no-underline px-3 py-2"
              >
                Surrender
              </Link>
            )}
            <Link
              href="/adopt/apply"
              className="inline-flex items-center gap-1.5 rounded-full bg-[#2099a1] px-4 py-2 text-sm font-bold text-white hover:bg-[#1a7f87] transition-all duration-200 shadow-[0_2px_15px_-3px_rgba(32,153,161,0.4)] hover:shadow-[0_8px_32px_-4px_rgba(32,153,161,0.35)] no-underline"
            >
              <Heart className="h-3.5 w-3.5 fill-white" />
              Adopt Now
            </Link>
            <Link
              href="/donate"
              className="inline-flex items-center gap-1.5 rounded-full border-2 border-[#e8a87c] px-4 py-2 text-sm font-bold text-[#b86440] hover:bg-[#fdf5ef] transition-all duration-200 no-underline"
            >
              <Heart className="h-3.5 w-3.5 fill-[#e8a87c] text-[#e8a87c]" />
              Donate
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="lg:hidden p-2 rounded-xl text-[#484838] hover:text-[#1a7f87] hover:bg-[#e8f8f9] transition-all duration-200"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        <div
          className={cn(
            "lg:hidden transition-all duration-300 ease-in-out overflow-hidden",
            mobileMenuOpen ? "max-h-[40rem] pb-4" : "max-h-0"
          )}
        >
          <div className="space-y-0.5 pt-2">
            {[...mainNav, ...(hasSurrender ? [{ name: "Surrender", href: "/surrender", enabled: true }] : [])].map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center rounded-2xl px-4 py-3 text-base font-semibold transition-all duration-200 no-underline",
                    isActive
                      ? "text-[#1a7f87] bg-[#e8f8f9]"
                      : "text-[#484838] hover:text-[#1a7f87] hover:bg-[#e8f8f9]"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              );
            })}
            <div className="pt-3 space-y-2 border-t border-[#e8e8e0] mt-2">
              <Link
                href="/adopt/apply"
                className="flex w-full items-center justify-center gap-2 rounded-full bg-[#2099a1] px-6 py-3.5 text-base font-bold text-white hover:bg-[#1a7f87] transition-all no-underline shadow-[0_2px_15px_-3px_rgba(32,153,161,0.4)]"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Heart className="h-4 w-4 fill-white" />
                Start Adoption Application
              </Link>
              <Link
                href="/donate"
                className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-[#e8a87c] px-6 py-3.5 text-base font-bold text-[#b86440] hover:bg-[#fdf5ef] transition-all no-underline"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Heart className="h-4 w-4 fill-[#e8a87c] text-[#e8a87c]" />
                Make a Donation
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
