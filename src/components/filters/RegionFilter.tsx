"use client";
import { useFilterStore } from "@/store/useFilterStore";
import { REGIONS } from "@/data/regions";
import { MapPin } from "lucide-react";

export default function RegionFilter() {
  const { selectedRegion, setRegion } = useFilterStore();

  return (
    <div className="flex items-center gap-2">
      <MapPin className="h-4 w-4 text-gray-400" />
      <select
        value={selectedRegion || ""}
        onChange={(e) => setRegion(e.target.value || null)}
        className="rounded-md bg-gray-800 border border-gray-600 px-3 py-1.5 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
      >
        <option value="">全地域</option>
        {REGIONS.map((region) => (
          <option key={region.name} value={region.name}>
            {region.name}
          </option>
        ))}
      </select>
    </div>
  );
}
