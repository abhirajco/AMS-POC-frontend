
import { TeamMember } from "./EditableAssignedTeams";




import { Attachment } from "../ui/Attachment";


import type { CampaignApi } from "@/pages/CampaignHubPage";

import {useCampaign} from "@/store/useCampaign";

import AddIcon from "@mui/icons-material/Add";
import IconButton from "@mui/material/IconButton";
import { useNavigate } from "react-router-dom";


const TEAM_OPTIONS: TeamMember[] = [
  {
    id: 1,
    name: "John Doe",
    role: "Developer",
    initials: "JD",
  },
  {
    id: 2,
    name: "Sarah Khan",
    role: "Designer",
    initials: "SK",
  },
  {
    id: 3,
    name: "Mike Ross",
    role: "QA",
    initials: "MR",
  },
];

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

    effortOriginal:  string;
  effortRemaining: string;
  effortCompleted: string;

  type: "Campaign" | "Workshop" | "Meeting" | "Webinar" | "Content Release";
  status: "Planning" | "In Progress" | "Completed" | "Upcoming" | "Follow Up";
  priority: "Low" | "Medium" | "High";

  date: string;
  endDate?: string;
  startDate?:string;

  eventDate: string;
  time: string;
  location: string;
  dueTime: string;
  description: string;
  comment: string;

  assignedTeam: {
    id: number;
    name: string;
    role: string;
    initials: string;
  }[];

  milestones: {
    id: number;
    title: string;
    assignedTo: string;
    dueDate: string;
    status: "Not Started" | "In Progress" | "Completed";
  }[];

  // relatedTaskId?: number;
    relatedTasks: { id: number; label: string }[];
  relatedCampaigns: { id: number; label: string }[];
   attachments: Attachment[];
}


import { useState } from "react";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import { EventClickArg, EventDropArg } from "@fullcalendar/core";

import { EventResizeDoneArg } from "@fullcalendar/interaction";

import { EventApi } from "@fullcalendar/core";

import { useEffect } from "react";

import { EventDialog } from "./EventsComponent";
type Props = {
  calendarRef: React.RefObject<FullCalendar>;

  campaigns: CampaignApi[];

   onRefresh: () => Promise<void>;
};

