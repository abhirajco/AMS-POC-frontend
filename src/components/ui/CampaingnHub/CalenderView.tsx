// // import { useState, useRef } from "react";
// // import FullCalendar from "@fullcalendar/react";
// // import dayGridPlugin from "@fullcalendar/daygrid";
// // import interactionPlugin from "@fullcalendar/interaction";
// // import { useCampaign } from "@/store/useCampaign";
// // import CreateCampaignDialog from "./CreateCampaign";

// // // Map campaign type/status to a color
// // const TYPE_COLORS: Record<string, string> = {
// //   campaign: "#1a2c47",
// //   webinar: "#0e7490",
// //   workshop: "#7c3aed",
// //   training: "#b45309",
// //   meeting: "#15803d",
// //   Campaign: "#1a2c47",
// // };

// // const STATUS_BORDER: Record<string, string> = {
// //   upcoming: "#60a5fa",
// //   in_progress: "#34d399",
// //   past: "#9ca3af",
// //   planning: "#f59e0b",
// // };

// // const PRIORITY_DOT: Record<string, string> = {
// //   high: "#ef4444",
// //   medium: "#f59e0b",
// //   low: "#22c55e",
// // };

// // export default function CampaignCalendarView() {
// //   const campaigns = useCampaign((s: any) => s.campaigns);

// //   const [isCreateOpen, setIsCreateOpen] = useState(false);
// //   const [selectedDate, setSelectedDate] = useState<string | null>(null);

// //   const calendarRef = useRef<any>(null);

// //   // Convert campaigns → FullCalendar events
// //   const events = (campaigns ?? []).map((c: any) => ({
// //     id: c.campaign_id,
// //     title: c.title,
// //     start: c.start_date,
// //     end: c.end_date
// //       ? (() => {
// //           // FullCalendar end date for allDay events is exclusive, so add 1 day
// //           const d = new Date(c.end_date);
// //           d.setDate(d.getDate() + 1);
// //           return d.toISOString().split("T")[0];
// //         })()
// //       : undefined,
// //     allDay: true,
// //     backgroundColor: TYPE_COLORS[c.campaign_type] ?? "#1a2c47",
// //     borderColor: STATUS_BORDER[c.status] ?? "#60a5fa",
// //     extendedProps: {
// //       campaign_type: c.campaign_type,
// //       priority: c.priority,
// //       status: c.status,
// //       location: c.location,
// //       description: c.description,
// //       created_by_name: c.created_by_name,
// //     },
// //   }));

// //   const renderEventContent = (eventInfo: any) => {
// //     const { priority } = eventInfo.event.extendedProps;

// //     return (
// //       <div
// //         style={{
// //           display: "flex",
// //           alignItems: "center",
// //           gap: "6px",
// //           padding: "4px 6px",
// //           overflow: "hidden",
// //           width: "100%",
// //         }}
// //       >
// //         <span
// //           style={{
// //             width: 7,
// //             height: 7,
// //             borderRadius: "50%",
// //             backgroundColor: PRIORITY_DOT[priority] ?? "#9ca3af",
// //             flexShrink: 0,
// //           }}
// //         />

// //         <span
// //           style={{
// //             fontSize: "12px",
// //             fontWeight: 600,
// //             whiteSpace: "nowrap",
// //             overflow: "hidden",
// //             textOverflow: "ellipsis",
// //             color: "#fff",
// //           }}
// //         >
// //           {eventInfo.event.title}
// //         </span>
// //       </div>
// //     );
// //   };

// //   // Custom day cell
// //   const dayCellContent = (arg: any) => {
// //     return (
// //       <div
// //         style={{
// //           display: "flex",
// //           justifyContent: "space-between",
// //           alignItems: "flex-start",
// //           width: "100%",
// //           padding: "6px 8px",
// //         }}
// //       >
// //         {/* DATE */}
// //         <span
// //           style={{
// //             fontSize: "14px",
// //             fontWeight: 700,
// //             color: "#374151",
// //           }}
// //         >
// //           {arg.dayNumberText}
// //         </span>

// //         {/* + BUTTON */}
// //         <button
// //           onClick={(e) => {
// //             e.stopPropagation();

// //             setSelectedDate(arg.date.toISOString().split("T")[0]);

