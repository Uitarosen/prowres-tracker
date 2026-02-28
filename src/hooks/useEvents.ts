"use client";
import { useState, useEffect, useCallback } from "react";
import type { EventData } from "@/types";
import { useFilterStore } from "@/store/useFilterStore";

export function useEvents() {
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  const { selectedPromotions, selectedRegion, dateFrom, dateTo } =
    useFilterStore();

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();

    if (selectedPromotions.length > 0) {
      params.set("promotion", selectedPromotions.join(","));
    }
    if (selectedRegion) {
      params.set("region", selectedRegion);
    }
    if (dateFrom) {
      params.set("from", dateFrom);
    }
    if (dateTo) {
      params.set("to", dateTo);
    }

    try {
      const res = await fetch(`/api/events?${params.toString()}`);
      const data = await res.json();
      setEvents(data.events);
      setTotal(data.total);
    } catch (error) {
      console.error("Failed to fetch events:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedPromotions, selectedRegion, dateFrom, dateTo]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return { events, loading, total, refetch: fetchEvents };
}
