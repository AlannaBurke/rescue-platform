import type { Metadata } from "next";
import { draftMode } from "next/headers";
import "./globals.css";
import Header from "@/components/layout/Header";
import { parseNavItems } from "@/lib/nav-utils";
import Footer from "@/components/layout/Footer";
import PreviewBanner from "@/components/ui/PreviewBanner";
import { getClient } from "@/lib/apollo-client";
import { gql } from "@apollo/client";

const GET_SITE_SETTINGS_LAYOUT = gql`
  query GetSiteSettingsLayout($id: ID!) {
    nodeSiteSetting(id: $id) {
      id
      title
      ... on NodeSiteSetting {
        orgTagline
        orgEmail
        orgPhone
        orgAddress
        orgEin
        socialInstagram
        socialFacebook
        socialTiktok
        socialTwitter
        socialYoutube
        socialThreads
        socialBluesky
        socialPinterest
        navItems
      }
    }
  }
`;

const SITE_SETTINGS_ID = process.env.SITE_SETTINGS_NODE_ID ?? "34";

export const metadata: Metadata = {
  title: {
    template: "%s | Rescue Platform",
    default: "Rescue Platform — Every Little Life Matters",
  },
  description:
    "Find your perfect companion. Browse adoptable animals, learn about fostering, and support our mission to give every small animal a second chance.",
  keywords: ["animal rescue", "adopt a pet", "foster animals", "rabbit rescue", "guinea pig rescue", "small animal rescue"],
  openGraph: {
    type: "website",
    siteName: "Rescue Platform",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch site settings server-side; gracefully degrade on error
  let siteSettings: Record<string, unknown> | null = null;
  try {
    const { data } = await getClient().query({
      query: GET_SITE_SETTINGS_LAYOUT,
      variables: { id: SITE_SETTINGS_ID },
    });
    siteSettings = data?.nodeSiteSetting ?? null;
  } catch {
    // Settings unavailable — fall back to defaults in Header/Footer
  }

  const navItems = siteSettings?.navItems
    ? parseNavItems(siteSettings.navItems as string[])
    : undefined;

  const orgName    = (siteSettings?.title as string | undefined) ?? undefined;
  const orgTagline = (siteSettings?.orgTagline as string | undefined) ?? undefined;

  // Check if Next.js Draft Mode is active (set by /api/preview)
  const { isEnabled: isPreview } = await draftMode();

  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col bg-stone-50">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary-600 focus:text-white focus:rounded-xl focus:shadow-lg"
        >
          Skip to main content
        </a>
        {/* Yellow banner shown only in preview/draft mode */}
        {isPreview && <PreviewBanner />}
        <Header navItems={navItems} orgName={orgName} orgTagline={orgTagline} />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer settings={siteSettings as Parameters<typeof Footer>[0]["settings"]} />
      </body>
    </html>
  );
}
