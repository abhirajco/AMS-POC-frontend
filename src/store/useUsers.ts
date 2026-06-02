import { create } from "zustand";
import { getAllExecutive } from "@/api/Users";
import { getAllWriter } from "@/api/Users";

interface UserStore {
  executives: any[];
  smes: any[];
  admins: any[];
  writers: any[];
  isLoading: boolean;
  error: string | null;

  fetchExecutives: () => Promise<void>;

  setExecutives: (executives: any[]) => void;
  clearUsers: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  executives: [],
  smes: [],
  admins: [],
  writers:[],

  isLoading: false,
  error: null,

  setExecutives: (executives) =>
    set({ executives }),

  fetchExecutives: async () => {
    try {
      set({
        isLoading: true,
        error: null,
      });

      const data = await getAllExecutive();

      set({
        executives: data || [],
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error?.message || "Failed to fetch executives",
        isLoading: false,
      });
    }
  },

  clearUsers: () =>
    set({
      executives: [],
      smes: [],
      admins: [],
      error: null,
    }),
}));