import { getClient } from '@/lib/apollo-client';
import { GET_EVENTS } from '@/lib/graphql/content';
import EventCard from '@/components/events/EventCard';
import { Calendar } from 'lucide-react';

export const metadata = {
  title: 'Events | Rescue Platform',
  description: 'Join us at our upcoming adoption events, fundraisers, and community gatherings.',
};

export const revalidate = 300; // Revalidate every 5 minutes

export default async function EventsPage() {
  const client = getClient();
  let events: any[] = [];

  try {
    const { data } = await client.query({
      query: GET_EVENTS,
      variables: { first: 50 },
    });
    events = (data as any)?.nodeEvents?.nodes ?? [];
  } catch (error) {
    console.error('Failed to fetch events:', error);
  }

  // Split into upcoming and past
  const now = new Date();
  const upcoming = events.filter(
    (e) => e.eventDate && new Date(e.eventDate.time) >= now
  ).sort((a, b) => new Date(a.eventDate.time).getTime() - new Date(b.eventDate.time).getTime());

  const past = events.filter(
    (e) => !e.eventDate || new Date(e.eventDate.time) < now
  ).sort((a, b) => new Date(b.eventDate?.time ?? 0).getTime() - new Date(a.eventDate?.time ?? 0).getTime());

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-amber-50 to-orange-50 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Calendar className="w-7 h-7 text-amber-600" />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Events & Happenings</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Come meet our animals, support our mission, and connect with fellow animal lovers
            at our adoption events, fundraisers, and community gatherings.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Upcoming Events */}
        <section className="mb-14">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Upcoming Events</h2>
            {upcoming.length > 0 && (
              <span className="bg-amber-100 text-amber-700 text-sm font-semibold px-3 py-1 rounded-full">
                {upcoming.length} event{upcoming.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          {upcoming.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcoming.map((event: any) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No upcoming events</h3>
              <p className="text-gray-500 text-sm max-w-sm mx-auto">
                Check back soon — we regularly host adoption events and fundraisers.
                Follow us on social media to stay in the loop!
              </p>
            </div>
          )}
        </section>

        {/* Newsletter CTA */}
        <section className="bg-amber-600 rounded-2xl p-8 md:p-10 text-white text-center mb-14">
          <h2 className="text-2xl font-bold mb-3">Never Miss an Event</h2>
          <p className="text-amber-100 mb-6 max-w-xl mx-auto">
            Sign up for our newsletter and be the first to know about adoption events,
            fundraisers, and ways to get involved.
          </p>
          <a
            href="/contact"
            className="inline-block bg-white text-amber-600 font-bold px-8 py-3 rounded-full hover:bg-amber-50 transition-colors"
          >
            Get Event Updates
          </a>
        </section>

        {/* Past Events */}
        {past.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Past Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {past.map((event: any) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
