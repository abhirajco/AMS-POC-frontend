import { useEffect, useState } from "react";
import { getTasks, updateTaskStatus } from "../apis/taskApi";
import {DragDropContext,Droppable,Draggable,} from "react-beautiful-dnd";
import HeaderSection from "@/components/common/HeaderSection";
import { Button } from "../components/ui/button";
import {Plus,Star,ArrowLeft,Calendar,Kanban,} from "lucide-react";
import {Select,SelectContent,SelectItem,SelectTrigger,SelectValue,} from "../components/ui/select";
import CreateTaskModal from "@/components/ui/CreateTaskModal";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import EditTaskModal from "@/components/ui/EditableTaskModel";
import { filterTasks } from "../apis/taskApi";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import CreateTask from "@/components/ui/PlannerHub/CreateTask";

// const localizer = momentLocalizer(moment);

// const columns = [
//   { key: "to_do", title: "To Do" },
//   { key: "in_progress", title: "In Progress" },
//   { key: "completed", title: "Completed" },
//   { key: "blocked", title: "Blocked" },
//   //{ key: "approved", title: "Approved" },
// ];

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

//       <h4 className="font-semibold text-sm text-gray-800">
//         {task.title}
//       </h4>

//       <p className="text-xs text-gray-500 mt-1 line-clamp-2">
//         {task.description}
//       </p>

//       <div className="text-xs text-gray-600 mt-2">
//         {task.marketing_type}
//       </div>

//       <div className="text-xs text-gray-600 mt-1">
//         <CalendarTodayIcon fontSize="small" /> {task.due_date}
//       </div>

//       <div className="text-xs text-gray-600 mt-1">
//         User #{task.assigned_to_name}
//       </div>
//     </div>
//   );
// };

const PlannerPage = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [filters, setFilters] = useState<any>({});
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"kanban" | "calendar" | "list">("kanban");

  // Fetch tasks
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
        id: task.id,
        title: task.title,
        start: new Date(task.due_date),
        end: new Date(task.due_date),
        resource: task,
      }))
  : [];

  const fetchFilteredTasks = async (newFilters: any) => {
  try {
    const data = await filterTasks(newFilters);
      setTasks(data.results || data);
    console.log("Filtered API response:", data);
  } catch (err) {
    console.error(err);
  }
};

