"use client";
import { useState, useMemo } from "react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  format,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEvents } from "@/hooks/useEvents";
import EventCard from "@/components/events/EventCard";
import { getDateKey } from "@/lib/format";
import type { EventData } from "@/types";

const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];

export default function CalendarView() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const { events, loading } = useEvents();

  const eventsByDate = useMemo(() => {
    const map: Record<string, EventData[]> = {};
    events.forEach((event) => {
      const key = getDateKey(event.date);
      if (!map[key]) map[key] = [];
      map[key].push(event);
    });
    return map;
  }, [events]);

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calStart = startOfWeek(monthStart, { weekStartsOn: 0 });
    const calEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
    return eachDayOfInterval({ start: calStart, end: calEnd });
  }, [currentMonth]);

  const selectedDateEvents = useMemo(() => {
    if (!selectedDate) return [];
    return eventsByDate[getDateKey(selectedDate)] || [];
  }, [selectedDate, eventsByDate]);

  const yearMonth = `${currentMonth.getFullYear()}年${currentMonth.getMonth() + 1}月`;

  return (
    <div className="space-y-4">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="p-2 rounded-md hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h2 className="text-lg font-semibold text-white">{yearMonth}</h2>
        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="p-2 rounded-md hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 text-center">
        {WEEKDAYS.map((day, i) => (
          <div
            key={day}
            className={`py-2 text-xs font-medium ${
              i === 0 ? "text-red-400" : i === 6 ? "text-blue-400" : "text-gray-500"
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      {loading ? (
        <div className="h-64 animate-pulse bg-gray-800 rounded-lg" />
      ) : (
        <div className="grid grid-cols-7 border border-gray-700 rounded-lg overflow-hidden">
          {calendarDays.map((day) => {
            const key = getDateKey(day);
            const dayEvents = eventsByDate[key] || [];
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const isSelected = selectedDate && isSameDay(day, selectedDate);
            const isToday = isSameDay(day, new Date());
            const dayOfWeek = day.getDay();

            return (
              <button
                key={key}
                onClick={() => setSelectedDate(day)}
                className={`relative min-h-[60px] sm:min-h-[80px] p-1 sm:p-2 border-b border-r border-gray-700/50 text-left transition-colors ${
                  !isCurrentMonth ? "bg-gray-900/50" : "bg-gray-850"
                } ${isSelected ? "bg-gray-700 ring-1 ring-orange-500" : "hover:bg-gray-800"}`}
              >
                <span
                  className={`text-xs sm:text-sm ${
                    !isCurrentMonth
                      ? "text-gray-700"
                      : isToday
                        ? "text-orange-400 font-bold"
                        : dayOfWeek === 0
                          ? "text-red-400"
                          : dayOfWeek === 6
                            ? "text-blue-400"
                            : "text-gray-300"
                  }`}
                >
                  {format(day, "d")}
                </span>
                {dayEvents.length > 0 && (
                  <div className="flex flex-wrap gap-0.5 mt-1">
                    {dayEvents.slice(0, 3).map((ev) => (
                      <div
                        key={ev.id}
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: ev.promotion.color || "#6B7280" }}
                        title={`${ev.promotion.shortName} ${ev.name}`}
                      />
                    ))}
                    {dayEvents.length > 3 && (
                      <span className="text-[10px] text-gray-500">
                        +{dayEvents.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Selected Date Events */}
      {selectedDate && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-400">
            {`${selectedDate.getMonth() + 1}月${selectedDate.getDate()}日の興行`}
          </h3>
          {selectedDateEvents.length === 0 ? (
            <p className="text-sm text-gray-600 py-4 text-center">
              この日の興行はありません
            </p>
          ) : (
            selectedDateEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))
          )}
        </div>
      )}
    </div>
  );
}
