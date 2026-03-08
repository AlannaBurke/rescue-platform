import Link from "next/link";
import { Heart, Mail, Phone, MapPin } from "lucide-react";

const footerLinks = {
  adopt: {
    title: "Adopt & Foster",
    links: [
      { name: "Available Animals", href: "/adopt" },
      { name: "Adoption Process", href: "/adopt/process" },
      { name: "Become a Foster", href: "/foster" },
      { name: "Foster FAQ", href: "/foster/faq" },
    ],
  },
  getInvolved: {
    title: "Get Involved",
    links: [
      { name: "Volunteer", href: "/volunteer" },
      { name: "Donate", href: "/donate" },
      { name: "Upcoming Events", href: "/events" },
      { name: "Wish List", href: "/wishlist" },
    ],
  },
  about: {
    title: "About Us",
    links: [
      { name: "Our Mission", href: "/about" },
      { name: "Our Team", href: "/about/team" },
      { name: "Blog", href: "/blog" },
      { name: "Contact", href: "/contact" },
    ],
  },
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 group mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-500">
                <Heart className="h-5 w-5 text-white fill-white" />
              </div>
              <span className="text-xl font-bold text-white">
                Rescue<span className="text-rose-400">Platform</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 mb-6 leading-relaxed">
              Connecting animals in need with loving forever homes. Every animal
              deserves a second chance.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-400">
                <Mail className="h-4 w-4 text-rose-400 flex-shrink-0" />
                <a
                  href="mailto:info@rescueplatform.org"
                  className="hover:text-white transition-colors"
                >
                  info@rescueplatform.org
                </a>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Phone className="h-4 w-4 text-rose-400 flex-shrink-0" />
                <span>(555) 123-4567</span>
              </div>
              <div className="flex items-start gap-2 text-gray-400">
                <MapPin className="h-4 w-4 text-rose-400 flex-shrink-0 mt-0.5" />
                <span>Serving our local community</span>
              </div>
            </div>
          </div>

          {/* Link columns */}
          {Object.values(footerLinks).map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-rose-400 transition-colors"
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
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            &copy; {currentYear} Rescue Platform. All rights reserved.
          </p>
          <p className="text-sm text-gray-500 flex items-center gap-1">
            Built with{" "}
            <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500 mx-0.5" />{" "}
            for animal rescues everywhere.
          </p>
        </div>
      </div>
    </footer>
  );
}
