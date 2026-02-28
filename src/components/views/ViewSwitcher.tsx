"use client";
import { List, Calendar, Map } from "lucide-react";
import { useViewStore } from "@/store/useViewStore";
import type { ViewMode } from "@/types";

const views: { mode: ViewMode; label: string; icon: typeof List }[] = [
  { mode: "list", label: "リスト", icon: List },
  { mode: "calendar", label: "カレンダー", icon: Calendar },
  { mode: "map", label: "マップ", icon: Map },
];

export default function ViewSwitcher() {
  const { currentView, setView } = useViewStore();

  return (
    <div className="flex gap-1 rounded-lg bg-gray-800 p-1 flex-shrink-0">
      {views.map(({ mode, label, icon: Icon }) => (
        <button
          key={mode}
          onClick={() => setView(mode)}
          className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors whitespace-nowrap ${
            currentView === mode
              ? "bg-gray-600 text-white"
              : "text-gray-400 hover:text-gray-200"
          }`}
        >
          <Icon className="h-4 w-4" />
          {label}
        </button>
      ))}
    </div>
  );
}