// //             setIsCreateOpen(true);
// //           }}
// //           style={{
// //             background: "none",
// //             border: "none",
// //             cursor: "pointer",
// //             fontSize: "18px",
// //             lineHeight: 1,
// //             padding: "2px 6px",
// //             borderRadius: "6px",
// //             display: "flex",
// //             alignItems: "center",
// //             justifyContent: "center",
// //             opacity: 0,
// //             color: "#1a2c47",
// //             transition: "all 0.2s ease",
// //           }}
// //           title="Create Campaign"
// //           aria-label="Create Campaign"
// //         >
// //           +
// //         </button>
// //       </div>
// //     );
// //   };

// //   return (
// //     <>
// //       <style>{`
// //         .campaign-calendar .fc {
// //           font-family: 'Inter', system-ui, sans-serif;
// //           width: 100%;
// //         }

// //         .campaign-calendar .fc-toolbar-title {
// //           font-size: 1.15rem;
// //           font-weight: 700;
// //           color: #1a2c47;
// //         }

// //         .campaign-calendar .fc-button {
// //           background: #1a2c47 !important;
// //           border-color: #1a2c47 !important;
// //           box-shadow: none !important;
// //           font-size: 12px !important;
// //           padding: 5px 12px !important;
// //           border-radius: 6px !important;
// //         }

// //         .campaign-calendar .fc-button:hover {
// //           background: #243d61 !important;
// //         }

// //         .campaign-calendar .fc-button-active {
// //           background: #0f1e30 !important;
// //         }

// //         .campaign-calendar .fc-col-header-cell {
// //           background: #f8fafc;
// //           border-bottom: 2px solid #e2e8f0 !important;
// //           padding: 10px 0 !important;
// //         }

// //         .campaign-calendar .fc-col-header-cell-cushion {
// //           font-size: 12px;
// //           font-weight: 600;
// //           color: #64748b;
// //           text-transform: uppercase;
// //           letter-spacing: 0.05em;
// //         }

// //         /* BIGGER CELLS */
// //         .campaign-calendar .fc-daygrid-day {
// //           height: 180px !important;
// //           min-height: 180px !important;
// //           vertical-align: top;
// //           transition: background 0.2s ease;
// //         }

// //         .campaign-calendar .fc-daygrid-day:hover {
// //           background: #f8fafc;
// //         }

// //         .campaign-calendar .fc-daygrid-day.fc-day-today {
// //           background: #fffbeb !important;
// //         }

// //         .campaign-calendar .fc-daygrid-day-top {
// //           flex-direction: row !important;
// //         }

// //         /* SHOW + BUTTON ONLY ON HOVER */
// //         .campaign-calendar .fc-daygrid-day:hover button {
// //           opacity: 1 !important;
// //           background: #f1f5f9 !important;
// //           color: #1a2c47 !important;
// //         }

// //         /* EVENT STYLE */
// //         .campaign-calendar .fc-event {
// //           border-radius: 6px !important;
// //           border-left-width: 4px !important;
// //           border-top: none !important;
// //           border-right: none !important;
// //           border-bottom: none !important;
// //           cursor: pointer;
// //           margin-bottom: 4px !important;
// //           padding: 2px 0 !important;
// //         }

// //         .campaign-calendar .fc-event:hover {
// //           filter: brightness(1.08);
// //         }

// //         .campaign-calendar .fc-scrollgrid {
// //           border-radius: 12px;
// //           overflow: hidden;
// //           border-color: #e2e8f0 !important;
// //         }

// //         .campaign-calendar .fc td,
// //         .campaign-calendar .fc th {
// //           border-color: #e2e8f0 !important;
// //         }

// //         .campaign-calendar .fc-daygrid-event-harness {
// //           margin-left: 4px;
// //           margin-right: 4px;
// //         }
// //       `}</style>

// //       <div
// //         className="campaign-calendar"
// //         style={{
// //           background: "#fff",
// //           borderRadius: 12,
// //           boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
// //           padding: "10px",
// //           width: "100%",
// //           maxWidth: "1600px",
// //           margin: "0 auto",
// //         }}
// //       >
// //         <FullCalendar
// //           ref={calendarRef}
// //           plugins={[dayGridPlugin, interactionPlugin]}
// //           initialView="dayGridMonth"
// //           headerToolbar={{
// //             left: "prev,next today",
// //             center: "title",
// //             right: "dayGridMonth,dayGridWeek",
// //           }}
// //           events={events}
// //           eventContent={renderEventContent}
// //           dayCellContent={dayCellContent}
// //           height="auto"
// //           dayMaxEvents={3}
// //           eventDisplay="block"
// //         />
// //       </div>

