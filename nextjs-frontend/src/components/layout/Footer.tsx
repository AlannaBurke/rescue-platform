import Link from "next/link";
import { Heart, Mail, Phone, MapPin, Instagram, Facebook, Youtube, Twitter } from "lucide-react";

// ── Social platform config ────────────────────────────────────────────────────
interface SocialLink {
  platform: string;
  handle: string;
  url: string;
  icon: React.ReactNode;
  label: string;
}

function buildSocialLinks(settings: SiteSettings): SocialLink[] {
  const links: SocialLink[] = [];

  if (settings.socialInstagram) {
    const handle = settings.socialInstagram.replace(/^@/, "");
    links.push({
      platform: "instagram",
      handle: `@${handle}`,
      url: `https://instagram.com/${handle}`,
      icon: <Instagram className="h-4 w-4" />,
      label: "Follow us on Instagram",
    });
  }
  if (settings.socialFacebook) {
    const handle = settings.socialFacebook.replace(/^@/, "");
    links.push({
      platform: "facebook",
      handle: handle,
      url: handle.startsWith("http") ? handle : `https://facebook.com/${handle}`,
      icon: <Facebook className="h-4 w-4" />,
      label: "Follow us on Facebook",
    });
  }
  if (settings.socialTiktok) {
    const handle = settings.socialTiktok.replace(/^@/, "");
    links.push({
      platform: "tiktok",
      handle: `@${handle}`,
      url: `https://tiktok.com/@${handle}`,
      icon: (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z" />
        </svg>
      ),
      label: "Follow us on TikTok",
    });
  }
  if (settings.socialTwitter) {
    const handle = settings.socialTwitter.replace(/^@/, "");
    links.push({
      platform: "twitter",
      handle: `@${handle}`,
      url: `https://twitter.com/${handle}`,
      icon: <Twitter className="h-4 w-4" />,
      label: "Follow us on X / Twitter",
    });
  }
  if (settings.socialYoutube) {
    const handle = settings.socialYoutube.replace(/^@/, "");
    links.push({
      platform: "youtube",
      handle: handle,
      url: handle.startsWith("http") ? handle : `https://youtube.com/@${handle}`,
      icon: <Youtube className="h-4 w-4" />,
      label: "Watch us on YouTube",
    });
  }
  if (settings.socialThreads) {
    const handle = settings.socialThreads.replace(/^@/, "");
    links.push({
      platform: "threads",
      handle: `@${handle}`,
      url: `https://threads.net/@${handle}`,
      icon: (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.5 12.068c0-3.516.85-6.37 2.495-8.423C5.845 1.341 8.598.16 12.179.136h.014c2.64.018 4.905.73 6.73 2.117 1.714 1.302 2.88 3.13 3.464 5.432l-2.03.506c-.47-1.875-1.37-3.356-2.677-4.4-1.388-1.055-3.192-1.595-5.365-1.61-2.924.02-5.145.936-6.6 2.72-1.37 1.685-2.065 4.129-2.065 7.267 0 3.138.695 5.582 2.065 7.267 1.455 1.784 3.676 2.7 6.6 2.72 2.173-.015 3.977-.555 5.365-1.61 1.307-1.044 2.207-2.525 2.677-4.4l2.03.506c-.584 2.302-1.75 4.13-3.464 5.432-1.825 1.387-4.09 2.099-6.73 2.117z" />
        </svg>
      ),
      label: "Follow us on Threads",
    });
  }
  if (settings.socialBluesky) {
    const handle = settings.socialBluesky.replace(/^@/, "");
    links.push({
      platform: "bluesky",
      handle: `@${handle}`,
      url: `https://bsky.app/profile/${handle}`,
      icon: (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.815 2.736 3.713 3.66 6.383 3.364.136-.02.275-.039.415-.056-.138.022-.276.04-.415.056-3.912.58-7.387 2.005-2.83 7.078 5.013 5.19 6.87-1.113 7.823-4.308.953 3.195 2.05 9.271 7.733 4.308 4.267-4.308 1.172-6.498-2.74-7.078a8.741 8.741 0 01-.415-.056c.14.017.279.036.415.056 2.67.297 5.568-.628 6.383-3.364.246-.828.624-5.79.624-6.478 0-.69-.139-1.861-.902-2.204-.659-.299-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8z" />
        </svg>
      ),
      label: "Follow us on Bluesky",
    });
  }
  if (settings.socialPinterest) {
    const handle = settings.socialPinterest.replace(/^@/, "");
    links.push({
      platform: "pinterest",
      handle: handle,
      url: `https://pinterest.com/${handle}`,
      icon: (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
        </svg>
      ),
      label: "Follow us on Pinterest",
    });
  }
  return links;
}

// ── Site settings type (subset used by footer) ────────────────────────────────
export interface SiteSettings {
  orgName?: string;
  orgTagline?: string;
  orgEmail?: string;
  orgPhone?: string;
  orgAddress?: string;
  orgEin?: string;
  socialInstagram?: string;
  socialFacebook?: string;
  socialTiktok?: string;
  socialTwitter?: string;
  socialYoutube?: string;
  socialThreads?: string;
  socialBluesky?: string;
  socialPinterest?: string;
}