const CalendarApp: React.FC<Props> = ({ calendarRef,campaigns,onRefresh,}) => {


  // const mapToCalendarEvents = (data: CalendarEvent[]) => {
  //   return data.map((e) => ({
  //     id: String(e.id),
  //     title: e.title,
  //     start: e.date,
  //     end: e.endDate || undefined,
  //     allDay: true,
  //     extendedProps: e,
  //   }));
  // };

   const {updateCampaignById,deleteCampaignById,createCampaignById,fetchHistoryById} = useCampaign();

// useEffect(() => {
//   fetchTeamMembers();
// }, []);

  const mapCampaignsToCalendarEvents = (
  campaigns: CampaignApi[],
) => {
  return campaigns.map((campaign) => ({
    id: campaign.campaign_id,

    title: campaign.title,

    start: campaign.start_date,

    end: campaign.end_date,

    allDay: true,

    extendedProps: {
      id: campaign.campaign_id,

      title: campaign.title,

      type:
        campaign.campaign_type === "webinar"
          ? "Webinar"
          : "Campaign",

      status:
        campaign.status === "in_progress"
          ? "In Progress"
          : campaign.status === "completed"
            ? "Completed"
            : campaign.status === "upcoming"
              ? "Upcoming"
              : "Planning",

      priority:
        campaign.priority === "high"
          ? "High"
          : campaign.priority === "medium"
            ? "Medium"
            : "Low",

      date: campaign.start_date,

      endDate: campaign.end_date,

      eventDate: campaign.start_date,

      location: campaign.location,

      description:
        campaign.description,

      time: "",

      dueTime: "",

      comment: "",

      assignedTeam: [],

      milestones: [],

      relatedTasks: [],

      relatedCampaigns: [],

      attachments: [],

      effortOriginal: "",

      effortRemaining: "",

      effortCompleted: "",
    },
  }));
};



  const [events, setEvents] = useState<any[]>([]);


  // const [events, setEvents] = useState(() => mapToCalendarEvents(mockEvents));
  const [selectedEvent, setSelectedEvent] = useState<EventApi | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [form, setForm] = useState<Partial<CalendarEvent>>({});
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [history,setHistory] = useState<any[]>([]);

  const [, setHoveredDate] = useState<string | null>(null);

const navigate = useNavigate();


useEffect(() => {
  if (!campaigns?.length) return;

  setEvents(
    mapCampaignsToCalendarEvents(
      campaigns,
    ),
  );
}, [campaigns]);




//   const handleEventClick = (info: EventClickArg) => {

// setIsCreateMode(false);

//     const ep = info.event.extendedProps as CalendarEvent & {
//       originalEnd?: string;
//     };

//          console.log("=== EVENT CLICKED ===");
//   console.log("FullCalendar id:", info.event.id);
//   console.log("extendedProps.id:", ep.id);
//   console.log("title:", info.event.title);
//   console.log("full extendedProps:", ep);
//     setSelectedEvent(info.event);

//     setForm({
//       ...ep,
//         effortOriginal:   ep.effortOriginal  ?? "",
//   effortRemaining:  ep.effortRemaining ?? "",
//   effortCompleted:  ep.effortCompleted ?? "",
//       date: info.event.startStr, //  "2025-08-05" — correct ISO format
//     });

//     setIsModalOpen(true);
//   };

   
//   const handleSave = async () => {
//   if (!selectedEvent) return;

//   if (isCreateMode) {
//   // create
// } else {
//       try {
//     const campaignId = String(form.id);

//     const payload = {
//       title: form.title,
//       description: form.description,
//       location: form.location,

//       start_date: form.date,
//       end_date: form.endDate,

//       priority: form.priority?.toLowerCase(),

//       status:
//         form.status === "In Progress"
//           ? "in_progress"
//           : form.status === "Follow Up"
//           ? "follow_up"
//           : form.status?.toLowerCase(),

//       campaign_type: form.type?.toLowerCase(),
//     };

//     await updateCampaignById(
//       campaignId,
//       payload
//     );
//   } catch (err){
//        console.log("Error in saving the edited capaign Data: ",err);
//   }
//   setEvents((prev) =>
//     prev.map((e) => {
//       if (e.id !== selectedEvent.id) return e;

//       const rawDate = form.date ?? e.extendedProps?.date;
//       const eventDateStr = form.eventDate ?? e.extendedProps?.eventDate;

//       let newDate = rawDate;

//       if (eventDateStr) {
//         const parts = eventDateStr.split("-");
//         if (parts.length === 3 && parts[2].length === 4) {
//           newDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
//         } else {
//           newDate = eventDateStr;
//         }
//       }

//       return {
//         ...e,
//         title: form.title ?? e.title,
//         start: newDate,
//         end:   newDate,
//         extendedProps: {
//           ...e.extendedProps,
//             effortOriginal:   form.effortOriginal  ?? e.extendedProps?.effortOriginal  ?? "",
//   effortRemaining:  form.effortRemaining ?? e.extendedProps?.effortRemaining ?? "",
//   effortCompleted:  form.effortCompleted ?? e.extendedProps?.effortCompleted ?? "",
//           // ← explicit fields only, NO ...form spread
//           id:               form.id               ?? e.extendedProps?.id,
//           title:            form.title             ?? e.extendedProps?.title,
//           type:             form.type              ?? e.extendedProps?.type,
//           status:           form.status            ?? e.extendedProps?.status,
//           priority:         form.priority          ?? e.extendedProps?.priority,
//           date:             newDate,
//           eventDate:        form.eventDate         ?? e.extendedProps?.eventDate,
//           time:             form.time              ?? e.extendedProps?.time,
//           location:         form.location          ?? e.extendedProps?.location,
//           dueTime:          form.dueTime           ?? e.extendedProps?.dueTime,
//           description:      form.description       ?? e.extendedProps?.description,
//           comment:          form.comment           ?? e.extendedProps?.comment,
//           assignedTeam:     form.assignedTeam      ?? e.extendedProps?.assignedTeam      ?? [],
//           milestones:       form.milestones        ?? e.extendedProps?.milestones        ?? [],
//           relatedTasks:     form.relatedTasks      ?? e.extendedProps?.relatedTasks      ?? [],
//           relatedCampaigns: form.relatedCampaigns  ?? e.extendedProps?.relatedCampaigns  ?? [],
//           // ← strip File objects before putting into FullCalendar
//           attachments: (form.attachments ?? e.extendedProps?.attachments ?? []).map(
//             (a: any) => {
//               const { file, ...meta } = a;
//               return meta;
//             }
//           ),
//         },
//       };
//     })
//   );

// }


//   setIsModalOpen(false);
// };

const handleEventClick = async (info: EventClickArg) => {
  setIsCreateMode(false);

  const ep = info.event.extendedProps as CalendarEvent & {
    originalEnd?: string;
  };

  // console.log("=== EVENT CLICKED ===");
  // console.log("FullCalendar id:", info.event.id);
  // console.log("extendedProps.id:", ep.id);
  // console.log("title:", info.event.title);
  // console.log("full extendedProps:", ep);

  console.log("In the calendar componenet we are seeing the epobjecrt which is set into the form &^&^&^", ep)
  console.log("In the calendar componenet we are seeing the epobjecrt which is set into the form &^&^&^", info.event)
  setSelectedEvent(info.event);



  setForm({
    ...ep,
    startDate:ep.eventDate,
    endDate:ep.endDate,
    effortOriginal: ep.effortOriginal ?? "",
    effortRemaining: ep.effortRemaining ?? "",
    effortCompleted: ep.effortCompleted ?? "",
    date: info.event.startStr,
  });

  try {
    await fetchHistoryById(String(ep.id));
console.log(
  "History from store:",
  useCampaign.getState().history
);

 setHistory(useCampaign.getState().history);
  } catch (error) {
    console.error("Failed to fetch history", error);
  }

  setIsModalOpen(true);
};

const handleSave = async () => {
  try {
    if (isCreateMode) {
      const payload = {
        title: form.title,
        description: form.description,

        start_date: form.date,
        end_date: form.endDate || form.date,

        location: form.location,

        priority: form.priority?.toLowerCase(),

        status:
          form.status === "In Progress"
            ? "in_progress"
            : form.status === "Follow Up"
            ? "follow_up"
            : form.status?.toLowerCase(),

        campaign_type: form.type?.toLowerCase(),
      };

      await createCampaignById(payload);

      await onRefresh();
    

      setIsModalOpen(false);

      setIsCreateMode(false);

      navigate(-1); 
      return;
    }

    // ===== Existing Update Logic =====

    if (!selectedEvent) return;

    const campaignId = String(form.id);

    const payload = {
      title: form.title,
      description: form.description,

      start_date: form.date,
      end_date: form.endDate || form.date,

      location: form.location,

      priority: form.priority?.toLowerCase(),

      status:
        form.status === "In Progress"
          ? "in_progress"
          : form.status === "Follow Up"
          ? "follow_up"
          : form.status?.toLowerCase(),

      campaign_type: form.type?.toLowerCase(),
    };

    await updateCampaignById(campaignId, payload);

    // await fetchCampaigns();
    await onRefresh();

    setIsModalOpen(false);
  } catch (error) {
    console.error("Error saving campaign:", error);
  }
};

  
  const handleDelete = async () => {
    if (!selectedEvent) return;
      try {
    const campaignId = String(form.id);

    await deleteCampaignById(campaignId);

    await onRefresh();

    setEvents((prev) =>
      prev.filter((e) => e.id !== selectedEvent.id)
    );

    setIsModalOpen(false);
  } catch (error) {
    console.error(
      "Error deleting campaign:",
      error
    );
  }
    setEvents((prev) => prev.filter((e) => e.id !== selectedEvent.id));
    setIsModalOpen(false);
  };

//   const handleDelete = async () => {
//   if (!selectedEvent) return;

//   try {
//     const campaignId = String(form.id);

//     await deleteCampaignById(campaignId);

//     setEvents((prev) =>
//       prev.filter((e) => e.id !== selectedEvent.id)
//     );

//     setIsModalOpen(false);
//   } catch (error) {
//     console.error(
//       "Error deleting campaign:",
//       error
//     );
//   }
// };

  // const handleDuplicate = () => {
  //   if (!selectedEvent) return;
  //   const original = events.find((e) => e.id === selectedEvent.id);
  //   if (!original) return;
  //   setEvents((prev) => [
  //     ...prev,
  //     {
  //       ...original,
  //       id: String(Date.now()),
  //       title: `${original.title} (Copy)`,
  //     },
  //   ]);
  //   setIsModalOpen(false);
  // };

const handleDuplicate = async () => {
  if (!selectedEvent) return;

  const original = events.find(
    (e) => e.id === selectedEvent.id
  );

  if (!original) return;

  try {
    await createCampaignById({
      title: `${original.title} (Copy)`,
      description:
        original.extendedProps?.description ?? "",

      campaign_type:
        original.extendedProps?.campaign_type ??
        original.extendedProps?.type?.toLowerCase(),

      start_date:
        original.extendedProps?.date,

      end_date:
        original.extendedProps?.endDate,

      location:
        original.extendedProps?.location ?? "",

      priority:
        original.extendedProps?.priority?.toLowerCase(),

      status:
        original.extendedProps?.status
          ?.toLowerCase()
          .replace(" ", "_"),
    });

    await onRefresh();

    setIsModalOpen(false);
  } catch (err) {
    console.error("Duplicate campaign failed", err);
  }
};
  

  const handleEventDrop = (info: EventDropArg) => {
    setEvents((prev) =>
      prev.map((e) =>
        e.id === info.event.id
          ? { ...e, start: info.event.startStr, end: info.event.endStr || "" }
          : e,
      ),
    );
  };

  const handleEventResize = (info: EventResizeDoneArg) => {
    setEvents((prev) =>
      prev.map((e) =>
        e.id === info.event.id
          ? { ...e, start: info.event.startStr, end: info.event.endStr || "" }
          : e,
      ),
    );
  };

  
const handleCreateClick = (date: string) => {
  setSelectedEvent(null);

  // const isCreateMode = !selectedEvent;

  setForm({
    title: "",
    description: "",
    comment: "",

    date,
    eventDate: date,

    location: "",
    dueTime: "",

    effortOriginal: "",
    effortRemaining: "",
    effortCompleted: "",

    assignedTeam: [],
    milestones: [],
    relatedTasks: [],
    relatedCampaigns: [],
    attachments: [],

    priority: "" as CalendarEvent["priority"],
    status: "" as CalendarEvent["status"],
    type: "" as CalendarEvent["type"],
  });

  setIsCreateMode(true);

  setIsModalOpen(true);
};


  // const selectedHistory = allHistory.filter((h) => h.eventId === form.id);

  // const ep = selectedEvent?.extendedProps as CalendarEvent & { originalEnd?: string } | undefined;
  const applyToolbarStyles = () => {
    const innerDiv = document.querySelector(
      ".fc-toolbar-chunk > div",
    ) as HTMLElement;
    if (innerDiv) {
      innerDiv.style.display = "flex";
      innerDiv.style.flexDirection = "row";
      innerDiv.style.alignItems = "center";
      innerDiv.style.gap = "4px";
    }

    const title = document.querySelector(".fc-toolbar-title") as HTMLElement;
    if (title) {
      title.style.fontSize = "14px";
      title.style.fontWeight = "600";
      title.style.minWidth = "120px";
      title.style.maxWidth = "120px";
      title.style.textAlign = "center";
      title.style.whiteSpace = "nowrap";
    }
  };
// const milestoneCount = form.milestones?.length ?? 0;
  return (
    <div style={{ height: "110vh", width: "100%" }}>
      <FullCalendar
          dayCellContent={(arg) => (
    // <div
    //   style={{
    //     position: "relative",
    //     height: "100%",
    //   }}
    // >
    //   <div>{arg.dayNumberText}</div>

    //   <button
    //     onClick={(e) => {
    //       e.stopPropagation();
    //       handleCreateClick();
    //     }}
    //     style={{
    //       top: 2,
    //       right: 2,
    //       border: "none",
    //       background: "transparent",
    //       cursor: "pointer",
    //     }}
    //   >
    //     +
    //   </button>
    // </div>
    <div
  style={{
   display: "flex",
   justifyContent: "flex-end",
    height: "100%",
  }}
  onMouseEnter={() => setHoveredDate(arg.date.toISOString())}
  onMouseLeave={() => setHoveredDate(null)}
>
  <div>{arg.dayNumberText}</div>

  {/* <button
    onClick={(e) => {
      e.stopPropagation();
     handleCreateClick(Date.now().toString());
    }}
    style={{
      position: "revert",
      top: 2,
      left: 2, // left side
      border: "none",
      background: "transparent",
      cursor: "pointer",
      opacity: hoveredDate === arg.date.toISOString() ? 1 : 0,
      transition: "opacity 0.2s ease",
    }}
  >
    +
  </button> */}
  <IconButton
  size="small"
  onClick={(e) => {
    e.stopPropagation();
    handleCreateClick(arg.dateStr);
  }}
  sx={{
    position: "absolute",
    top: 2,
    right: 2,
    width: 20,
    height: 20,
    opacity: 0,
    borderRadius: "50%",
    backgroundColor: "#0078d4",
    color: "#fff",

    ".fc-daygrid-day:hover &": {
      opacity: 1,
    },

    "&:hover": {
      backgroundColor: "#106ebe",
    },
  }}
>
  <AddIcon sx={{ fontSize: 14 }} />
</IconButton>
</div>
  )}
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
            Planning: { backgroundColor: "#eab308", borderColor: "#ca8a04" },
            "In Progress": {
              backgroundColor: "#3b82f6",
              borderColor: "#2563eb",
            },
            Completed: { backgroundColor: "#16a34a", borderColor: "#15803d" },
            Upcoming: { backgroundColor: "#8b5cf6", borderColor: "#7c3aed" },
            "Follow Up": { backgroundColor: "#f97316", borderColor: "#ea580c" },
          };
          const colors = statusColors[eventData.extendedProps?.status] ?? {};
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
          <EventDialog
            open={isModalOpen}
            history={history}
            form={form}
            teamOptions={TEAM_OPTIONS}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSave}
            onDelete={handleDelete}
            onDuplicate={handleDuplicate}
            onFormChange={(val) =>
              setForm((prev) =>
                typeof val === "function" ? val(prev) : { ...prev, ...val }
              )
            }
          />

    </div>
  );
};

export default CalendarApp;