// //       <CreateCampaignDialog
// //         open={isCreateOpen}
// //         setOpen={setIsCreateOpen}
// //         defaultDate={selectedDate}
// //       />
// //     </>
// //   );
// // }

// import { useEffect, useRef, useState } from "react";
// import FullCalendar from "@fullcalendar/react";
// import dayGridPlugin from "@fullcalendar/daygrid";
// import timeGridPlugin from "@fullcalendar/timegrid";
// import interactionPlugin from "@fullcalendar/interaction";
// import { useCampaign } from "@/store/useCampaign";
// import CreateCampaignDialog from "./CreateCampaign";

// // ================= COLORS =================

// const TYPE_COLORS: Record<string, string> = {
//   campaign: "#2563eb",
//   webinar: "#0f766e",
//   workshop: "#7c3aed",
//   training: "#ea580c",
//   meeting: "#16a34a",
//   Campaign: "#2563eb",
// };

// const STATUS_BORDER: Record<string, string> = {
//   upcoming: "#60a5fa",
//   in_progress: "#34d399",
//   past: "#9ca3af",
//   planning: "#f59e0b",
// };

// const PRIORITY_DOT: Record<string, string> = {
//   high: "#ef4444",
//   medium: "#f59e0b",
//   low: "#22c55e",
// };

// export default function CalendarApp() {
//   const campaigns = useCampaign((s: any) => s.campaigns);

//   const calendarRef = useRef<any>(null);

//   const [isCreateOpen, setIsCreateOpen] = useState(false);
//   const [selectedDate, setSelectedDate] = useState<string | null>(null);

//   // ================= EVENTS =================

//   const events = (campaigns ?? []).map((c: any) => ({
//     id: c.campaign_id,
//     title: c.title,
//     start: c.start_date,
//     end: c.end_date
//       ? (() => {
//           const d = new Date(c.end_date);
//           d.setDate(d.getDate() + 1);
//           return d.toISOString().split("T")[0];
//         })()
//       : undefined,
//     allDay: true,
//     backgroundColor: TYPE_COLORS[c.campaign_type] ?? "#2563eb",
//     borderColor: STATUS_BORDER[c.status] ?? "#60a5fa",

//     extendedProps: {
//       campaign_type: c.campaign_type,
//       priority: c.priority,
//       status: c.status,
//       location: c.location,
//       description: c.description,
//       created_by_name: c.created_by_name,
//     },
//   }));

//   // ================= TOOLBAR STYLING =================

//   const applyToolbarStyles = () => {
//     const toolbar = document.querySelector(
//       ".fc-header-toolbar"
//     ) as HTMLElement;

//     if (toolbar) {
//       toolbar.style.padding = "10px 14px";
//       toolbar.style.marginBottom = "8px";
//     }

//     const title = document.querySelector(
//       ".fc-toolbar-title"
//     ) as HTMLElement;

//     if (title) {
//       title.style.fontSize = "18px";
//       title.style.fontWeight = "700";
//       title.style.color = "#111827";
//     }
//   };

//   useEffect(() => {
//     applyToolbarStyles();
//   }, []);

//   // ================= EVENT UI =================

//   const renderEventContent = (eventInfo: any) => {
//     const { priority } = eventInfo.event.extendedProps;

//     return (
//       <div
//         style={{
//           display: "flex",
//           alignItems: "center",
//           gap: "6px",
//           width: "100%",
//           overflow: "hidden",
//         }}
//       >
//         <span
//           style={{
//             width: 7,
//             height: 7,
//             borderRadius: "50%",
//             background: PRIORITY_DOT[priority] ?? "#9ca3af",
//             flexShrink: 0,
//           }}
//         />

