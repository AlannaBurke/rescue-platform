import Link from 'next/link';
import { Calendar, MapPin, Clock, ArrowRight } from 'lucide-react';

interface EventCardProps {
  event: {
    id: string;
    title: string;
    path: string;
    eventDate?: { time: string; timestamp: number };
    eventEndDate?: { time: string; timestamp: number };
    eventLocation?: string;
    body?: { summary?: string; value?: string };
  };
}

function formatEventDate(timeStr: string): string {
  const date = new Date(timeStr);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function formatEventTime(timeStr: string): string {
  const date = new Date(timeStr);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

function isUpcoming(timeStr: string): boolean {
  return new Date(timeStr) >= new Date();
}

export default function EventCard({ event }: EventCardProps) {
  const upcoming = event.eventDate ? isUpcoming(event.eventDate.time) : true;
  const summary =
    event.body?.summary ||
    (event.body?.value
      ? event.body.value.replace(/<[^>]+>/g, '').substring(0, 140) + '...'
      : null);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group">
      {/* Date badge header */}
      <div className={`px-6 py-4 ${upcoming ? 'bg-amber-50 border-b border-amber-100' : 'bg-gray-50 border-b border-gray-100'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className={`w-4 h-4 ${upcoming ? 'text-amber-600' : 'text-gray-400'}`} />
            {event.eventDate ? (
              <span className={`text-sm font-medium ${upcoming ? 'text-amber-700' : 'text-gray-500'}`}>
                {formatEventDate(event.eventDate.time)}
              </span>
            ) : (
              <span className="text-sm text-gray-400">Date TBD</span>
            )}
          </div>
          {upcoming ? (
            <span className="text-xs font-semibold bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
              Upcoming
            </span>
          ) : (
            <span className="text-xs font-semibold bg-gray-100 text-gray-500 px-2 py-1 rounded-full">
              Past Event
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-5">
        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-amber-600 transition-colors line-clamp-2">
          {event.title}
        </h3>

        {summary && (
          <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
            {summary}
          </p>
        )}

        <div className="space-y-2 mb-5">
          {event.eventDate && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="w-4 h-4 flex-shrink-0" />
              <span>
                {formatEventTime(event.eventDate.time)}
                {event.eventEndDate && ` – ${formatEventTime(event.eventEndDate.time)}`}
              </span>
            </div>
          )}
          {event.eventLocation && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span className="line-clamp-1">{event.eventLocation}</span>
            </div>
          )}
        </div>

        <Link
          href={`/events/${event.id}`}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-600 hover:text-amber-700 transition-colors"
        >
          View Details
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
