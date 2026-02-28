"use client";
import dynamic from "next/dynamic";
import { useEvents } from "@/hooks/useEvents";

const MapContainerComponent = dynamic(
  () => import("@/components/map/MapContainer"),
  {
    ssr: false,
    loading: () => (
      <div className="h-[600px] w-full rounded-lg bg-gray-800 animate-pulse flex items-center justify-center">
        <p className="text-gray-500">マップを読み込み中...</p>
      </div>
    ),
  }
);

export default function MapView() {
  const { events, loading } = useEvents();

  if (loading) {
    return (
      <div className="h-[600px] w-full rounded-lg bg-gray-800 animate-pulse flex items-center justify-center">
        <p className="text-gray-500">読み込み中...</p>
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

  return <MapContainerComponent events={events} />;
}
