"use client";
import { create } from "zustand";

interface FilterState {
  selectedPromotions: string[];
  selectedRegion: string | null;
  dateFrom: string | null;
  dateTo: string | null;
  togglePromotion: (slug: string) => void;
  setRegion: (region: string | null) => void;
  setDateRange: (from: string | null, to: string | null) => void;
  clearFilters: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  selectedPromotions: [],
  selectedRegion: null,
  dateFrom: null,
  dateTo: null,
  togglePromotion: (slug) =>
    set((state) => ({
      selectedPromotions: state.selectedPromotions.includes(slug)
        ? state.selectedPromotions.filter((s) => s !== slug)
        : [...state.selectedPromotions, slug],
    })),
  setRegion: (region) => set({ selectedRegion: region }),
  setDateRange: (from, to) => set({ dateFrom: from, dateTo: to }),
  clearFilters: () =>
    set({
      selectedPromotions: [],
      selectedRegion: null,
      dateFrom: null,
      dateTo: null,
    }),
}));
