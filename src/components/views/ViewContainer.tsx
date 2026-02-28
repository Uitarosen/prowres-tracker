"use client";
import { useViewStore } from "@/store/useViewStore";
import ListView from "./ListView";
import CalendarView from "./CalendarView";
import MapView from "./MapView";

export default function ViewContainer() {
  const { currentView } = useViewStore();

  switch (currentView) {
    case "list":
      return <ListView />;
    case "calendar":
      return <CalendarView />;
    case "map":
      return <MapView />;
    default:
      return <ListView />;
  }
}