//         <span
//           style={{
//             fontSize: "12px",
//             fontWeight: 600,
//             color: "#fff",
//             whiteSpace: "nowrap",
//             overflow: "hidden",
//             textOverflow: "ellipsis",
//           }}
//         >
//           {eventInfo.event.title}
//         </span>
//       </div>
//     );
//   };

//   // ================= CUSTOM DATE CELL =================

//   const dayCellContent = (arg: any) => {
//     return (
//       <div
//         className="calendar-day-cell"
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "flex-start",
//           width: "100%",
//           padding: "8px",
//         }}
//       >
//         {/* DATE */}
//         <div
//           style={{
//             fontSize: "14px",
//             fontWeight: 700,
//             color: "#374151",
//           }}
//         >
//           {arg.dayNumberText}
//         </div>

//         {/* + BUTTON */}
//         <button
//           onClick={(e) => {
//             e.stopPropagation();

//             setSelectedDate(arg.date.toISOString().split("T")[0]);

//             setIsCreateOpen(true);
//           }}
//           className="calendar-add-btn"
//         >
//           +
//         </button>
//       </div>
//     );
//   };

//   // ================= HANDLERS =================

//   const handleEventClick = (info: any) => {
//     console.log("Clicked Event:", info.event);
//   };

//   const handleEventDrop = (info: any) => {
//     console.log("Dropped Event:", info.event);
//   };

//   const handleEventResize = (info: any) => {
//     console.log("Resized Event:", info.event);
//   };

//   return (
//     <>
//       {/* ================= STYLES ================= */}

//       <style>{`
//         .fc {
//           font-family: Inter, system-ui, sans-serif;
//         }

//         /* ================= CONTAINER ================= */

//         .fc-theme-standard .fc-scrollgrid {
//           border: 1px solid #e5e7eb;
//           border-radius: 14px;
//           overflow: hidden;
//         }

//         .fc td,
//         .fc th {
//           border-color: #e5e7eb !important;
//         }

//         /* ================= TOOLBAR ================= */

//         .fc-toolbar {
//           margin-bottom: 12px !important;
//         }

//         .fc-button {
//           background: white !important;
//           border: 1px solid #d1d5db !important;
//           color: #374151 !important;
//           box-shadow: none !important;
//           border-radius: 8px !important;
//           padding: 6px 12px !important;
//           font-size: 13px !important;
//           font-weight: 500 !important;
//         }

//         .fc-button:hover {
//           background: #f9fafb !important;
//         }

//         .fc-button-active {
//           background: #111827 !important;
//           border-color: #111827 !important;
//           color: white !important;
//         }

//         /* ================= HEADER DAYS ================= */

//         .fc-col-header-cell {
//           background: #f9fafb;
//           padding: 10px 0 !important;
//         }

//         .fc-col-header-cell-cushion {
//           font-size: 12px;
//           font-weight: 600;
//           text-transform: uppercase;
//           color: #6b7280;
//           letter-spacing: 0.05em;
//         }

//         /* ================= DATE CELLS ================= */

//         .fc-daygrid-day {
//   height: 540px !important;
//   min-height: 540px !important;
//   background: white;
//   transition: background 0.2s ease;
//   cursor: pointer;
// }

//         .fc-daygrid-day:hover {
//           background: #f9fafb;
//         }

//         .fc-day-today {
//           background: #eff6ff !important;
//         }

//         /* ================= DATE NUMBER ================= */

//         .fc-daygrid-day-number {
//           display: none !important;
//         }

//         .fc-daygrid-day-top {
//           flex-direction: row !important;
//         }

//         /* ================= + BUTTON ================= */

//         .calendar-add-btn {
//           opacity: 0;
//           border: none;
//           background: transparent;
//           cursor: pointer;
//           width: 26px;
//           height: 26px;
//           border-radius: 6px;
//           font-size: 18px;
//           color: #2563eb;
//           transition: all 0.2s ease;
//         }

//         .fc-daygrid-day:hover .calendar-add-btn {
//           opacity: 1;
//         }

//         .calendar-add-btn:hover {
//           background: #dbeafe;
//         }

//         /* ================= EVENTS ================= */

//         .fc-event {
//           border-radius: 8px !important;
//           border-top: none !important;
//           border-right: none !important;
//           border-bottom: none !important;
//           border-left-width: 4px !important;
//           padding: 4px 6px !important;
//           margin: 3px 5px !important;
//           cursor: pointer;
//           transition: all 0.2s ease;
//         }

