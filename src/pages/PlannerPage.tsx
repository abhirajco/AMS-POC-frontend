import { useEffect, useState } from "react";
import { getTasks, updateTaskStatus, filterTasks } from "../api/taskApi";
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors, useDroppable, useDraggable, type DragEndEvent, type DragStartEvent,} from "@dnd-kit/core";
import HeaderSection from "@/components/common/HeaderSection";
import { Button } from "../components/ui/button";
import { Plus, Star, ArrowLeft, Calendar, Search } from "lucide-react";
import { Input } from "../components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "../components/ui/select";
import CreateTaskModal from "@/components/ui/CreateTaskModal";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import EditTaskModal from "@/components/ui/EditableTaskModel";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import CreateTask from "@/components/ui/PlannerHub/CreateTask";
import { getPriorityBadge } from "@/utils/helpers";
const localizer = momentLocalizer(moment);

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
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [filters, setFilters] = useState<any>({});
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"kanban" | "calendar" | "list">("kanban");
  const [activeTask, setActiveTask] = useState<any>(null);

  const sensors = useSensors(useSensor(PointerSensor));

  const fetchTasks = async () => {
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (err) {
      console.error(err);
    }
  };

  const events = Array.isArray(tasks)
    ? tasks
        .filter((t) => t.due_date)
        .map((task) => ({
          id: task.task_id,
          title: task.title,
          start: new Date(task.due_date),
          end: new Date(task.due_date),
          resource: task,
        }))
    : [];

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

          <CreateTaskModal
            isOpen={isCreateOpen}
            onClose={() => setIsCreateOpen(false)}
            onSuccess={fetchTasks}
          />

          <div className="rounded-full border border-gray-300 px-4 py-2 flex items-center gap-3">
            <button className="text-gray-700">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <Calendar className="w-4 h-4 text-gray-700" />
          </div>

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
            onClick={() => setIsCreateOpen(true)}
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
            variant={view === "kanban" ? "default" : "outline"}
            onClick={() => setView("kanban")}
            className="rounded-full text-sm"
          >
            Kanban
          </Button>

          <Button
            variant={view === "calendar" ? "default" : "outline"}
            onClick={() => setView("calendar")}
            className="rounded-full text-sm"
          >
            Calendar
          </Button>

          <Button
            variant={view === "list" ? "default" : "outline"}
            onClick={() => setView("list")}
            className="rounded-full text-sm"
          >
            List
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
                  onTaskClick={(task: any) => {
                    setSelectedTask(task);
                    setIsEditOpen(true);
                  }}
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
        <div className="mt-6 bg-white rounded-xl p-4">
          <div className="flex flex-col gap-2">
            {Array.isArray(tasks) &&
              tasks.map((task) => (
                <div
                  key={task.task_id}
                  className="flex items-center justify-between border rounded-xl p-3 hover:bg-gray-50 cursor-pointer"
                  onClick={() => {
                    setSelectedTask(task);
                    setIsEditOpen(true);
                  }}
                >
                  {/* LEFT */}
                  <div>
                    <h4 className="font-medium text-sm">{task.title}</h4>
                    <p className="text-xs text-gray-500">{task.description}</p>
                  </div>

                  {/* RIGHT */}
                  <div className="flex items-center gap-4 text-xs">
                    <span className="px-2 py-1 rounded bg-gray-100">
                      {task.status}
                    </span>
                    <span className="px-2 py-1 rounded bg-gray-100">
                      {task.priority}
                    </span>
                    <span>{task.due_date}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {view === "calendar" && (
        <div className="mt-6 bg-white rounded-xl p-4 h-[75vh]">
          <BigCalendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            views={["month"]}
            defaultView="month"
            style={{ height: "100%" }}
            onSelectEvent={(event: any) => {
              setSelectedTask(event.resource);
              setIsEditOpen(true);
            }}
          />
        </div>
      )}

      <EditTaskModal
        task={selectedTask}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSuccess={fetchTasks}
      />
    </div>
  );
};

export default PlannerPage;
