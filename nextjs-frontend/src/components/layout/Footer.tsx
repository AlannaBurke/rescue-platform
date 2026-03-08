import Link from "next/link";
import { Heart, Mail, Phone, MapPin, Instagram, Facebook } from "lucide-react";

const footerLinks = {
  adopt: {
    title: "Adopt & Foster",
    links: [
      { name: "Available Animals", href: "/adopt" },
      { name: "Apply to Adopt", href: "/adopt/apply" },
      { name: "Become a Foster", href: "/foster" },
      { name: "Sanctuary Animals", href: "/sanctuary" },
      { name: "Rainbow Bridge", href: "/rainbow-bridge" },
    ],
  },
  getInvolved: {
    title: "Get Involved",
    links: [
      { name: "Volunteer", href: "/volunteer" },
      { name: "Donate", href: "/donate" },
      { name: "Upcoming Events", href: "/events" },
      { name: "Surrender an Animal", href: "/surrender" },
    ],
  },
  about: {
    title: "About",
    links: [
      { name: "Our Mission", href: "/about" },
      { name: "Blog", href: "/blog" },
      { name: "Contact Us", href: "/contact" },
    ],
  },
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

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
                    Rescue Platform
                  </div>
                  <div className="text-xs text-[#8ddde3] font-medium leading-none mt-0.5">
                    Every little life matters
                  </div>
                </div>
              </Link>

              <p className="text-sm text-[#8ddde3] mb-6 leading-relaxed max-w-xs">
                An open-source platform connecting small animals in need with
                loving forever homes. Built with love for rescues everywhere.
              </p>

              <div className="space-y-2.5 text-sm mb-6">
                <div className="flex items-center gap-2 text-[#8ddde3]">
                  <Mail className="h-4 w-4 text-[#4ec8d1] flex-shrink-0" />
                  <a href="mailto:info@rescueplatform.org" className="hover:text-white transition-colors no-underline">
                    info@rescueplatform.org
                  </a>
                </div>
                <div className="flex items-center gap-2 text-[#8ddde3]">
                  <Phone className="h-4 w-4 text-[#4ec8d1] flex-shrink-0" />
                  <span>(555) 123-4567</span>
                </div>
                <div className="flex items-start gap-2 text-[#8ddde3]">
                  <MapPin className="h-4 w-4 text-[#4ec8d1] flex-shrink-0 mt-0.5" />
                  <span>Serving our local community</span>
                </div>
              </div>

              {/* Social links */}
              <div className="flex items-center gap-3">
                <a
                  href="#"
                  aria-label="Follow us on Instagram"
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-[#8ddde3] hover:bg-[#2099a1] hover:text-white transition-all duration-200 no-underline"
                >
                  <Instagram className="h-4 w-4" />
                </a>
                <a
                  href="#"
                  aria-label="Follow us on Facebook"
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-[#8ddde3] hover:bg-[#2099a1] hover:text-white transition-all duration-200 no-underline"
                >
                  <Facebook className="h-4 w-4" />
                </a>
              </div>
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
              &copy; {currentYear} Rescue Platform. Open-source under GPL v2.
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
