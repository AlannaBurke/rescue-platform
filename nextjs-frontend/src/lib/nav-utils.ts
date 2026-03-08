// ── Nav item type ─────────────────────────────────────────────────────────────
export interface NavItem {
  name: string;
  href: string;
  enabled: boolean;
}

/**
 * Parse nav items from Drupal pipe-delimited format: "Label|/path|1"
 * This is a pure utility function — safe to use in both server and client components.
 */
export function parseNavItems(raw: string[]): NavItem[] {
  return raw
    .map((line) => {
      const parts = line.split("|");
      if (parts.length < 2) return null;
      return {
        name: parts[0].trim(),
        href: parts[1].trim(),
        enabled: parts[2]?.trim() !== "0",
      };
    })
    .filter((item): item is NavItem => item !== null && item.enabled);
}

/** Default nav used when site settings aren't available */
export const DEFAULT_NAV: NavItem[] = [
  { name: "Adopt",          href: "/adopt",          enabled: true },
  { name: "Sanctuary",      href: "/sanctuary",       enabled: true },
  { name: "Rainbow Bridge", href: "/rainbow-bridge",  enabled: true },
  { name: "Foster",         href: "/foster",          enabled: true },
  { name: "Volunteer",      href: "/volunteer",       enabled: true },
  { name: "Events",         href: "/events",          enabled: true },
  { name: "Blog",           href: "/blog",            enabled: true },
  { name: "Resources",      href: "/resources",       enabled: true },
  { name: "About",          href: "/about",           enabled: true },
  { name: "Contact",        href: "/contact",         enabled: true },
];
