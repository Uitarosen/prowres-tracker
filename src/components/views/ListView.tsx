"use client";
import { useEvents } from "@/hooks/useEvents";
import EventCard from "@/components/events/EventCard";
import { getDateKey, formatDateGroupHeader } from "@/lib/format";
import type { EventData } from "@/types";

export default function ListView() {
  const { events, loading, total } = useEvents();

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse rounded-lg bg-gray-800 border border-gray-700 h-32"
          />
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-500">
        <p className="text-lg">該当する興行が見つかりません</p>
        <p className="text-sm mt-1">フィルターを変更してください</p>
      </div>
    );
  }

  // Group events by date
  const grouped = events.reduce<Record<string, EventData[]>>((acc, event) => {
    const key = getDateKey(event.date);
    if (!acc[key]) acc[key] = [];
    acc[key].push(event);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-500">{total}件の興行</p>
      {Object.entries(grouped).map(([dateKey, dateEvents]) => (
        <div key={dateKey}>
          <h2 className="text-sm font-semibold text-gray-400 mb-3 sticky top-0 bg-gray-950/90 backdrop-blur py-1 z-10">
            {formatDateGroupHeader(dateEvents[0].date)}
          </h2>
          <div className="space-y-3">
            {dateEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
