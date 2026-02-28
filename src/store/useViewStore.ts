"use client";
import { create } from "zustand";
import type { ViewMode } from "@/types";

interface ViewState {
  currentView: ViewMode;
  setView: (view: ViewMode) => void;
}

export const useViewStore = create<ViewState>((set) => ({
  currentView: "list",
  setView: (view) => set({ currentView: view }),
}));