//         .fc-event:hover {
//           transform: translateY(-1px);
//           filter: brightness(1.05);
//         }

//         .fc-daygrid-event-harness {
//           margin-top: 2px;
//         }

//         /* ================= MORE LINK ================= */

//         .fc-daygrid-more-link {
//           font-size: 12px;
//           font-weight: 600;
//           color: #2563eb;
//           margin-left: 8px;
//         }

//         /* ================= TIME GRID ================= */

//         .fc-timegrid-slot {
//           height: 60px !important;
//         }

//         .fc-timegrid-axis {
//           font-size: 12px;
//           color: #6b7280;
//         }
//       `}</style>

//       {/* ================= CALENDAR ================= */}

//       <div
//         style={{
//     height: "330vh",
//     width: "100%",
//     background: "#fff",
//     borderRadius: "16px",
//     padding: "12px",
//     boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
//   }}
//       >
//         <FullCalendar
//           ref={calendarRef}
//           plugins={[
//             dayGridPlugin,
//             timeGridPlugin,
//             interactionPlugin,
//           ]}
//           initialView="dayGridMonth"
//           editable
//           selectable
//           height="100%"
//           contentHeight="100%"
//           showNonCurrentDates={false}
//           fixedWeekCount={false}
//           dayMaxEvents={3}
//           eventDisplay="block"
//           headerToolbar={{
//             left: "prev,next today",
//             center: "title",
//             right: "dayGridMonth,timeGridWeek,timeGridDay",
//           }}
//           viewDidMount={applyToolbarStyles}
//           datesSet={applyToolbarStyles}
//           events={events}
//           eventContent={renderEventContent}
//           dayCellContent={dayCellContent}
//           eventClick={handleEventClick}
//           eventDrop={handleEventDrop}
//           eventResize={handleEventResize}
//         />
//       </div>

//       {/* ================= DIALOG ================= */}

//       <CreateCampaignDialog
//         open={isCreateOpen}
//         setOpen={setIsCreateOpen}
//         defaultDate={selectedDate}
//       />
//     </>
//   );
// }
import { Chip, Avatar } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useState, useCallback, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { EventClickArg, EventDropArg} from "@fullcalendar/core";
import { EventResizeDoneArg } from "@fullcalendar/interaction";
import { EventApi } from "@fullcalendar/core";
import { Typography } from "@mui/material";
import { Box } from "@mui/material";
//import { EditableField } from "./InlineEditableField";
import SaveIcon from "@mui/icons-material/Save";
import CreateCampaignDialog from "@/components/ui/CampaingnHub/CreateCampaign";
import { useCampaign } from "@/store/useCampaign";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AssignedTeamMember {
  id: number;
  name: string;
  role: string;
  initials: string;
}

export interface Milestone {
  id: number;
  title: string;
  assignedTo: string;
  dueDate: string;
  status: "Not Started" | "In Progress" | "Completed";
}

export interface CalendarEvent {
  id: number;
  title: string;
  type: "Campaign" | "Workshop" | "Meeting" | "Webinar" | "Content Release";
  status: "Planning" | "In Progress" | "Completed" | "Upcoming" | "Follow Up";
  priority: "Low" | "Medium" | "High";
  date: string;
  endDate?: string;
  eventDate: string;
  time: string;
  location: string;
  dueTime: string;
  description: string;
  assignedTeam: AssignedTeamMember[];
  milestones: Milestone[];
  relatedTaskId?: number;
}

// ─── Backend Campaign → CalendarEvent mapper ──────────────────────────────────

/**
 * Maps a raw backend campaign object to the CalendarEvent shape used by the UI.
 * Fields that don't exist in the backend are given sensible defaults.
 */
