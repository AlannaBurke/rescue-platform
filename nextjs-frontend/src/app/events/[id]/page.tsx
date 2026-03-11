import { draftMode } from 'next/headers';
import { getClient } from '@/lib/apollo-client';
import { GET_EVENT } from '@/lib/graphql/content';
import Link from 'next/link';
import { Calendar, MapPin, Clock, ArrowLeft } from 'lucide-react';
import { notFound } from 'next/navigation';
import ShareButton from '@/components/ShareButton';

export const revalidate = 300;

function formatDate(timeStr: string): string {
  return new Date(timeStr).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function formatTime(timeStr: string): string {
  return new Date(timeStr).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export default async function EventDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { isEnabled: isPreview } = await draftMode();
  const client = getClient();
  let event: any = null;

  try {
    const { data } = await client.query({
      query: GET_EVENT,
      variables: { id: params.id },
    });
    event = (data as any)?.nodeEvent ?? null;
  } catch (error) {
    console.error('Failed to fetch event:', error);
  }

  // In preview/draft mode, show unpublished content; otherwise require published
  if (!event || (!event.status && !isPreview)) {
    notFound();
  }

  const isUpcoming = event.eventDate
    ? new Date(event.eventDate.time) >= new Date()
    : true;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back navigation */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-amber-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Events
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Unpublished badge in preview mode */}
        {isPreview && !event.status && (
          <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-800">
            <strong>Draft</strong> — This event is not yet published and is only visible in preview mode.
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className={`px-8 py-8 ${isUpcoming ? 'bg-gradient-to-br from-amber-50 to-orange-50' : 'bg-gray-50'}`}>
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  {isUpcoming ? (
                    <span className="text-xs font-bold bg-amber-100 text-amber-700 px-3 py-1 rounded-full uppercase tracking-wide">
                      Upcoming Event
                    </span>
                  ) : (
                    <span className="text-xs font-bold bg-gray-100 text-gray-500 px-3 py-1 rounded-full uppercase tracking-wide">
                      Past Event
                    </span>
                  )}
                </div>
                <h1 className="text-3xl font-extrabold text-gray-900 mb-2">{event.title}</h1>
              </div>
            </div>
          </div>

          {/* Event details */}
          <div className="px-8 py-6 border-b border-gray-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {event.eventDate && (
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-0.5">Date</p>
                    <p className="text-gray-900 font-semibold">{formatDate(event.eventDate.time)}</p>
                  </div>
                </div>
              )}

              {event.eventDate && (
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-0.5">Time</p>
                    <p className="text-gray-900 font-semibold">
                      {formatTime(event.eventDate.time)}
                      {event.eventEndDate && ` – ${formatTime(event.eventEndDate.time)}`}
                    </p>
                  </div>
                </div>
              )}

              {event.eventLocation && (
                <div className="flex items-start gap-3 sm:col-span-2">
                  <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-0.5">Location</p>
                    <p className="text-gray-900 font-semibold">{event.eventLocation}</p>
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(event.eventLocation)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-amber-600 hover:text-amber-700 mt-1 inline-block"
                    >
                      Get Directions →
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Body content */}
          {event.body?.processed && (
            <div className="px-8 py-8">
              <div
                className="prose prose-gray max-w-none prose-headings:font-bold prose-a:text-amber-600 prose-a:no-underline hover:prose-a:underline"
                dangerouslySetInnerHTML={{ __html: event.body.processed }}
              />
            </div>
          )}

          {/* CTA footer */}
          {isUpcoming && (
            <div className="px-8 py-6 bg-amber-50 border-t border-amber-100">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-gray-900">Can&apos;t wait to see you there!</p>
                  <p className="text-sm text-gray-600">Questions? Reach out to us before the event.</p>
                </div>
                <div className="flex gap-3">
                  <Link
                    href="/contact"
                    className="bg-amber-600 text-white font-bold px-6 py-2.5 rounded-full hover:bg-amber-700 transition-colors text-sm"
                  >
                    Contact Us
                  </Link>
                  <ShareButton title={event.title} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
