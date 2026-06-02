
import { TeamMember } from "./EditableAssignedTeams";




import { Attachment } from "../ui/Attachment";


import type { CampaignApi } from "@/pages/CampaignHubPage";


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
import { mockEvents } from "@/data/mockData";

import { useEffect } from "react";

import { EventDialog } from "./EventsComponent";
type Props = {
  calendarRef: React.RefObject<FullCalendar>;

  campaigns: CampaignApi[];
};

const CalendarApp: React.FC<Props> = ({ calendarRef,campaigns }) => {


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


useEffect(() => {
  if (!campaigns?.length) return;

  setEvents(
    mapCampaignsToCalendarEvents(
      campaigns,
    ),
  );
}, [campaigns]);




  const handleEventClick = (info: EventClickArg) => {



    const ep = info.event.extendedProps as CalendarEvent & {
      originalEnd?: string;
    };

         console.log("=== EVENT CLICKED ===");
  console.log("FullCalendar id:", info.event.id);
  console.log("extendedProps.id:", ep.id);
  console.log("title:", info.event.title);
  console.log("full extendedProps:", ep);
    setSelectedEvent(info.event);

    setForm({
      ...ep,
        effortOriginal:   ep.effortOriginal  ?? "",
  effortRemaining:  ep.effortRemaining ?? "",
  effortCompleted:  ep.effortCompleted ?? "",
      date: info.event.startStr, //  "2025-08-05" — correct ISO format
    });

    setIsModalOpen(true);
  };

   
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
        if (parts.length === 3 && parts[2].length === 4) {
          newDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
        } else {
          newDate = eventDateStr;
        }
      }

      return {
        ...e,
        title: form.title ?? e.title,
        start: newDate,
        end:   newDate,
        extendedProps: {
          ...e.extendedProps,
            effortOriginal:   form.effortOriginal  ?? e.extendedProps?.effortOriginal  ?? "",
  effortRemaining:  form.effortRemaining ?? e.extendedProps?.effortRemaining ?? "",
  effortCompleted:  form.effortCompleted ?? e.extendedProps?.effortCompleted ?? "",
          // ← explicit fields only, NO ...form spread
          id:               form.id               ?? e.extendedProps?.id,
          title:            form.title             ?? e.extendedProps?.title,
          type:             form.type              ?? e.extendedProps?.type,
          status:           form.status            ?? e.extendedProps?.status,
          priority:         form.priority          ?? e.extendedProps?.priority,
          date:             newDate,
          eventDate:        form.eventDate         ?? e.extendedProps?.eventDate,
          time:             form.time              ?? e.extendedProps?.time,
          location:         form.location          ?? e.extendedProps?.location,
          dueTime:          form.dueTime           ?? e.extendedProps?.dueTime,
          description:      form.description       ?? e.extendedProps?.description,
          comment:          form.comment           ?? e.extendedProps?.comment,
          assignedTeam:     form.assignedTeam      ?? e.extendedProps?.assignedTeam      ?? [],
          milestones:       form.milestones        ?? e.extendedProps?.milestones        ?? [],
          relatedTasks:     form.relatedTasks      ?? e.extendedProps?.relatedTasks      ?? [],
          relatedCampaigns: form.relatedCampaigns  ?? e.extendedProps?.relatedCampaigns  ?? [],
          // ← strip File objects before putting into FullCalendar
          attachments: (form.attachments ?? e.extendedProps?.attachments ?? []).map(
            (a: any) => {
              const { file, ...meta } = a;
              return meta;
            }
          ),
        },
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
      {
        ...original,
        id: String(Date.now()),
        title: `${original.title} (Copy)`,
      },
    ]);
    setIsModalOpen(false);
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
