import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getTasks, updateTaskStatus, filterTasks, createTask, getTaskDetail, updateTask, deleteTask } from "../api/taskApi";
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors, useDroppable, useDraggable, type DragEndEvent, type DragStartEvent,} from "@dnd-kit/core";
import HeaderSection from "@/components/common/HeaderSection";
import { Button } from "../components/ui/button";
import { Plus, Star, ArrowLeft, ArrowRight, Calendar, Calendar as CalendarIcon, MapPin, List, Search } from "lucide-react";
import { Input } from "../components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "../components/ui/select";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import FullCalendar from "@fullcalendar/react";
import CalendarApp, { taskToCalendarItem } from "@/components/ui/CampaingnHub/CalenderView";
import { getPriorityBadge, getTaskStatusBadge, renderHtmlContent } from "@/utils/helpers";
import { useCampaign } from "@/store/useCampaign";
import { EventDialog } from "@/components/ui/EventsComponent";
import type { CalendarEvent } from "@/components/ui/calendar copy";
import type { TeamMember } from "@/components/ui/EditableAssignedTeams";

// Mock team options for the EventDialog's assigned-team picker.
const TEAM_OPTIONS: TeamMember[] = [
  { id: 1, name: "John Doe", role: "Developer", initials: "JD" },
  { id: 2, name: "Sarah Khan", role: "Designer", initials: "SK" },
  { id: 3, name: "Mike Ross", role: "QA", initials: "MR" },
];

const todayISO = () => new Date().toISOString().slice(0, 10);

// CalendarEvent priority label → backend task enum.
const CE_TO_PRIORITY: Record<string, string> = {
  Low: "low",
  Medium: "medium",
  High: "high",
};

// Backend task priority → CalendarEvent label (for prefilling the dialog).
const PRIORITY_TO_CE: Record<string, CalendarEvent["priority"]> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

// The dialog's status options are the shared event labels, so task statuses
// (to_do / blocked) are mapped onto the closest label for display and back
// again on save. Round-trips cleanly for the four task statuses.
const TASK_STATUS_TO_CE: Record<string, CalendarEvent["status"]> = {
  to_do: "Planning",
  in_progress: "In Progress",
  completed: "Completed",
  blocked: "Follow Up",
};
const CE_TO_TASK_STATUS: Record<string, string> = {
  Planning: "to_do",
  "In Progress": "in_progress",
  Completed: "completed",
  "Follow Up": "blocked",
  Upcoming: "to_do",
};

// Only forward valid UUIDs (the mock team picker uses numeric ids).
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// ── Blank EventDialog form used when creating a task ──────────────────────────
const emptyTaskForm = (date: string = todayISO()): Partial<CalendarEvent> => ({
  title: "",
  description: "",
  comment: "",
  date,
  eventDate: date,
  endDate: "",
  location: "",
  campaign: "",
  assignedTeam: [],
  milestones: [],
  relatedTasks: [],
  relatedCampaigns: [],
  attachments: [],
  priority: "Medium",
  status: "Planning",
  type: "Campaign",
  effortOriginal: "",
  effortRemaining: "",
  effortCompleted: "",
});

// ── EventDialog form → task create payload ────────────────────────────────────
// Only title + campaign_id are required; the rest are optional (null/blank in
// the model), so omit them when empty and let the backend defaults apply.
const buildTaskPayload = (f: Partial<CalendarEvent>) => {
  const assignedTeam = (f.assignedTeam ?? [])
    .map((m) => String(m.id))
    .filter((id) => UUID_RE.test(id));

  const payload: Record<string, any> = {
    title: (f.title ?? "").trim(),
    description: f.description ?? "",
    priority: (f.priority && CE_TO_PRIORITY[f.priority]) || "medium",
    campaign_id: f.campaign,
    tags: "",
  };

  const dueDate = f.date || f.eventDate;
  if (dueDate) payload.due_date = dueDate;
  if (f.endDate) payload.launch_date = f.endDate;
  // assigned_to is a single user FK — take the first valid UUID, if any.
  if (assignedTeam.length > 0) payload.assigned_to = assignedTeam[0];

  return payload;
};

