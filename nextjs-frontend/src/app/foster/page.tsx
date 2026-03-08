import Link from 'next/link';
import { Heart, Home, CheckCircle, AlertCircle, ArrowRight, Clock, Star } from 'lucide-react';

export const metadata = {
  title: 'Become a Foster | Rescue Platform',
  description:
    'Open your home to an animal in need. Learn how to become a foster parent and make a life-saving difference.',
};

const whatToExpect = [
  {
    icon: '🏠',
    title: 'We Provide Everything',
    description:
      'Food, supplies, veterinary care, and medications are all covered by the rescue. You provide the love and a safe space.',
  },
  {
    icon: '📞',
    title: '24/7 Support',
    description:
      'Our foster coordinators are always available to answer questions, provide guidance, and support you through any challenges.',
  },
  {
    icon: '🩺',
    title: 'Vet Care Included',
    description:
      'All medical care is handled and paid for by the rescue. You never need to worry about unexpected vet bills.',
  },
  {
    icon: '⏱️',
    title: 'You Set the Terms',
    description:
      'Foster for a weekend, a few weeks, or longer. We work around your schedule and match you with animals that fit your lifestyle.',
  },
];

const fosterTypes = [
  {
    title: 'Short-Term Foster',
    duration: '1–2 weeks',
    description: 'Perfect for first-time fosters. Help an animal decompress from shelter stress.',
    color: 'bg-blue-50 border-blue-200',
    badge: 'bg-blue-100 text-blue-700',
  },
  {
    title: 'Medical Foster',
    duration: 'Varies',
    description: 'Care for animals recovering from surgery or illness. Training provided.',
    color: 'bg-purple-50 border-purple-200',
    badge: 'bg-purple-100 text-purple-700',
  },
  {
    title: 'Bottle Baby Foster',
    duration: '4–8 weeks',
    description: 'Raise neonatal kittens or puppies who need round-the-clock care.',
    color: 'bg-pink-50 border-pink-200',
    badge: 'bg-pink-100 text-pink-700',
  },
  {
    title: 'Long-Term Foster',
    duration: '1–3 months',
    description: 'Provide a stable home for animals who need extra time to find their forever family.',
    color: 'bg-green-50 border-green-200',
    badge: 'bg-green-100 text-green-700',
  },
];

const requirements = [
  'Be at least 18 years old',
  'Have a stable, safe living environment',
  'Get approval from all household members (including landlord if renting)',
  'Commit to keeping foster animals separate from resident pets initially',
  'Attend a brief virtual orientation (30 minutes)',
  'Agree to bring animals to scheduled vet appointments',
];

const faq = [
  {
    q: 'What if I fall in love and want to adopt?',
    a: "Foster-to-adopt is one of our favorite outcomes! You'll have first right of adoption for any animal you foster. Just let your coordinator know.",
  },
  {
    q: 'What if my resident pets don\'t get along with the foster?',
    a: "We carefully match fosters with animals suited to your household. If introductions don't go well, we'll work with you to find a solution or place the animal with another foster.",
  },
  {
    q: 'Can I foster if I rent my home?',
    a: "Yes, as long as your landlord approves. We can provide a letter explaining our program if needed.",
  },
  {
    q: 'How quickly will I be matched with an animal?',
    a: "After your application is approved (usually within 48 hours), we'll reach out when we have an animal that matches your preferences and availability.",
  },
];

export default function FosterPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-16 h-16 bg-rose-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Heart className="w-8 h-8 text-rose-500" />
          </div>
          <h1 className="text-5xl font-extrabold text-gray-900 mb-5 leading-tight">
            Save a Life.<br />
            <span className="text-rose-500">Become a Foster.</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            Fostering is the single most impactful thing you can do for an animal in need.
            You provide the home — we handle everything else.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#apply"
              className="bg-rose-500 text-white font-bold px-8 py-4 rounded-full hover:bg-rose-600 transition-colors text-lg shadow-lg shadow-rose-200"
            >
              Apply to Foster
            </a>
            <a
              href="#learn-more"
              className="border-2 border-rose-200 text-rose-600 font-bold px-8 py-4 rounded-full hover:bg-rose-50 transition-colors text-lg"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-rose-500 py-6 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-4 text-center text-white">
          <div>
            <p className="text-3xl font-extrabold">$0</p>
            <p className="text-rose-100 text-sm">Out of pocket costs</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold">48hrs</p>
            <p className="text-rose-100 text-sm">Application turnaround</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold">100%</p>
            <p className="text-rose-100 text-sm">Vet care covered</p>
          </div>
        </div>
      </section>

      {/* What to expect */}
      <section id="learn-more" className="py-16 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">What to Expect</h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              We make fostering as easy and rewarding as possible. Here&apos;s what you can count on.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {whatToExpect.map((item) => (
              <div key={item.title} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Foster types */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Types of Fostering</h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              There&apos;s a fostering opportunity for every schedule and comfort level.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {fosterTypes.map((type) => (
              <div key={type.title} className={`rounded-2xl p-6 border-2 ${type.color}`}>
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-bold text-gray-900">{type.title}</h3>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${type.badge}`}>
                    {type.duration}
                  </span>
                </div>
                <p className="text-gray-600 leading-relaxed">{type.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Requirements</h2>
            <p className="text-gray-600">Simple requirements to ensure the best outcomes for our animals.</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <ul className="space-y-4">
              {requirements.map((req) => (
                <li key={req} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{req}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            {faq.map((item) => (
              <div key={item.q} className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-2 flex items-start gap-2">
                  <Star className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  {item.q}
                </h3>
                <p className="text-gray-600 leading-relaxed pl-7">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application CTA */}
      <section id="apply" className="py-20 px-4 bg-gradient-to-br from-rose-500 to-pink-600 text-white">
        <div className="max-w-2xl mx-auto text-center">
          <Home className="w-12 h-12 mx-auto mb-5 text-rose-200" />
          <h2 className="text-4xl font-extrabold mb-4">Ready to Open Your Home?</h2>
          <p className="text-rose-100 text-lg mb-8 leading-relaxed">
            Fill out our short application and we&apos;ll be in touch within 48 hours to get you started.
            An animal is waiting for exactly what you have to offer.
          </p>
          <div className="bg-white rounded-2xl p-8 text-left shadow-xl">
            <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Foster Application</h3>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">First Name *</label>
                  <input type="text" required className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-300" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Last Name *</label>
                  <input type="text" required className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-300" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address *</label>
                <input type="email" required className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-300" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
                <input type="tel" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-300" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">What type of animal would you like to foster? *</label>
                <select required className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-300 bg-white">
                  <option value="">Select an option</option>
                  <option>Dogs</option>
                  <option>Cats</option>
                  <option>Kittens / Bottle Babies</option>
                  <option>Puppies</option>
                  <option>Any / No Preference</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Tell us about your home and household *</label>
                <textarea rows={3} required className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-300 resize-none" placeholder="Do you have other pets? Children? Do you rent or own? Any relevant details..." />
              </div>
              <div className="flex items-start gap-3">
                <input type="checkbox" id="agree" required className="mt-1" />
                <label htmlFor="agree" className="text-sm text-gray-600">
                  I understand that fostering requires a commitment to the animal&apos;s care and that I will work with the rescue coordinator throughout the placement.
                </label>
              </div>
              <button
                type="submit"
                className="w-full bg-rose-500 text-white font-bold py-3 rounded-xl hover:bg-rose-600 transition-colors flex items-center justify-center gap-2"
              >
                Submit Application
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
