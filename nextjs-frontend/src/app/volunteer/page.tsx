import Link from 'next/link';
import { Users, ArrowRight, CheckCircle, Star, Camera, Truck, Heart, Laptop, Calendar, Megaphone } from 'lucide-react';

export const metadata = {
  title: 'Volunteer | Rescue Platform',
  description:
    'Join our volunteer team and help animals find their forever homes. Every hour you give makes a difference.',
};

const opportunities = [
  {
    icon: Truck,
    title: 'Animal Transport',
    description: 'Drive animals to vet appointments, adoption events, or between fosters.',
    commitment: '2–4 hrs/month',
    color: 'text-blue-600 bg-blue-100',
  },
  {
    icon: Camera,
    title: 'Photography',
    description: 'Take beautiful photos of our animals to help them get adopted faster.',
    commitment: 'Flexible',
    color: 'text-purple-600 bg-purple-100',
  },
  {
    icon: Megaphone,
    title: 'Social Media',
    description: 'Help manage our social media presence and share animals in need.',
    commitment: '2–3 hrs/week',
    color: 'text-pink-600 bg-pink-100',
  },
  {
    icon: Calendar,
    title: 'Event Volunteer',
    description: 'Help set up and run adoption events, fundraisers, and community outreach.',
    commitment: 'Per event',
    color: 'text-amber-600 bg-amber-100',
  },
  {
    icon: Laptop,
    title: 'Admin & Tech',
    description: 'Help with data entry, website updates, grant writing, or IT support.',
    commitment: 'Flexible',
    color: 'text-teal-600 bg-teal-100',
  },
  {
    icon: Heart,
    title: 'Fundraising',
    description: 'Help plan and execute fundraising campaigns to support our animals.',
    commitment: 'Flexible',
    color: 'text-rose-600 bg-rose-100',
  },
];

const steps = [
  { step: '01', title: 'Fill Out the Form', description: 'Tell us about yourself and how you\'d like to help.' },
  { step: '02', title: 'Quick Orientation', description: 'Join a 30-minute virtual orientation to meet the team.' },
  { step: '03', title: 'Get Matched', description: 'We\'ll match you with opportunities that fit your skills and schedule.' },
  { step: '04', title: 'Start Helping!', description: 'Begin making a difference for animals in need right away.' },
];

export default function VolunteerPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Users className="w-8 h-8 text-teal-600" />
          </div>
          <h1 className="text-5xl font-extrabold text-gray-900 mb-5 leading-tight">
            Your Time.<br />
            <span className="text-teal-600">Their Future.</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            Behind every successful rescue is a team of dedicated volunteers.
            Whether you have two hours a month or twenty, there&apos;s a place for you here.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#apply"
              className="bg-teal-600 text-white font-bold px-8 py-4 rounded-full hover:bg-teal-700 transition-colors text-lg shadow-lg shadow-teal-200"
            >
              Sign Up to Volunteer
            </a>
            <a
              href="#opportunities"
              className="border-2 border-teal-200 text-teal-600 font-bold px-8 py-4 rounded-full hover:bg-teal-50 transition-colors text-lg"
            >
              See Opportunities
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-teal-600 py-6 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-4 text-center text-white">
          <div>
            <p className="text-3xl font-extrabold">6+</p>
            <p className="text-teal-100 text-sm">Ways to help</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold">Flexible</p>
            <p className="text-teal-100 text-sm">Schedule options</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold">100%</p>
            <p className="text-teal-100 text-sm">Volunteer-powered</p>
          </div>
        </div>
      </section>

      {/* Volunteer Opportunities */}
      <section id="opportunities" className="py-16 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Volunteer Opportunities</h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              We have roles for every skill set and schedule. Find the one that&apos;s right for you.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {opportunities.map((opp) => {
              const Icon = opp.icon;
              return (
                <div key={opp.title} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${opp.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{opp.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">{opp.description}</p>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-400" />
                    <span className="text-sm text-gray-500 font-medium">{opp.commitment}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">How It Works</h2>
            <p className="text-gray-600">Getting started is simple. Here&apos;s what to expect.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <div key={step.step} className="text-center">
                <div className="w-14 h-14 bg-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-extrabold text-teal-600">{step.step}</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application form */}
      <section id="apply" className="py-20 px-4 bg-gradient-to-br from-teal-600 to-cyan-700 text-white">
        <div className="max-w-2xl mx-auto text-center">
          <Users className="w-12 h-12 mx-auto mb-5 text-teal-200" />
          <h2 className="text-4xl font-extrabold mb-4">Join the Team</h2>
          <p className="text-teal-100 text-lg mb-8 leading-relaxed">
            Fill out the form below and we&apos;ll be in touch within 48 hours to get you started.
          </p>
          <div className="bg-white rounded-2xl p-8 text-left shadow-xl">
            <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Volunteer Application</h3>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">First Name *</label>
                  <input type="text" required className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-300" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Last Name *</label>
                  <input type="text" required className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-300" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address *</label>
                <input type="email" required className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-300" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
                <input type="tel" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-300" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Areas of Interest * (select all that apply)</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Animal Transport', 'Photography', 'Social Media', 'Event Volunteer', 'Admin & Tech', 'Fundraising', 'Foster Care', 'Other'].map((skill) => (
                    <label key={skill} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                      <input type="checkbox" className="rounded" />
                      {skill}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Availability *</label>
                <select required className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-300 bg-white">
                  <option value="">Select your availability</option>
                  <option>Weekdays only</option>
                  <option>Weekends only</option>
                  <option>Weekdays and weekends</option>
                  <option>Evenings only</option>
                  <option>Flexible / As needed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Tell us about yourself</label>
                <textarea rows={3} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-300 resize-none" placeholder="Any relevant experience, skills, or reasons you want to volunteer..." />
              </div>
              <button
                type="submit"
                className="w-full bg-teal-600 text-white font-bold py-3 rounded-xl hover:bg-teal-700 transition-colors flex items-center justify-center gap-2"
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
