"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useFilterStore } from "@/store/useFilterStore";
import type { PromotionData } from "@/types";

export default function PromotionFilter() {
  const [promotions, setPromotions] = useState<PromotionData[]>([]);
  const { selectedPromotions, togglePromotion } = useFilterStore();

  useEffect(() => {
    fetch("/api/promotions")
      .then((res) => res.json())
      .then(setPromotions)
      .catch(console.error);
  }, []);

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {promotions.map((promo) => {
        const isActive = selectedPromotions.includes(promo.slug);
        return (
          <button
            key={promo.slug}
            onClick={() => togglePromotion(promo.slug)}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium transition-all border whitespace-nowrap flex-shrink-0 ${
              isActive
                ? "text-white border-transparent"
                : "text-gray-400 border-gray-600 hover:border-gray-400"
            }`}
            style={
              isActive
                ? { backgroundColor: promo.color || "#6B7280", borderColor: promo.color || "#6B7280" }
                : {}
            }
          >
            <Image
              src={`/logos/${promo.slug}.svg`}
              alt={promo.shortName}
              width={20}
              height={20}
              className="rounded-sm"
            />
            {promo.shortName}
          </button>
        );
      })}
    </div>
  );
}
