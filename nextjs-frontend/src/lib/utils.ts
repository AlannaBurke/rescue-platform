import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a Drupal datetime value for display.
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Get a human-readable age string from years and months.
 */
export function formatAge(years?: number, months?: number): string {
  if (!years && !months) return "Age unknown";
  const parts: string[] = [];
  if (years && years > 0) {
    parts.push(`${years} ${years === 1 ? "year" : "years"}`);
  }
  if (months && months > 0) {
    parts.push(`${months} ${months === 1 ? "month" : "months"}`);
  }
  return parts.join(", ");
}

/**
 * Capitalize the first letter of a string.
 */
export function capitalize(str: string): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).replace(/_/g, " ");
}

/**
 * Strip HTML tags from a string for use as a plain-text excerpt.
 */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

/**
 * Truncate a string to a given length, appending an ellipsis.
 */
export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length).trim() + "…";
}

/**
 * Rewrite a Drupal file URL to use the correct public base URL.
 * Drupal GraphQL returns URLs based on its internal base_url setting,
 * which may be localhost in development. This function replaces the
 * internal base with the public-facing Drupal URL.
 */
export function drupalImageUrl(url: string): string {
  if (!url) return url;
  // If the URL is already absolute and not localhost, return as-is
  if (url.startsWith('http') && !url.includes('localhost')) return url;
  // Replace localhost:8888 with the public Drupal URL from env
  const publicBase = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL || 'http://localhost:8888';
  return url.replace(/https?:\/\/localhost:\d+/, publicBase);
}