// ── Backend task → EventDialog form (prefill on click) ────────────────────────
const taskToForm = (t: any): Partial<CalendarEvent> => ({
  id: t.task_id,
  title: t.title ?? "",
  description: t.description ?? "",
  comment: "",
  priority: PRIORITY_TO_CE[(t.priority ?? "").toLowerCase()] ?? "Medium",
  status: TASK_STATUS_TO_CE[(t.status ?? "").toLowerCase()] ?? "Planning",
  date: t.due_date ?? "",
  eventDate: t.due_date ?? "",
  endDate: t.launch_date ?? "",
  location: "",
  campaign: t.campaign ?? "",
  type: "Campaign",
  assignedTeam: [],
  milestones: [],
  relatedTasks: [],
  relatedCampaigns: [],
  attachments: [],
  effortOriginal: t.estimated_hours ?? "",
  effortRemaining: "",
  effortCompleted: t.completed_hours ?? "",
});

// ── EventDialog form → task update (PATCH) payload ────────────────────────────
const buildTaskUpdatePayload = (f: Partial<CalendarEvent>) => {
  const payload: Record<string, any> = {
    title: (f.title ?? "").trim(),
    description: f.description ?? "",
    priority: (f.priority && CE_TO_PRIORITY[f.priority]) || "medium",
    status: (f.status && CE_TO_TASK_STATUS[f.status]) || "to_do",
  };

  const dueDate = f.date || f.eventDate;
  if (dueDate) payload.due_date = dueDate;
  if (f.endDate) payload.launch_date = f.endDate;

  return payload;
};

const columns = [
  { key: "to_do", title: "To Do" },
  { key: "in_progress", title: "In Progress" },
  { key: "completed", title: "Completed" },
  { key: "blocked", title: "Blocked" },
];

// const TaskCard = ({ task, onClick }: any) => {
//   return (
//     <div
//       onClick={() => onClick(task)}
//       className="bg-white p-4 rounded-xl shadow-sm borde cursor-pointer"
//     >
//       <span
//         className={`text-xs mb-2 px-2 py-1 rounded-sm font-medium ${
//           task.priority === "high"
//             ? "bg-red-700 text-white"
//             : task.priority === "medium"
//             ? "bg-gray-100 text-black"
//             : "bg-green-100 text-green-600"
//         }`}
//       >
//         {task.priority}
//       </span>

//       <h4 className="font-semibold text-sm text-gray-800">{task.title}</h4>

//       <p className="text-xs text-gray-500 mt-1 line-clamp-2">
//         {task.description}
//       </p>

//       <div className="text-xs text-gray-600 mt-2">{task.marketing_type}</div>

//       <div className="text-xs text-gray-600 mt-1">
//         <CalendarTodayIcon fontSize="small" /> {task.due_date}
//       </div>

//       <div className="text-xs text-gray-600 mt-1">
//         User {task.assigned_to_name}
//       </div>
//     </div>
//   );
// };


const TaskCard = ({ task, onClick }: any) => {
  return (
    <div
      onClick={() => onClick(task)}
      className="bg-white p-4 rounded-xl shadow-sm border cursor-pointer"
    >
      <div className="mb-2">
        {getPriorityBadge(task.priority)}
      </div>

      <h4 className="font-semibold text-sm text-gray-800">
        {task.title}
      </h4>

      <p className="text-xs text-gray-500 mt-1 line-clamp-2">
        {task.description}
      </p>

      <div className="text-xs text-gray-600 mt-2">
        {task.marketing_type}
      </div>

      <div className="text-xs text-gray-600 mt-1 flex items-center gap-1">
        <CalendarTodayIcon fontSize="small" />
        {task.due_date}
      </div>

      <div className="text-xs text-gray-600 mt-1">
        Assigned to- {task.assigned_to_name}
      </div>
    </div>
  );
};


const DraggableTaskCard = ({ task, onClick }: any) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: task.task_id,
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{ opacity: isDragging ? 0.4 : 1 }}
    >
      <TaskCard task={task} onClick={onClick} />
    </div>
  );
};

