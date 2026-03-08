'use client';

import { useState } from 'react';
import { Mail, Phone, Clock, ArrowRight, MessageSquare } from 'lucide-react';

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
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [reason, setReason] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);
    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          webform_id: 'contact',
          name: `${firstName} ${lastName}`.trim(),
          email,
          subject: `[${reason}] ${subject}`,
          message: `Phone: ${phone || 'Not provided'}\n\n${message}`,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setSubmitted(true);
      } else {
        setSubmitError(data.error || 'Submission failed. Please try again.');
      }
    } catch {
      setSubmitError('Network error. Please check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

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
          <div className="space-y-4">
            {contactInfo.map((item) => (
              <div key={item.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${item.color}`}>
                  <item.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">{item.label}</p>
                  {item.href ? (
                    <a href={item.href} className="text-gray-900 font-medium hover:text-indigo-600 transition-colors text-sm">{item.value}</a>
                  ) : (
                    <p className="text-gray-900 font-medium text-sm">{item.value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Contact form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Send Us a Message</h2>

              {submitted ? (
                <div className="text-center py-10">
                  <div className="text-5xl mb-4">✉️</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                  <p className="text-gray-600">Thank you for reaching out. We&apos;ll get back to you within 24–48 hours.</p>
                </div>
              ) : (
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">First Name *</label>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-shadow"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Last Name *</label>
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-shadow"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-shadow"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-shadow"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Reason for Contact *</label>
                  <select
                    required
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
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
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-shadow"
                    placeholder="Brief description of your inquiry"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Message *</label>
                  <textarea
                    rows={5}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
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

                {submitError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    <strong>Error:</strong> {submitError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Sending...' : (<>Send Message <ArrowRight className="w-5 h-5" /></>)}
                </button>
              </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