const applyFilters = (newFilters: any) => {
  let updatedFilters = { ...filters };

  Object.keys(newFilters).forEach((key) => {
    if (newFilters[key] === "all") {
      delete updatedFilters[key]; // remove filter
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

const handleDragEnd = async (result: any) => {
  const { source, destination, draggableId } = result;

  if (!destination) return;

  const sourceStatus = source.droppableId;
  const destStatus = destination.droppableId;

  if (sourceStatus === destStatus) return;

  // UI update
  const updatedTasks = tasks.map((task) =>
    task.id === Number(draggableId)
      ? { ...task, status: destStatus }
      : task
  );

  setTasks(updatedTasks);

  try {
    console.log("Updating status to:", destStatus);

    await updateTaskStatus(Number(draggableId), destStatus);
  } catch (err: any) {
    console.error("Error:", err);
    fetchTasks(); // rollback
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

          <Select>
            <SelectTrigger className="w-[130px] rounded-full border-gray-300 text-sm">
              <SelectValue placeholder="Quarter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Quarters</SelectItem>
              <SelectItem value="Q1">Q1 2025</SelectItem>
              <SelectItem value="Q2">Q2 2025</SelectItem>
              <SelectItem value="Q3">Q3 2025</SelectItem>
              <SelectItem value="Q4">Q4 2025</SelectItem>
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


  <div className="flex items-center gap-3 flex-wrap mt-4 px-2">
  {/* SEARCH */}
  <input
    type="text"
    placeholder="Search tasks..."
    value={search}
    onChange={(e) => {
      setSearch(e.target.value);

      fetchFilteredTasks({
        ...filters,
        search: e.target.value,
      });
    }}
    className="border rounded-full px-4 py-2 text-sm w-[200px]"
  />

  {/* STATUS FILTER */}
 <Select onValueChange={(value) => applyFilters({ status: value })}>
  <SelectTrigger className="w-[160px] rounded-full border border-gray-300">
    <SelectValue placeholder="Status" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="all">All Status</SelectItem>
    <SelectItem value="to_do">To Do</SelectItem>
    <SelectItem value="in_progress">In Progress</SelectItem>
    <SelectItem value="completed">Completed</SelectItem>
    <SelectItem value="blocked">Blocked</SelectItem>
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
{view === "kanban" && ( <div className="bg-gray-100">
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-4 gap-4 mt-6">
            {columns.map((col) => (
              <Droppable droppableId={col.key} key={col.key}>
                {(provided) => (
                  <div
                    className="bg-gray-100 rounded-xl p-3"
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    <h3 className="font-semibold mb-3">
                      {col.title}
                    </h3>

                    <div className="flex flex-col gap-3">
                      {tasks
                        .filter((t) => t.status === col.key)
                        .map((task, index) => (
                          <Draggable
                            key={task.id}
                            draggableId={String(task.id)}
                            index={index}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <TaskCard
                                  task={task}
                                  onClick={(task: any) => {
                                    setSelectedTask(task);
                                    setIsEditOpen(true);
                                  }}
                                />
                              </div>
                            )}
                          </Draggable>
                        ))}

                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>
{/* 
        <EditTaskModal
          task={selectedTask}
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          onSuccess={fetchTasks}
        /> */}
      </div>)}
     
      {view === "list" && (
  <div className="mt-6 bg-white rounded-xl p-4">
    <div className="flex flex-col gap-2">

      {Array.isArray(tasks) &&
        tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center justify-between border rounded-xl p-3 hover:bg-gray-50 cursor-pointer"
            onClick={() => {
              setSelectedTask(task);
              setIsEditOpen(true);
            }}
          >
            {/* LEFT */}
            <div>
              <h4 className="font-medium text-sm">{task.title}</h4>
              <p className="text-xs text-gray-500">
                {task.description}
              </p>
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

      //  Click event → open modal
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

      {/* DRAG CONTEXT */}
     
    </div>
  );
};

export default PlannerPage;
// import HeaderSection from "@/components/common/HeaderSection"
// import { Button } from "@/components/ui/button"
// import { Plus, Search, Calendar, Star, ArrowLeft, ArrowRight, X, Paperclip } from 'lucide-react';
// import { Select,  SelectContent, SelectItem, SelectTrigger, SelectValue  } from "@/components/ui/select";
// import CreateTask from "@/components/ui/PlannerHub/CreateTask";
// import Kanbanview from "@/components/ui/PlannerHub/Kanbanview";

// const PlannerPage = () => {
//   return (
//     <div className="bg-neutral-50 flex flex-col h-full">
//        <HeaderSection/>
//        <div className="px-4 sm:px-6 py-4 sm:py-6 bg-white">
//           <div>
//             <h1 className="text-[20px] sm:text-[24px] lg:text-[28px] font-medium text-black">Planner</h1>
//             <p className="text-[12px] sm:text-[14px] text-gray-600 mt-1">Manage all your tasks at one place</p>
//           </div>
//           <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
//              <div className="flex items-center gap-2">
//                <Button
//                 variant="outline"
//                 className="rounded-full border-gray-300 text-sm whitespace-nowrap"
//                 onClick={() => import('sonner').then(({ toast }) => toast('Work Items by AI is coming soon.'))}
//               >
//                 <Star className="w-4 h-4 mr-2" />
//                 Work Items by AI
//               </Button>
//               <div className="rounded-full border border-gray-300 px-4 py-2 flex items-center gap-3">
//                 <button aria-label="Previous Month"  className="text-gray-700">
//                   <ArrowLeft className="w-4 h-4" />
//                 </button>
//                 <Calendar className="w-4 h-4 text-gray-700" />
//                 <button aria-label="Next Month" className="text-gray-700">
//                   <ArrowRight className="w-4 h-4" />
//                 </button>
//               </div>
//              </div>
//               <Select >
//               <SelectTrigger className="w-full sm:w-auto min-w-[120px] rounded-full border-gray-300 text-sm">
//                 <SelectValue placeholder="Quarter" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">All Quarters</SelectItem>
//                 <SelectItem value="Q1">Q1 2025</SelectItem>
//                 <SelectItem value="Q2">Q2 2025</SelectItem>
//                 <SelectItem value="Q3">Q3 2025</SelectItem>
//                 <SelectItem value="Q4">Q4 2025</SelectItem>
//               </SelectContent>
//             </Select>
//             <Button
//               className="bg-[#1a2c47] text-white rounded-full px-4 py-2 hover:bg-[#2a3c57] text-sm whitespace-nowrap"
//               //onClick={() => setIsTaskDialogOpen(true)}
//             >
//               <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
//               New Task
//             </Button>
//           </div>
//        </div>
//        <Kanbanview/>
//     </div>
//   )
// }

// export default PlannerPage
