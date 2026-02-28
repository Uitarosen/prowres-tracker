"use client";
import PromotionFilter from "./PromotionFilter";
import RegionFilter from "./RegionFilter";
import { useFilterStore } from "@/store/useFilterStore";
import { X } from "lucide-react";

export default function FilterBar() {
  const { selectedPromotions, selectedRegion, clearFilters } = useFilterStore();
  const hasFilters = selectedPromotions.length > 0 || selectedRegion !== null;

  return (
    <div className="space-y-2">
      <PromotionFilter />
      <div className="flex items-center gap-3">
        <RegionFilter />
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-3 w-3" />
            クリア
          </button>
        )}
      </div>
    </div>
  );
}
