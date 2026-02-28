"use client";
import FilterBar from "@/components/filters/FilterBar";
import ViewSwitcher from "@/components/views/ViewSwitcher";
import ViewContainer from "@/components/views/ViewContainer";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-4 sm:py-6 space-y-4 sm:space-y-6">
      {/* Toolbar */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <ViewSwitcher />
        </div>
        <FilterBar />
      </div>

      {/* Main Content */}
      <ViewContainer />
    </div>
  );
}