const KanbanColumn = ({ col, tasks, onTaskClick }: any) => {
  const { setNodeRef, isOver } = useDroppable({ id: col.key });

  return (
    <div
      ref={setNodeRef}
      className={`rounded-xl p-3 min-h-[200px] transition-colors ${
        isOver ? "bg-blue-50" : "bg-gray-100"
      }`}
    >
      <h3 className="font-semibold mb-3">{col.title}</h3>
      <div className="flex flex-col gap-3">
        {tasks
          .filter((t: any) => t.status === col.key)
          .map((task: any) => (
            <DraggableTaskCard
              key={task.task_id}
              task={task}
              onClick={onTaskClick}
            />
          ))}
      </div>
    </div>
  );
};

const PlannerPage = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [filters, setFilters] = useState<any>({});
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"kanban" | "calendar" | "list">("kanban");
  const [activeTask, setActiveTask] = useState<any>(null);
  const calendarRef = useRef<FullCalendar>(null);
  const [currentLabel, setCurrentLabel] = useState("");

  // ── Task dialog (shared EventDialog, entity="planner") — create + update ──
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isCreateMode, setIsCreateMode] = useState(true);
  const [selectedTaskId, setSelectedTaskId] = useState("");
  const [taskHistory, setTaskHistory] = useState<any[]>([]);
  const [dialogForm, setDialogForm] = useState<Partial<CalendarEvent>>(emptyTaskForm);

  const navigate = useNavigate();
  const { id } = useParams();
  // The task id the route has already opened — prevents a tasks refresh from
  // re-triggering the detail dialog.
  const openedIdRef = useRef<string | null>(null);

  // Close the dialog and, when on a /planner/:id route, return to the list.
  const closeDialog = () => {
    setDialogOpen(false);
    if (id) navigate("/planner");
  };

  // Clicking a task (list / kanban / calendar) navigates to its detail route;
  // the effect below resolves the id and opens the dialog (prefilled).
  const goToTask = (taskId: string) => navigate(`/planner/${taskId}`);

  // Campaign options for the dialog's campaign picker (title shown, id sent).
  const campaigns = useCampaign((s: any) => s.campaigns);
  const fetchCampaigns = useCampaign((s: any) => s.fetchCampaigns);
  const campaignOptions = (Array.isArray(campaigns) ? campaigns : []).map(
    (c: any) => ({ id: c.campaign_id, title: c.title })
  );

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  const sensors = useSensors(useSensor(PointerSensor));

  const fetchTasks = async () => {
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (err) {
      console.error(err);
    }
  };

  // ── Calendar (shared with Campaign / Event Hub) ───────────────────────────
  const handlePrev = () => {
    const api = calendarRef.current?.getApi();
    if (!api) return;
    api.prev();
    setCurrentLabel(api.view.title);
  };

  const handleNext = () => {
    const api = calendarRef.current?.getApi();
    if (!api) return;
    api.next();
    setCurrentLabel(api.view.title);
  };

  // ── Open the EventDialog in create mode (New Task button / calendar +) ─────
  const openCreateTask = (date?: string) => {
    setIsCreateMode(true);
    setSelectedTaskId("");
    setTaskHistory([]);
    setDialogForm(emptyTaskForm(date));
    setDialogOpen(true);
  };

  // ── Open the EventDialog showing an existing task, prefilled ───────────────
  // Fills immediately from the clicked row, then fetches the full detail and
  // refines the form (launch date, efforts, history, …).
  const openTaskDetail = async (task: any) => {
    const id = String(task?.task_id ?? task);
    setIsCreateMode(false);
    setSelectedTaskId(id);
    setDialogForm(taskToForm(task));
    setTaskHistory(task?.history ?? []);
    setDialogOpen(true);

    try {
      const detail = await getTaskDetail(id);
      if (detail) {
        setDialogForm(taskToForm(detail));
        setTaskHistory(detail?.history ?? []);
      }
    } catch {
      // Keep the optimistic row data if the detail fetch fails.
    }
  };

  // Open the detail dialog from the URL (click-through and deep links both land
  // on /planner/:id). Waits for the tasks to load before resolving the id.
  useEffect(() => {
    const list = Array.isArray(tasks) ? tasks : [];
    if (id) {
      if (openedIdRef.current === id) return;
      const task = list.find((t) => String(t.task_id) === String(id));
      if (task) {
        openedIdRef.current = id;
        openTaskDetail(task);
      }
      return;
    }
    openedIdRef.current = null;
    if (!isCreateMode) setDialogOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, tasks, isCreateMode]);

  // ── Save: create or update depending on the dialog mode ───────────────────
  const handleDialogSave = async () => {
    const { toast } = await import("sonner");

    if (isCreateMode) {
      const payload = buildTaskPayload(dialogForm);
      if (!payload.title) {
        toast.error("Please enter a task title.");
        return;
      }
      if (!payload.campaign_id) {
        toast.error("Please select a campaign.");
        return;
      }
      try {
        await createTask(payload);
        toast.success("Task created successfully");
        await fetchTasks();
        closeDialog();
      } catch (err: any) {
        toast.error(err?.message || "Failed to create task");
      }
      return;
    }

    const payload = buildTaskUpdatePayload(dialogForm);
    if (!payload.title) {
      toast.error("Please enter a task title.");
      return;
    }
    try {
      await updateTask(selectedTaskId, payload);
      toast.success("Task updated successfully");
      await fetchTasks();
      closeDialog();
    } catch (err: any) {
      toast.error(err?.message || "Failed to update task");
    }
  };

  // ── Delete the currently opened task ──────────────────────────────────────
  const handleDialogDelete = async () => {
    if (isCreateMode || !selectedTaskId) {
      closeDialog();
      return;
    }
    const { toast } = await import("sonner");
    try {
      await deleteTask(selectedTaskId);
      toast.success("Task deleted successfully");
      await fetchTasks();
      closeDialog();
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete task");
    }
  };

  // ── Duplicate the currently opened task (under its own campaign) ──────────
  const handleDialogDuplicate = async () => {
    const { toast } = await import("sonner");
    const payload: Record<string, any> = {
      ...buildTaskPayload(dialogForm),
      title: `${dialogForm.title ?? "Task"} (Copy)`,
    };
    if (!payload.campaign_id) {
      toast.error("This task has no campaign to duplicate under.");
      return;
    }
    try {
      await createTask(payload);
      toast.success("Task duplicated successfully");
      await fetchTasks();
      closeDialog();
    } catch (err: any) {
      toast.error(err?.message || "Failed to duplicate task");
    }
  };

  useEffect(() => {
    if (view !== "calendar") return;
    const t = setTimeout(() => {
      const api = calendarRef.current?.getApi();
      if (api) setCurrentLabel(api.view.title);
    }, 100);
    return () => clearTimeout(t);
  }, [view]);

  const fetchFilteredTasks = async (newFilters: any) => {
    try {
      const data = await filterTasks(newFilters);
      const result = data.results ?? data;
      if (Array.isArray(result)) {
        setTasks(result);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const applyFilters = (newFilters: any) => {
    let updatedFilters = { ...filters };

    Object.keys(newFilters).forEach((key) => {
      if (newFilters[key] === "all") {
        delete updatedFilters[key];
      } else {
        updatedFilters[key] = newFilters[key];
      }
    });

    setFilters(updatedFilters);

    fetchFilteredTasks({
      ...updatedFilters,
      ...(search ? { search } : {}),
    });
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.task_id === event.active.id);
    setActiveTask(task ?? null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;

    if (!over) return;

    const taskId = String(active.id);
    const destStatus = String(over.id);

    const task = tasks.find((t) => t.task_id === taskId);
    if (!task || task.status === destStatus) return;

    setTasks((prev) =>
      prev.map((t) => (t.task_id === taskId ? { ...t, status: destStatus } : t))
    );

    try {
      await updateTaskStatus(taskId, destStatus);
    } catch (err) {
      console.error("Status update failed:", err);
      fetchTasks();
    }
  };

  return (
    <div>
      <HeaderSection />

      <div className="mt-2 flex justify-between items-center w-full">
        {/* LEFT */}
        <div>
          <h1 className="text-[20px] sm:text-[24px] lg:text-[28px] font-medium text-black">
            Planner
          </h1>
          <p className="text-[12px] sm:text-[14px] text-gray-600">
            Manage all your tasks at one place
          </p>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3 flex-wrap ml-auto mr-4">
          <Button
            variant="outline"
            className="rounded-full border-gray-300 text-sm whitespace-nowrap"
            onClick={() =>
              import("sonner").then(({ toast }) =>
                toast("Work Items by AI is coming soon.")
              )
            }
          >
            <Star className="w-4 h-4 mr-2" />
            Work Items by AI
          </Button>

          {view === "calendar" && (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handlePrev}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div className="flex items-center gap-2 px-3 py-1 border border-gray-300 rounded-full">
                <Calendar className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-700">{currentLabel}</span>
              </div>
              <Button variant="outline" size="sm" onClick={handleNext}>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          )}

          <Select onValueChange={(value) => applyFilters({ due_quarter: value })}>
            <SelectTrigger className="w-[130px] rounded-full border-gray-300 text-sm">
              <SelectValue placeholder="Quarter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Quarters</SelectItem>
              <SelectItem value="1">Q1</SelectItem>
              <SelectItem value="2">Q2</SelectItem>
              <SelectItem value="3">Q3</SelectItem>
              <SelectItem value="4">Q4</SelectItem>
            </SelectContent>
          </Select>

          <Button
            className="bg-[#1a2c47] text-white rounded-full px-4 py-2 hover:bg-[#2a3c57] text-sm whitespace-nowrap"
            onClick={() => openCreateTask()}
          >
            <Plus className="w-4 h-4 mr-1 sm:mr-2" />
            New Task
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-4">
        <div className="border rounded-sm border-gray-200 bg-white p-6">
          <h1 className="text-xl mb-4">Total Tasks</h1>
          <h1 className="text-4xl">24</h1>
        </div>

        <div className="border rounded-sm border-gray-200 bg-white p-6">
          <h1 className="text-xl mb-4">To Do</h1>
          <h1 className="text-4xl">8</h1>
        </div>

        <div className="border rounded-sm border-gray-200 bg-white p-6">
          <h1 className="text-xl mb-4">In Progress</h1>
          <h1 className="text-4xl">6</h1>
        </div>

        <div className="border rounded-sm border-gray-200 bg-white p-6">
          <h1 className="text-xl mb-4">Completed</h1>
          <h1 className="text-4xl">7</h1>
        </div>

        <div className="border rounded-sm border-gray-200 bg-white p-6">
          <h1 className="text-xl mb-4">Blocked</h1>
          <h1 className="text-4xl">3</h1>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap mt-4 px-2">
        {/* SEARCH */}
        <div className="relative flex-1 lg:flex-none lg:w-80">
          <Input
            placeholder="Search Tasks"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              fetchFilteredTasks({
                ...filters,
                search: e.target.value,
              });
            }}
            className="pl-10 rounded-full border-gray-300 text-sm"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        </div>

        {/* STATUS FILTER */}
        <Select onValueChange={(value) => applyFilters({ status: value })}>
          <SelectTrigger className="w-[160px] rounded-full border border-gray-300">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="to_do">To Do</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="in_review">In Review</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>

        {/* PRIORITY FILTER */}
        <Select onValueChange={(value) => applyFilters({ priority: value })}>
          <SelectTrigger className="w-[160px] rounded-full border border-gray-300">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>

        {/* MARKETING TYPE FILTER */}
        <Select onValueChange={(value) => applyFilters({ marketing_type: value })}>
          <SelectTrigger className="w-[160px] rounded-full border border-gray-300">
            <SelectValue placeholder="Marketing Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="social">Social</SelectItem>
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="seo">SEO</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex flex-col">
          <label className="font-normal ml-3">Due After</label>
          <input
            type="date"
            onChange={(e) =>
              applyFilters({ due_after: e.target.value || "all" })
            }
            className="border rounded-full px-3 py-2 text-sm"
          />
        </div>

        <div className="flex flex-col w-[160px]">
          <label className="font-normal ml-3">Due Before</label>
          <input
            type="date"
            onChange={(e) =>
              applyFilters({ due_before: e.target.value || "all" })
            }
            className="border rounded-full px-3 py-2 text-sm"
          />
        </div>

        <div className="flex items-center gap-2 ml-auto mr-10">
          <Button
            size="sm"
            variant={view === "kanban" ? "default" : "outline"}
            className={`rounded-full ${view === "kanban"
              ? "bg-[#1a2c47] text-white border-[#1a2c47] hover:bg-[#1a2c47]"
              : "border-gray-300 text-gray-700 bg-white hover:bg-gray-100"
              }`}
            onClick={() => setView("kanban")}
          >
            Kanban View
          </Button>

          <Button
            size="sm"
            variant={view === "calendar" ? "default" : "outline"}
            className={`rounded-full ${view === "calendar"
              ? "bg-[#1a2c47] text-white border-[#1a2c47] hover:bg-[#1a2c47]"
              : "border-gray-300 text-gray-700 bg-white hover:bg-gray-100"
              }`}
            onClick={() => setView("calendar")}
          >
            <CalendarIcon className="w-4 h-4 mr-1" /> Calendar View
          </Button>

          <Button
            size="sm"
            variant={view === "list" ? "default" : "outline"}
            className={`rounded-full ${view === "list"
              ? "bg-[#1a2c47] text-white border-[#1a2c47] hover:bg-[#1a2c47]"
              : "border-gray-300 text-gray-700 bg-white hover:bg-gray-100"
              }`}
            onClick={() => setView("list")}
          >
            <List className="w-4 h-4 mr-1" /> List View
          </Button>
        </div>
      </div>

      {view === "kanban" && (
        <div className="bg-gray-100">
          <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="grid grid-cols-4 gap-4 mt-6">
              {columns.map((col) => (
                <KanbanColumn
                  key={col.key}
                  col={col}
                  tasks={tasks}
                  onTaskClick={(task: any) => goToTask(task.task_id)}
                />
              ))}
            </div>

            <DragOverlay>
              {activeTask ? (
                <TaskCard task={activeTask} onClick={() => {}} />
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>
      )}

      {view === "list" && (
        <div className="mt-6 space-y-4">
          {Array.isArray(tasks) && tasks.length > 0 ? (
            tasks.map((task) => (
              <Card
                key={task.task_id}
                className="bg-white border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => goToTask(task.task_id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg text-black">{task.title}</h3>
                        {getTaskStatusBadge(task.status)}
                        {getPriorityBadge(task.priority)}
                      </div>
                      <div className="text-sm text-gray-600 mb-3">
                        {renderHtmlContent(task.description)}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600 flex-wrap">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Due {task.due_date}
                        </div>
                        {task.campaign_title && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {task.campaign_title}
                          </div>
                        )}
                        {task.assigned_to_name && (
                          <div className="flex items-center gap-1">
                            Assigned to {task.assigned_to_name}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs capitalize">
                        {task.marketing_type}
                      </Badge>
                    </div>
                    <span className="text-xs text-gray-500">{task.due_date}</span>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center text-sm text-gray-500 py-10">
              No tasks found.
            </div>
          )}
        </div>
      )}

      {view === "calendar" && (
        <div className="mt-6" style={{ height: "330vh", width: "100%" }}>
          <CalendarApp
            calendarRef={calendarRef}
            items={tasks}
            mapItem={taskToCalendarItem}
            onEventClick={goToTask}
            onCreateClick={openCreateTask}
          />
        </div>
      )}

      {/* Create / edit task — shared EventDialog in "planner" mode */}
      <EventDialog
        open={dialogOpen}
        mode={isCreateMode ? "create" : "update"}
        entity="planner"
        campaignOptions={campaignOptions}
        history={taskHistory}
        form={dialogForm}
        teamOptions={TEAM_OPTIONS}
        onClose={closeDialog}
        onSave={handleDialogSave}
        onDelete={handleDialogDelete}
        onDuplicate={handleDialogDuplicate}
        onFormChange={(val) =>
          setDialogForm((prev) =>
            typeof val === "function" ? val(prev) : { ...prev, ...val }
          )
        }
      />
    </div>
  );
};

export default PlannerPage;
