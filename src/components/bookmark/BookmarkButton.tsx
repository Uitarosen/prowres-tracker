"use client";
import { Heart } from "lucide-react";
import { useBookmarkStore } from "@/store/useBookmarkStore";
import { useEffect, useState } from "react";

export default function BookmarkButton({ eventId }: { eventId: string }) {
  const { bookmarkedIds, toggleBookmark } = useBookmarkStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button className="p-1.5 rounded-full" aria-label="ブックマーク">
        <Heart className="h-5 w-5 text-gray-500" />
      </button>
    );
  }

  const isBookmarked = bookmarkedIds.includes(eventId);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleBookmark(eventId);
      }}
      className="p-1.5 rounded-full hover:bg-gray-700 transition-colors"
      aria-label={isBookmarked ? "ブックマーク解除" : "ブックマーク"}
    >
      <Heart
        className={`h-5 w-5 transition-colors ${
          isBookmarked ? "fill-red-500 text-red-500" : "text-gray-500 hover:text-gray-300"
        }`}
      />
    </button>
  );
}
