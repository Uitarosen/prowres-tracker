"use client";
import Link from "next/link";
import Image from "next/image";
import { Clock, MapPin, Ticket } from "lucide-react";
import { formatEventDate, formatTime } from "@/lib/format";
import BookmarkButton from "@/components/bookmark/BookmarkButton";
import type { EventData } from "@/types";

export default function EventCard({ event }: { event: EventData }) {
  const statusBadge = () => {
    if (event.status === "cancelled") {
      return (
        <span className="rounded px-2 py-0.5 text-xs font-medium bg-red-900/50 text-red-400 border border-red-800">
          中止
        </span>
      );
    }
    if (event.status === "completed") {
      return (
        <span className="rounded px-2 py-0.5 text-xs font-medium bg-gray-700 text-gray-400 border border-gray-600">
          終了
        </span>
      );
    }
    return null;
  };

  return (
    <Link href={`/events/${event.id}`}>
      <div
        className="group relative rounded-lg bg-gray-800 border border-gray-700 overflow-hidden hover:bg-gray-750 hover:border-gray-600 transition-all cursor-pointer"
        style={{ borderLeftWidth: "4px", borderLeftColor: event.promotion.color || "#6B7280" }}
      >
        <div className="p-4">
          <div className="flex items-start gap-3">
            {/* Promotion Logo */}
            <div className="flex-shrink-0 mt-0.5">
              <Image
                src={`/logos/${event.promotion.slug}.svg`}
                alt={event.promotion.name}
                width={44}
                height={44}
                className="rounded-md"
              />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded"
                      style={{
                        backgroundColor: `${event.promotion.color}20`,
                        color: event.promotion.color || "#9CA3AF",
                      }}
                    >
                      {event.promotion.shortName}
                    </span>
                    {statusBadge()}
                  </div>
                  <h3 className="text-base font-semibold text-white group-hover:text-orange-300 transition-colors truncate">
                    {event.name}
                  </h3>
                </div>
                <BookmarkButton eventId={event.id} />
              </div>

              <div className="mt-2 space-y-1">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Clock className="h-3.5 w-3.5 flex-shrink-0 text-gray-500" />
                  <span>{formatEventDate(event.date)}</span>
                  {event.doorTime && (
                    <span className="text-gray-500">
                      開場 {formatTime(event.doorTime)}
                    </span>
                  )}
                  {event.startTime && (
                    <span>開始 {formatTime(event.startTime)}</span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-gray-500" />
                  <span>{event.venue.name}</span>
                  <span className="text-gray-600">({event.venue.prefecture})</span>
                </div>
                {event.ticketInfo && (
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Ticket className="h-3.5 w-3.5 flex-shrink-0 text-gray-500" />
                    <span className="truncate">{event.ticketInfo}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