const footerLinks = {
  adopt: {
    title: "Adopt & Foster",
    links: [
      { name: "Available Animals", href: "/adopt" },
      { name: "Apply to Adopt",    href: "/adopt/apply" },
      { name: "Become a Foster",   href: "/foster" },
      { name: "Sanctuary Animals", href: "/sanctuary" },
      { name: "Rainbow Bridge",    href: "/rainbow-bridge" },
    ],
  },
  getInvolved: {
    title: "Get Involved",
    links: [
      { name: "Volunteer",         href: "/volunteer" },
      { name: "Support & Giving",  href: "/support" },
      { name: "Upcoming Events",   href: "/events" },
      { name: "Surrender an Animal", href: "/surrender" },
    ],
  },
  about: {
    title: "About",
    links: [
      { name: "About Us",    href: "/about" },
      { name: "Resources",   href: "/resources" },
      { name: "Blog",        href: "/blog" },
      { name: "Vets & Care", href: "/vets" },
      { name: "Contact Us",  href: "/contact" },
    ],
  },
};

interface FooterProps {
  settings?: SiteSettings;
}

export default function Footer({ settings }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const socialLinks = settings ? buildSocialLinks(settings) : [];
  const orgName    = settings?.orgName    ?? "Rescue Platform";
  const orgTagline = settings?.orgTagline ?? "Every little life matters";
  const orgEmail   = settings?.orgEmail   ?? "info@rescueplatform.org";
  const orgPhone   = settings?.orgPhone   ?? "(555) 123-4567";
  const orgAddress = settings?.orgAddress ?? "Serving our local community";

  return (
    <footer>
      {/* Wave divider */}
      <div className="overflow-hidden leading-none bg-stone-50">
        <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" className="w-full block">
          <path fill="#0a3d42" d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" />
        </svg>
      </div>

      <div className="bg-[#0a3d42] text-[#c5eef1]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">

            {/* Brand column */}
            <div className="lg:col-span-2">
              <Link href="/" className="flex items-center gap-2.5 group mb-5 no-underline">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#2099a1] shadow-[0_2px_15px_-3px_rgba(32,153,161,0.5)] group-hover:scale-105 transition-transform duration-200">
                  <Heart className="h-5 w-5 text-white fill-white" />
                </div>
                <div>
                  <div
                    className="text-xl leading-none text-white"
                    style={{ fontFamily: "'Fredoka One', ui-rounded, system-ui, sans-serif" }}
                  >
                    {orgName}
                  </div>
                  <div className="text-xs text-[#8ddde3] font-medium leading-none mt-0.5">
                    {orgTagline}
                  </div>
                </div>
              </Link>

              <p className="text-sm text-[#8ddde3] mb-6 leading-relaxed max-w-xs">
                An open-source platform connecting small animals in need with
                loving forever homes. Built with love for rescues everywhere.
              </p>

              <div className="space-y-2.5 text-sm mb-6">
                {orgEmail && (
                  <div className="flex items-center gap-2 text-[#8ddde3]">
                    <Mail className="h-4 w-4 text-[#4ec8d1] flex-shrink-0" />
                    <a href={`mailto:${orgEmail}`} className="hover:text-white transition-colors no-underline">
                      {orgEmail}
                    </a>
                  </div>
                )}
                {orgPhone && (
                  <div className="flex items-center gap-2 text-[#8ddde3]">
                    <Phone className="h-4 w-4 text-[#4ec8d1] flex-shrink-0" />
                    <a href={`tel:${orgPhone.replace(/\D/g, "")}`} className="hover:text-white transition-colors no-underline">
                      {orgPhone}
                    </a>
                  </div>
                )}
                {orgAddress && (
                  <div className="flex items-start gap-2 text-[#8ddde3]">
                    <MapPin className="h-4 w-4 text-[#4ec8d1] flex-shrink-0 mt-0.5" />
                    <span>{orgAddress}</span>
                  </div>
                )}
              </div>

              {/* Dynamic social links */}
              {socialLinks.length > 0 && (
                <div className="flex items-center flex-wrap gap-2">
                  {socialLinks.map((social) => (
                    <a
                      key={social.platform}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      title={social.handle}
                      className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-[#8ddde3] hover:bg-[#2099a1] hover:text-white transition-all duration-200 no-underline"
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Link columns */}
            {Object.values(footerLinks).map((section) => (
              <div key={section.title}>
                <h3
                  className="text-sm font-bold text-white uppercase tracking-wider mb-4"
                  style={{ fontFamily: "'Fredoka One', ui-rounded, system-ui, sans-serif", letterSpacing: "0.08em" }}
                >
                  {section.title}
                </h3>
                <ul className="space-y-2.5">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-sm text-[#8ddde3] hover:text-white transition-colors no-underline"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-[#4ec8d1]">
              &copy; {currentYear} {orgName}. Open-source under GPL v2.
            </p>
            <p className="text-sm text-[#4ec8d1] flex items-center gap-1">
              Built with{" "}
              <Heart className="h-3.5 w-3.5 text-[#f4a5a5] fill-[#f4a5a5] mx-0.5" />{" "}
              for animal rescues everywhere.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