const mapCampaignToCalendarEvent = (campaign: any): CalendarEvent => {
  // Normalise status: backend uses snake_case / lowercase
  const statusMap: Record<string, CalendarEvent["status"]> = {
    upcoming: "Upcoming",
    in_progress: "In Progress",
    completed: "Completed",
    planning: "Planning",
    follow_up: "Follow Up",
    "follow up": "Follow Up",
  };

  // Normalise priority
  const priorityMap: Record<string, CalendarEvent["priority"]> = {
    low: "Low",
    medium: "Medium",
    high: "High",
  };

  // Normalise campaign_type → type
  const typeMap: Record<string, CalendarEvent["type"]> = {
    campaign: "Campaign",
    workshop: "Workshop",
    meeting: "Meeting",
    webinar: "Webinar",
    "content release": "Content Release",
    content_release: "Content Release",
  };

  const rawStatus = (campaign.status ?? "").toLowerCase();
  const rawPriority = (campaign.priority ?? "").toLowerCase();
  const rawType = (campaign.campaign_type ?? "").toLowerCase();

  // Build DD-MM-YYYY display string from "YYYY-MM-DD"
  const toDisplayDate = (iso: string): string => {
    if (!iso) return "";
    const parts = iso.split("-"); // ["2026","05","21"]
    if (parts.length !== 3) return iso;
    return `${parts[2]}-${parts[1]}-${parts[0]}`; // "21-05-2026"
  };

  return {
    // Use campaign_id hashed to a number as id (FullCalendar uses string ids anyway)
    id: campaign.campaign_id,
    title: campaign.title ?? "Untitled",
    type: typeMap[rawType] ?? "Campaign",
    status: statusMap[rawStatus] ?? "Upcoming",
    priority: priorityMap[rawPriority] ?? "Medium",
    date: campaign.start_date ?? "",
    endDate: campaign.end_date ?? undefined,
    eventDate: toDisplayDate(campaign.start_date ?? ""),
    time: "",          // Not in backend — left empty
    location: campaign.location ?? "",
    dueTime: campaign.end_date ?? "",
    description: campaign.description ?? "",
    assignedTeam: campaign.created_by_name
      ? [
          {
            id: 1,
            name: campaign.created_by_name,
            role: "Creator",
            initials: campaign.created_by_name
              .split(" ")
              .map((w: string) => w[0])
              .join("")
              .toUpperCase()
              .slice(0, 2),
          },
        ]
      : [],
    milestones: [],    // Not returned from list endpoint — leave empty
    relatedTaskId: undefined,
  };
};

// ─── Props ────────────────────────────────────────────────────────────────────

type Props = {
  calendarRef: React.RefObject<FullCalendar>;
};

// ─── Component ────────────────────────────────────────────────────────────────

