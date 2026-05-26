import { create } from "zustand";
import { fetchAllEvent } from "@/api/EventHub";

interface EventStore {
  events: any[];
  fetchEvents: () => Promise<void>;
}

export const useEvent = create<EventStore>((set) => ({
  events: [],

  fetchEvents: async () => {
    try {
      const data = await fetchAllEvent();
      set({ events: data || [], });     
    } catch (err) {
      console.error(err);
    }
  },
}));