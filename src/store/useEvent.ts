import { create } from "zustand";
import { fetchAllEvent, filterEvents as filterEventsApi } from "@/api/EventHub";

// The list endpoint returns a plain array, but the filter endpoint may wrap the
// events in an object (e.g. { results }, { data }, { events }). Normalize both
// to an array so consumers can always safely .map() over `events`.
const toEventArray = (data: any): any[] => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.results)) return data.results;
  if (Array.isArray(data?.events)) return data.events;
  if (Array.isArray(data?.data)) return data.data;
  return [];
};

interface EventStore {
  events: any[];
  fetchEvents: () => Promise<void>;
  filterEvents: (params: Record<string, any>) => Promise<void>;
}

export const useEvent = create<EventStore>((set) => ({
  events: [],

  fetchEvents: async () => {
    try {
      const data = await fetchAllEvent();
      set({ events: toEventArray(data) });
    } catch (err) {
      console.error(err);
    }
  },

  filterEvents: async (params: Record<string, any>) => {
    try {
      const data = await filterEventsApi(params);
      set({ events: toEventArray(data) });
    } catch (err) {
      console.error(err);
    }
  },
}));