const CalendarApp: React.FC<Props> = ({ calendarRef }) => {
  // ── Zustand ──────────────────────────────────────────────────────────────
  const campaigns = useCampaign((s: any) => s.campaigns);

  // ── Map backend campaigns → FullCalendar event objects ───────────────────
  const mapToCalendarEvents = useCallback((data: any[]) => {
    return (data ?? []).map((campaign) => {
      const ev = mapCampaignToCalendarEvent(campaign);
      return {
        id: String(ev.id),
        title: ev.title,
        start: ev.date,
        end: ev.endDate || undefined,
        allDay: true,
        extendedProps: ev,
      };
    });
  }, []);

  // ── Local state ───────────────────────────────────────────────────────────
  const [events, setEvents] = useState(() => mapToCalendarEvents(campaigns ?? []));
  const [selectedEvent, setSelectedEvent] = useState<EventApi | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState<Partial<CalendarEvent>>({});

  // CreateCampaign dialog
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [defaultDate, setDefaultDate] = useState<string>("");

  // Hover state for the + icon on date cells
  const hoveredDateRef = useRef<string | null>(null);

  // ── Sync events when campaigns change in store ────────────────────────────
  // (If your store is reactive, this effect keeps the calendar in sync)
  // useEffect(() => {
  //   setEvents(mapToCalendarEvents(campaigns ?? []));
  // }, [campaigns, mapToCalendarEvents]);

  // ── Color helpers (unchanged from original) ───────────────────────────────
  const getStatusChipSx = (status: CalendarEvent["status"]) => {
    const map: Record<CalendarEvent["status"], { bg: string; color: string }> = {
      Completed: { bg: "#dcfce7", color: "#16a34a" },
      "In Progress": { bg: "#dbeafe", color: "#2563eb" },
      Upcoming: { bg: "#ede9fe", color: "#7c3aed" },
      Planning: { bg: "#fef9c3", color: "#ca8a04" },
      "Follow Up": { bg: "#ffedd5", color: "#ea580c" },
    };
    const s = map[status];
    return { backgroundColor: s.bg, color: s.color, fontWeight: 600, border: "none" };
  };

  const getPriorityChipSx = (priority: CalendarEvent["priority"]) => {
    const map: Record<CalendarEvent["priority"], { bg: string; color: string }> = {
      High: { bg: "#fee2e2", color: "#dc2626" },
      Medium: { bg: "#fef3c7", color: "#d97706" },
      Low: { bg: "#dcfce7", color: "#16a34a" },
    };
    const p = map[priority];
    return { backgroundColor: p.bg, color: p.color, fontWeight: 600, border: "none" };
  };

  const getMilestoneChipSx = (status: Milestone["status"]) => {
    const map: Record<Milestone["status"], { bg: string; color: string }> = {
      Completed: { bg: "#1e293b", color: "#fff" },
      "In Progress": { bg: "#dbeafe", color: "#2563eb" },
      "Not Started": { bg: "#f1f5f9", color: "#64748b" },
    };
    const s = map[status];
    return { backgroundColor: s.bg, color: s.color, fontWeight: 600, fontSize: "0.7rem" };
  };

  // ── Event click → open detail modal ──────────────────────────────────────
  const handleEventClick = (info: EventClickArg) => {
    const ep = info.event.extendedProps as CalendarEvent;
    setSelectedEvent(info.event);
    setForm({ ...ep, date: info.event.startStr });
    setIsModalOpen(true);
  };

  // ── Save edits ────────────────────────────────────────────────────────────
  const handleSave = () => {
    if (!selectedEvent) return;
    setEvents((prev) =>
      prev.map((e) => {
        if (e.id !== selectedEvent.id) return e;
        const rawDate = form.date ?? e.extendedProps?.date;
        const eventDateStr = form.eventDate ?? e.extendedProps?.eventDate;
        let newDate = rawDate;
        if (eventDateStr) {
          const parts = eventDateStr.split("-");
          newDate =
            parts.length === 3 && parts[2].length === 4
              ? `${parts[2]}-${parts[1]}-${parts[0]}`
              : eventDateStr;
        }
        return {
          ...e,
          title: form.title ?? e.title,
          start: newDate,
          end: newDate,
          extendedProps: { ...e.extendedProps, ...form, date: newDate },
        };
      })
    );
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (!selectedEvent) return;
    setEvents((prev) => prev.filter((e) => e.id !== selectedEvent.id));
    setIsModalOpen(false);
  };

  const handleDuplicate = () => {
    if (!selectedEvent) return;
    const original = events.find((e) => e.id === selectedEvent.id);
    if (!original) return;
    setEvents((prev) => [
      ...prev,
      { ...original, id: String(Date.now()), title: `${original.title} (Copy)` },
    ]);
    setIsModalOpen(false);
  };

  const handleEventDrop = (info: EventDropArg) => {
    setEvents((prev) =>
      prev.map((e) =>
        e.id === info.event.id
          ? { ...e, start: info.event.startStr, end: info.event.endStr || "" }
          : e
      )
    );
  };

  const handleEventResize = (info: EventResizeDoneArg) => {
    setEvents((prev) =>
      prev.map((e) =>
        e.id === info.event.id
          ? { ...e, start: info.event.startStr, end: info.event.endStr || "" }
          : e
      )
    );
  };

  // ── Zoho-style + button on date hover ────────────────────────────────────
  /**
   * FullCalendar renders date cells as <td data-date="YYYY-MM-DD">.
   * We inject a + button into each cell header on mouseenter and remove it on
   * mouseleave using event delegation on the calendar wrapper div.
   */
  const calendarWrapperRef = useRef<HTMLDivElement>(null);

  const handleCalendarMouseOver = (e: React.MouseEvent<HTMLDivElement>) => {
    const cell = (e.target as HTMLElement).closest(
      ".fc-daygrid-day"
    ) as HTMLElement | null;
    if (!cell) return;

    const date = cell.dataset.date;
    if (!date || hoveredDateRef.current === date) return;

    // Remove any existing + buttons
    document
      .querySelectorAll(".calendar-add-btn")
      .forEach((el) => el.remove());

    hoveredDateRef.current = date;

    const frame = cell.querySelector(".fc-daygrid-day-frame") as HTMLElement | null;
    const topBar = cell.querySelector(".fc-daygrid-day-top") as HTMLElement | null;
    if (!frame || !topBar) return;

    // Create the + button
    const btn = document.createElement("button");
    btn.className = "calendar-add-btn";
    btn.dataset.date = date;
    btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`;
    btn.style.cssText = `
      position: absolute;
      top: 4px;
      right: 4px;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #6366f1;
      color: #fff;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 3px;
      opacity: 0;
      transition: opacity 0.15s ease;
      z-index: 10;
      box-shadow: 0 1px 4px rgba(99,102,241,0.35);
    `;

    // Ensure the cell has position: relative for absolute child
    frame.style.position = "relative";

    frame.appendChild(btn);

    // Fade in
    requestAnimationFrame(() => {
      btn.style.opacity = "1";
    });

    btn.addEventListener("click", (ev) => {
      ev.stopPropagation();
      setDefaultDate(date);
      setCreateDialogOpen(true);
    });
  };

  const handleCalendarMouseLeave = () => {
    document
      .querySelectorAll(".calendar-add-btn")
      .forEach((el) => el.remove());
    hoveredDateRef.current = null;
  };

  // ── Toolbar style injection (unchanged) ───────────────────────────────────
  const applyToolbarStyles = () => {
    const innerDiv = document.querySelector(
      ".fc-toolbar-chunk > div"
    ) as HTMLElement;
    if (innerDiv) {
      Object.assign(innerDiv.style, {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: "4px",
      });
    }
    const title = document.querySelector(".fc-toolbar-title") as HTMLElement;
    if (title) {
      Object.assign(title.style, {
        fontSize: "14px",
        fontWeight: "600",
        minWidth: "120px",
        maxWidth: "120px",
        textAlign: "center",
        whiteSpace: "nowrap",
      });
    }
  };

  const ep = selectedEvent?.extendedProps as CalendarEvent | undefined;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Inject cursor style for date cells */}
      <style>{`
        .fc-daygrid-day:hover .fc-daygrid-day-frame {
          background: rgba(99, 102, 241, 0.03);
          transition: background 0.15s;
        }
        .fc-daygrid-day-frame {
          position: relative !important;
        }
      `}</style>

      <div
        ref={calendarWrapperRef}
        style={{ height: "110vh", width: "100%" }}
        onMouseOver={handleCalendarMouseOver}
        onMouseLeave={handleCalendarMouseLeave}
      >
        <FullCalendar
          ref={calendarRef}
          headerToolbar={false}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          viewDidMount={applyToolbarStyles}
          datesSet={applyToolbarStyles}
          initialView="dayGridMonth"
          editable
          selectable
          height="100%"
          contentHeight="100%"
          events={events}
          eventClick={handleEventClick}
          eventDrop={handleEventDrop}
          eventResize={handleEventResize}
          showNonCurrentDates={false}
          fixedWeekCount={false}
          dayMaxEvents={true}
          eventDisplay="block"
          eventDataTransform={(eventData) => {
            const statusColors: Record<
              string,
              { backgroundColor: string; borderColor: string }
            > = {
              Planning: {
                backgroundColor: "#eab308",
                borderColor: "#ca8a04",
              },
              "In Progress": {
                backgroundColor: "#3b82f6",
                borderColor: "#2563eb",
              },
              Completed: {
                backgroundColor: "#16a34a",
                borderColor: "#15803d",
              },
              Upcoming: {
                backgroundColor: "#8b5cf6",
                borderColor: "#7c3aed",
              },
              "Follow Up": {
                backgroundColor: "#f97316",
                borderColor: "#ea580c",
              },
            };
            const colors =
              statusColors[eventData.extendedProps?.status] ?? {};
            return {
              ...eventData,
              ...colors,
              end: eventData.start,
              extendedProps: {
                ...eventData.extendedProps,
                originalEnd: eventData.end,
              },
            };
          }}
        />
      </div>

      {/* ── Create Campaign Dialog ──────────────────────────────────────────── */}
      <CreateCampaignDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        defaultDate={defaultDate}   // pass the clicked date if CreateCampaignDialog accepts it
      />
    </>
  );
};

export default CalendarApp;