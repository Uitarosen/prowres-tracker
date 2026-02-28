"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface BookmarkState {
  bookmarkedIds: string[];
  toggleBookmark: (eventId: string) => void;
  isBookmarked: (eventId: string) => boolean;
  clearBookmarks: () => void;
}

export const useBookmarkStore = create<BookmarkState>()(
  persist(
    (set, get) => ({
      bookmarkedIds: [],
      toggleBookmark: (eventId) =>
        set((state) => ({
          bookmarkedIds: state.bookmarkedIds.includes(eventId)
            ? state.bookmarkedIds.filter((id) => id !== eventId)
            : [...state.bookmarkedIds, eventId],
        })),
      isBookmarked: (eventId) => get().bookmarkedIds.includes(eventId),
      clearBookmarks: () => set({ bookmarkedIds: [] }),
    }),
    {
      name: "prowres-bookmarks",
    }
  )
);
