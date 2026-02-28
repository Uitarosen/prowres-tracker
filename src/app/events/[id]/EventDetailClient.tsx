"use client";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Clock, MapPin, Ticket, ExternalLink, CalendarPlus } from "lucide-react";
import { formatEventDate, formatTime } from "@/lib/format";
import BookmarkButton from "@/components/bookmark/BookmarkButton";
import type { EventData } from "@/types";

interface EventDetailClientProps {
  event: EventData;
}

export default function EventDetailClient({ event }: EventDetailClientProps) {
  const handleExportCalendar = () => {
    window.open(`/api/export?eventId=${event.id}`, "_blank");
  };

  const statusLabel = () => {
    switch (event.status) {
      case "cancelled":
        return (
          <span className="inline-flex items-center rounded-md px-3 py-1 text-sm font-medium bg-red-900/50 text-red-400 border border-red-800">
            中止
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center rounded-md px-3 py-1 text-sm font-medium bg-gray-700 text-gray-400 border border-gray-600">
            終了
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center rounded-md px-3 py-1 text-sm font-medium bg-green-900/50 text-green-400 border border-green-800">
            開催予定
          </span>
        );
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      {/* Back Button */}
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        一覧に戻る
      </Link>

      {/* Event Card */}
      <div
        className="rounded-xl bg-gray-800 border border-gray-700 overflow-hidden"
        style={{ borderTopWidth: "4px", borderTopColor: event.promotion.color || "#6B7280" }}
      >
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="text-sm font-bold px-3 py-1 rounded-md"
                  style={{
                    backgroundColor: `${event.promotion.color}25`,
                    color: event.promotion.color || "#9CA3AF",
                  }}
                >
                  {event.promotion.name}
                </span>
                {statusLabel()}
              </div>
              <h1 className="text-2xl font-bold text-white">{event.name}</h1>
            </div>
            <BookmarkButton eventId={event.id} />
          </div>

          {/* Details */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-white font-medium">
                  {formatEventDate(event.date)}
                </p>
                <div className="flex gap-4 text-sm text-gray-400 mt-0.5">
                  {event.doorTime && <span>開場 {formatTime(event.doorTime)}</span>}
                  {event.startTime && <span>開始 {formatTime(event.startTime)}</span>}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-white font-medium">{event.venue.name}</p>
                <p className="text-sm text-gray-400 mt-0.5">
                  {event.venue.address || event.venue.prefecture}
                </p>
              </div>
            </div>

            {event.ticketInfo && (
              <div className="flex items-start gap-3">
                <Ticket className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-white">{event.ticketInfo}</p>
                  {event.ticketUrl && (
                    <a
                      href={event.ticketUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-orange-400 hover:text-orange-300 mt-1"
                    >
                      チケット購入
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-700">
            <button
              onClick={handleExportCalendar}
              className="inline-flex items-center gap-2 rounded-md bg-gray-700 px-4 py-2 text-sm font-medium text-gray-200 hover:bg-gray-600 transition-colors"
            >
              <CalendarPlus className="h-4 w-4" />
              カレンダーに追加
            </button>
            {event.promotion.website && (
              <a
                href={event.promotion.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md bg-gray-700 px-4 py-2 text-sm font-medium text-gray-200 hover:bg-gray-600 transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                公式サイト
              </a>
            )}
          </div>

          {/* Description */}
          {event.description && (
            <div className="pt-4 border-t border-gray-700">
              <p className="text-gray-300 whitespace-pre-wrap">{event.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
