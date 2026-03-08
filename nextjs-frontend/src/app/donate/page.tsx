import { Heart, DollarSign, Gift, ArrowRight, CheckCircle, Star } from 'lucide-react';

export const metadata = {
  title: 'Donate | Rescue Platform',
  description:
    'Your donation saves lives. Every dollar goes directly to the care of animals in our rescue.',
};

const impactItems = [
  { amount: '$10', impact: 'Provides a week of food for one cat in foster care' },
  { amount: '$25', impact: 'Covers vaccinations for one animal' },
  { amount: '$50', impact: 'Pays for a spay or neuter surgery' },
  { amount: '$100', impact: 'Covers emergency vet care for an injured animal' },
  { amount: '$250', impact: 'Sponsors a full month of care for a medical foster' },
  { amount: '$500', impact: 'Funds an entire litter of bottle babies through weaning' },
];

const donationTypes = [
  {
    icon: DollarSign,
    title: 'One-Time Gift',
    description: 'Make an immediate impact with a single donation of any amount.',
    color: 'bg-green-100 text-green-600',
    cta: 'Donate Now',
  },
  {
    icon: Heart,
    title: 'Monthly Giving',
    description: 'Become a sustaining donor and provide reliable support all year long.',
    color: 'bg-rose-100 text-rose-600',
    cta: 'Give Monthly',
    badge: 'Most Impactful',
  },
  {
    icon: Gift,
    title: 'In-Kind Donation',
    description: 'Donate food, supplies, or other items from our Amazon Wishlist.',
    color: 'bg-purple-100 text-purple-600',
    cta: 'View Wishlist',
  },
];

const suggestedAmounts = [10, 25, 50, 100, 250, 500];

export default function DonatePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Heart className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-5xl font-extrabold text-gray-900 mb-5 leading-tight">
            Every Dollar<br />
            <span className="text-green-600">Saves a Life.</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            We are a 100% volunteer-run, donation-funded rescue. Every dollar you give goes
            directly to the care of animals — food, medical care, and the love they deserve.
          </p>
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-5 py-2.5 rounded-full text-sm font-semibold">
            <CheckCircle className="w-4 h-4" />
            We are a registered 501(c)(3) nonprofit — donations are tax deductible
          </div>
        </div>
      </section>

      {/* Donation form */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-xl mx-auto">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Make a Donation</h2>

            {/* Frequency toggle */}
            <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
              <button className="flex-1 bg-white text-gray-900 font-semibold py-2 rounded-lg text-sm shadow-sm transition-all">
                One-Time
              </button>
              <button className="flex-1 text-gray-500 font-semibold py-2 rounded-lg text-sm hover:text-gray-700 transition-all">
                Monthly
              </button>
            </div>

            {/* Suggested amounts */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              {suggestedAmounts.map((amount) => (
                <button
                  key={amount}
                  className={`py-3 rounded-xl font-bold text-sm border-2 transition-all ${
                    amount === 50
                      ? 'bg-green-600 text-white border-green-600'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-green-300 hover:text-green-600'
                  }`}
                >
                  ${amount}
                </button>
              ))}
            </div>

            {/* Custom amount */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Or enter a custom amount
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">$</span>
                <input
                  type="number"
                  min="1"
                  placeholder="Other amount"
                  className="w-full border border-gray-200 rounded-xl pl-8 pr-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-300 transition-shadow"
                />
              </div>
            </div>

            {/* Dedicate donation */}
            <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 cursor-pointer mb-2">
                <input type="checkbox" className="rounded" />
                Dedicate this donation in honor or memory of someone
              </label>
              <input
                type="text"
                placeholder="Honoree name (optional)"
                className="w-full border border-gray-200 rounded-xl px-4 py-2 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-green-300 bg-white"
              />
            </div>

            <button
              type="button"
              className="w-full bg-green-600 text-white font-bold py-4 rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-green-200 text-lg"
            >
              Donate $50
              <ArrowRight className="w-5 h-5" />
            </button>

            <p className="text-center text-xs text-gray-400 mt-4">
              Secure payment processing. Your information is never shared.
            </p>
          </div>
        </div>
      </section>

      {/* Impact */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Your Impact</h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              See exactly how your donation makes a difference for animals in our care.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {impactItems.map((item) => (
              <div key={item.amount} className="bg-gray-50 rounded-2xl p-6 border border-gray-100 flex items-start gap-4">
                <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-green-700 font-extrabold text-lg">{item.amount}</span>
                </div>
                <p className="text-gray-700 leading-relaxed text-sm">{item.impact}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Other ways to give */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Other Ways to Give</h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Not ready to donate online? There are many ways to support our mission.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {donationTypes.map((type) => {
              const Icon = type.icon;
              return (
                <div key={type.title} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm relative">
                  {type.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-rose-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        {type.badge}
                      </span>
                    </div>
                  )}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${type.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{type.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-5">{type.description}</p>
                  <button className="text-sm font-semibold text-green-600 hover:text-green-700 flex items-center gap-1 transition-colors">
                    {type.cta}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Transparency */}
      <section className="py-16 px-4 bg-green-600 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Our Commitment to Transparency</h2>
          <p className="text-green-100 text-lg leading-relaxed mb-8">
            We believe you deserve to know exactly how your donation is used. We publish
            annual financial reports and maintain a 4-star Charity Navigator rating.
            100% of donations go directly to animal care — our team is entirely volunteer.
          </p>
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-4xl font-extrabold">100%</p>
              <p className="text-green-100 text-sm mt-1">Goes to animal care</p>
            </div>
            <div>
              <p className="text-4xl font-extrabold">$0</p>
              <p className="text-green-100 text-sm mt-1">Administrative salaries</p>
            </div>
            <div>
              <p className="text-4xl font-extrabold">501c3</p>
              <p className="text-green-100 text-sm mt-1">Tax-exempt nonprofit</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
