import { create } from "zustand";
import { toast } from "sonner";
import { getAllTasks } from "@/api/PlannerHub";

export interface PlannerTask {
  task_id: string;
  title: string;
  tags: string;
  tags_list: string[];
  priority: "low" | "medium" | "high";
  marketing_type: string;
  due_date: string | null;
  status: string;
  launch_date: string | null;
  campaign: string;
  campaign_title: string;
  event: string;
  event_title: string;
  parent_task: string | null;
  subtask_count: number;
  depth: number;
  assigned_by_name: string;
  assigned_to_name: string;
  assigned_to_email: string;
  created_at: string;
  updated_at: string;
}

interface PlannerStore {
  planner: PlannerTask[];

  loading: boolean;

  error: string | null;

  fetchTasks: () => Promise<void>;

  clearPlanner: () => void;
}

export const usePlanner = create<PlannerStore>((set) => ({

  planner: [],
  loading: false,
  error: null,

  fetchTasks: async () => {

    try {
      set({
        loading: true,
        error: null,
      });

      const data = await getAllTasks();

      if (!Array.isArray(data))
      {
        throw new Error("Invalid response from server");
      }

      set({
        planner: data,
        loading: false,
      });

    } catch (err: any) {

      console.error("Planner Store Error:", err);
      set({
        error: err.message || "Something went wrong",
        loading: false,
      });

      toast.error(err.message || "Failed to fetch tasks");
    }
  },

  clearPlanner: () => {
    set({
      planner: [],
      error: null,
      loading: false,
    });
  },

}));