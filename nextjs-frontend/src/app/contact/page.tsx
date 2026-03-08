import { Mail, Phone, MapPin, Clock, ArrowRight, MessageSquare } from 'lucide-react';

export const metadata = {
  title: 'Contact Us | Rescue Platform',
  description: 'Get in touch with our rescue team. We\'re here to answer your questions about adoption, fostering, volunteering, and more.',
};

const contactReasons = [
  { value: 'adoption', label: 'Adoption Inquiry' },
  { value: 'foster', label: 'Foster Application / Question' },
  { value: 'volunteer', label: 'Volunteer Inquiry' },
  { value: 'surrender', label: 'Animal Surrender / Intake' },
  { value: 'donation', label: 'Donation / Sponsorship' },
  { value: 'media', label: 'Media / Press Inquiry' },
  { value: 'general', label: 'General Question' },
  { value: 'other', label: 'Other' },
];

const contactInfo = [
  {
    icon: Mail,
    label: 'Email',
    value: 'info@rescueplatform.org',
    href: 'mailto:info@rescueplatform.org',
    color: 'bg-blue-100 text-blue-600',
  },
  {
    icon: Phone,
    label: 'Phone',
    value: '(555) 123-4567',
    href: 'tel:+15551234567',
    color: 'bg-green-100 text-green-600',
  },
  {
    icon: Clock,
    label: 'Response Time',
    value: 'Within 24–48 hours',
    href: null,
    color: 'bg-amber-100 text-amber-600',
  },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-50 to-blue-50 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <MessageSquare className="w-7 h-7 text-indigo-600" />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Get in Touch</h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            Have a question about adoption, fostering, or volunteering? We&apos;d love to hear from you.
            Our team typically responds within 24–48 hours.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact info sidebar */}
          <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-bold text-gray-900 mb-5 text-lg">Contact Information</h2>
              <div className="space-y-5">
                {contactInfo.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${item.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{item.label}</p>
                        {item.href ? (
                          <a href={item.href} className="text-gray-900 font-semibold hover:text-indigo-600 transition-colors">
                            {item.value}
                          </a>
                        ) : (
                          <p className="text-gray-900 font-semibold">{item.value}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-bold text-gray-900 mb-4 text-lg">Quick Links</h2>
              <div className="space-y-2">
                {[
                  { label: 'View Adoptable Animals', href: '/adopt' },
                  { label: 'Become a Foster', href: '/foster' },
                  { label: 'Volunteer With Us', href: '/volunteer' },
                  { label: 'Make a Donation', href: '/donate' },
                  { label: 'Upcoming Events', href: '/events' },
                ].map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="flex items-center justify-between py-2 text-sm text-gray-700 hover:text-indigo-600 transition-colors group"
                  >
                    <span>{link.label}</span>
                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-indigo-400 transition-colors" />
                  </a>
                ))}
              </div>
            </div>

            <div className="bg-indigo-50 rounded-2xl border border-indigo-100 p-6">
              <h3 className="font-bold text-indigo-900 mb-2">Emergency?</h3>
              <p className="text-sm text-indigo-700 leading-relaxed">
                If you&apos;ve found an injured or stray animal, please contact your local animal control
                or emergency vet immediately. For urgent rescue situations, call us directly.
              </p>
            </div>
          </div>

          {/* Contact form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
              <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">First Name *</label>
                    <input
                      type="text"
                      required
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-shadow"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Last Name *</label>
                    <input
                      type="text"
                      required
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-shadow"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address *</label>
                  <input
                    type="email"
                    required
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-shadow"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone Number</label>
                  <input
                    type="tel"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-shadow"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Reason for Contact *</label>
                  <select
                    required
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white transition-shadow"
                  >
                    <option value="">Select a reason</option>
                    {contactReasons.map((r) => (
                      <option key={r.value} value={r.value}>{r.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Subject *</label>
                  <input
                    type="text"
                    required
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-shadow"
                    placeholder="Brief description of your inquiry"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Message *</label>
                  <textarea
                    rows={5}
                    required
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none transition-shadow"
                    placeholder="Please provide as much detail as possible so we can help you quickly..."
                  />
                </div>

                <div className="flex items-start gap-3">
                  <input type="checkbox" id="newsletter" className="mt-1 rounded" />
                  <label htmlFor="newsletter" className="text-sm text-gray-600">
                    Sign me up for the newsletter to receive updates about animals, events, and ways to help.
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-200"
                >
                  Send Message
                  <ArrowRight className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
