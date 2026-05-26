
import { TeamMember } from "./EditableAssignedTeams";

// import { RelatedItems } from "./RelatedItems";



// import { HistoryTab } from "./EventHistoryTwo";

// import { AttachmentTab, Attachment } from "../ui/Attachment";


import { Attachment } from "../ui/Attachment";
// import Timeline from "@mui/lab/Timeline";
// import TimelineItem from "@mui/lab/TimelineItem";
// import TimelineSeparator from "@mui/lab/TimelineSeparator";
// import TimelineConnector from "@mui/lab/TimelineConnector";
// import TimelineContent from "@mui/lab/TimelineContent";
// import TimelineDot from "@mui/lab/TimelineDot";
// import {IconButton} from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";

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

// const typeOptions = [
//   { label: "Campaign", value: "Campaign" },
//   { label: "Workshop", value: "Workshop" },
//   { label: "Meeting", value: "Meeting" },
//   { label: "Webinar", value: "Webinar" },
//   { label: "Content Release", value: "Content Release" },
// ];


// import RichTextEditor from "./CommentSection";
// import { Chip } from "@mui/material";
// import ContentCopyIcon from "@mui/icons-material/ContentCopy";
// // import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
// import { HistoryTab } from "./EventHistory";

// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   Button,
// } from "@mui/material";

import { EventClickArg, EventDropArg } from "@fullcalendar/core";

import { EventResizeDoneArg } from "@fullcalendar/interaction";

import { EventApi } from "@fullcalendar/core";
import { mockEvents } from "@/data/mockData";
// import { Typography } from "@mui/material";
// import { Box } from "@mui/material";

// import { EditableField } from "./InlineEditableField";
// import SaveIcon from "@mui/icons-material/Save";

// import { EditableAssignedTeam } from "./EditableAssignedTeams";
// import { Autocomplete } from "@mui/material";


import { EventDialog } from "./EventsComponent";

type Props = {
  calendarRef: React.RefObject<FullCalendar>;
};

const CalendarApp: React.FC<Props> = ({ calendarRef }) => {
  // const priorityOptions: {
  //   label: CalendarEvent["priority"];
  // }[] = [{ label: "Low" }, { label: "Medium" }, { label: "High" }];

  // const statusOptions: {
  //   label: CalendarEvent["status"];
  //   value: CalendarEvent["status"];
  // }[] = [
  //   { label: "Planning", value: "Planning" },
  //   { label: "In Progress", value: "In Progress" },
  //   { label: "Completed", value: "Completed" },
  //   { label: "Upcoming", value: "Upcoming" },
  //   { label: "Follow Up", value: "Follow Up" },
  // ];

  const mapToCalendarEvents = (data: CalendarEvent[]) => {
    return data.map((e) => ({
      id: String(e.id),
      title: e.title,
      start: e.date,
      end: e.endDate || undefined,
      allDay: true,
      extendedProps: e,
    }));
  };

  // const calendarRef = useRef<FullCalendar | null>(null);

  const [events, setEvents] = useState(() => mapToCalendarEvents(mockEvents));
  const [selectedEvent, setSelectedEvent] = useState<EventApi | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  

  // const [activePage, setActivePage] = useState<
  //   "Details" | "Page1" | "Page2" | "Page3"
  // >("Page1");

  const [form, setForm] = useState<Partial<CalendarEvent>>({});

  // const getStatusChipSx = (status: CalendarEvent["status"]) => {
  //   const map: Record<CalendarEvent["status"], { bg: string; color: string }> =
  //     {
  //       Completed: { bg: "#dcfce7", color: "#16a34a" },
  //       "In Progress": { bg: "#dbeafe", color: "#2563eb" },
  //       Upcoming: { bg: "#ede9fe", color: "#7c3aed" },
  //       Planning: { bg: "#fef9c3", color: "#ca8a04" },
  //       "Follow Up": { bg: "#ffedd5", color: "#ea580c" },
  //     };
  //   const s = map[status];
  //   return {
  //     backgroundColor: s.bg,
  //     color: s.color,
  //     fontWeight: 600,
  //     border: "none",
  //   };
  // };

  // const getPriorityChipSx = (priority: CalendarEvent["priority"]) => {
  //   const map: Record<
  //     CalendarEvent["priority"],
  //     { bg: string; color: string }
  //   > = {
  //     High: { bg: "#fee2e2", color: "#dc2626" },
  //     Medium: { bg: "#fef3c7", color: "#d97706" },
  //     Low: { bg: "#dcfce7", color: "#16a34a" },
  //   };
  //   const p = map[priority];
  //   return {
  //     backgroundColor: p.bg,
  //     color: p.color,
  //     fontWeight: 600,
  //     border: "none",
  //   };
  // };



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
            {/* <Dialog
            open={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            fullWidth
            slotProps={{
              paper: {
                sx: {
                  maxWidth: "90vw",
                  height: "90vh",
                  maxHeight: "90vh",
                  pl:1,
                  pt:1
                },
              },
            }}
          >
            <DialogTitle
              sx={{
                pb: 1,
                pt: 2.5,
                px: 3,
                backgroundColor: "#ffffff",
                borderBottom: "1px solid #E5E7EB",

                borderLeft: "6px solid #1a2c47",
                borderRadius:"5px",
                "& .editable-field": {
                  fontSize: "32px",
                  fontWeight: 600,
                  lineHeight: 1.25,
                  color: "#1F2937",
                  letterSpacing: "-0.02em",
                },
              }}
            >

             
  <IconButton
    onClick={() => {
      setIsModalOpen(false);
    }}
    sx={{
      position: "absolute",
      top: 8,
      right: 8,
      color: "#6b7280",
      "&:hover": {
        backgroundColor: "#f3f4f6",
        color: "#111827",
      },
    }}
  >
    <CloseIcon sx={{ fontSize: 20 }} />
  </IconButton>


<Box
  sx={{
    fontSize: "1.5rem",
    fontWeight: 700,
    color: "#1F2937",
    pb: 2,
  }}
>
Campaign
</Box>
              

<Box
  sx={{
    pb: 2,
    "& input": {
      fontSize: "1.5rem !important",
      fontWeight: "700 !important",
      color: "#1F2937",
    },
    "& .MuiTypography-root": {
      fontSize: "1.5rem !important",
      fontWeight: "700 !important",
      color: "#1F2937",
    },
  }}
>
  <EditableField
    value={form.title ?? ""}
    onSave={(val) => setForm({ ...form, title: val })}
  />
</Box>

              <Box
                sx={{
                  display: "flex",
                  paddingBottom: 1,
                }}
              >
                <Typography
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    variant: "subtitle2",
                    fontWeight: 700,
                    paddingRight: 4,
                  }}
                >
                  Assigned Team
                </Typography>



                <EditableAssignedTeam
                  value={form.assignedTeam ?? []}
                  options={TEAM_OPTIONS}
                  onSave={(val) =>
                    setForm({
                      ...form,
                      assignedTeam: val,
                    })
                  }
                />
              </Box>

       
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  mt: 1.5,
                  flexWrap: "wrap",

                  "& .MuiChip-root": {
                    borderRadius: "4px",
                    height: 24,
                    fontSize: 12,
                    fontWeight: 500,
                  },

                  "& .MuiChip-filled": {
                    backgroundColor: "#EEF2FF",
                  },

                  "& .MuiChip-outlined": {
                    borderColor: "#D1D5DB",
                    backgroundColor: "#F9FAFB",
                  },
                }}
              >
                {form.status && (
                  <Chip
                    label={form.status}
                    size="small"
                    sx={getStatusChipSx(form.status)}
                  />
                )}

                {form.priority && (
                  <Chip
                    label={form.priority}
                    size="small"
                    sx={getPriorityChipSx(form.priority)}
                  />
                )}

                {form.type && (
                  <Chip label={form.type} size="small" variant="outlined" />
                )}
              </Box>
            </DialogTitle>

        

            <Box
              sx={{
                width: "100%",
                boxSizing: "border-box", 
                mt:2
              }}
            >
              <DialogContent
                sx={{
                  width: "100%",
                  padding: 0,
                  boxSizing: "border-box",
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    boxSizing: "border-box",
                  }}
                >
                  <Box
                    sx={{
                      backgroundColor: "#DADADA",
                      borderLeft: "6px solid #1a2c47", 
                      borderRadius:"5px", 
                      height:"20vh" 
                    }}
                  >
                   <Box
                   sx={{
                    paddingTop:2,
                    paddingBottom:2
                   }}>
                    <Typography
                      sx={{
                        fontSize:"1.2rem",
                        fontWeight: 700,
                        ml: 4,
                      }}
                    >
                      Event Details
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Box
                        sx={{
                          display: "grid",
                          gridTemplateColumns: "7fr 7fr",
                          gap: 2,
                          ml: 4,
                          mt: 2,
                          width: "80%",
                        }}
                      >
                        {[
              
                          {
                            label: "Date",
                            value: form.eventDate ?? "", // DD-MM-YYYY shown in display
                            onSave: (iso: string) => {
                              // receives YYYY-MM-DD from EditableField
                              const [y, m, d] = iso.split("-");
                              const display = `${d}-${m}-${y}`; // DD-MM-YYYY for showing
                              setForm((prev) => ({
                                ...prev,
                                date: iso, // YYYY-MM-DD for calendar positioning
                                eventDate: display, // DD-MM-YYYY for display
                              }));
                            },
                            type: "date",
                          },

                          {
                            label: "Location",
                            value: form.location ?? "",
                            onSave: (val: string) =>
                              setForm({ ...form, location: val }),
                          },
                          {
                            label: "Due",
                            value: form.dueTime ?? "",
                            onSave: (val: string) =>
                              setForm({ ...form, dueTime: val }),
                          },
                        ].map(({ label, value, onSave, type }) => (
                          <Box
                            key={label}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <Typography 
                            sx={{
                              fontSize:"1.1rem"
                            }}
                             color="text.secondary">
                              {label}:
                            </Typography>

                            <Box
                              sx={{
                                display:"flex",
                                ml: 2,
                              }}
                            >
                              <EditableField
                                fontSize="14px"
                                value={value}
                                onSave={onSave}
                                type={type}
                              />
                                {label === "Due" && (
                                  <Typography color="text.secondary">
                                    days
                                  </Typography>
                                )}
                            </Box>
                          </Box>
                        ))}
                      </Box>

                   
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "end",
                          width: "20%",
                          borderBottom: "1px solid #E1DFDD",
                        }}
                      >
                        <Button
                          variant="text"
                          onClick={() => setActivePage("Page1")}
                          sx={{
                            minWidth: "unset",
                            px: 2,
                            py: 1.2,
                            borderRadius: 0,
                            color:
                              activePage === "Page1" ? "#0078D4" : "#605E5C",
                            fontWeight: activePage === "Page1" ? 600 : 400,
                            fontSize: "14px",
                            textTransform: "none",
                            borderBottom:
                              activePage === "Page1"
                                ? "2px solid #0078D4"
                                : "2px solid transparent",

                            "&:hover": {
                              backgroundColor: "#F3F2F1",
                              borderBottom:
                                activePage === "Page1"
                                  ? "2px solid #0078D4"
                                  : "2px solid #C8C6C4",
                            },
                          }}
                        >
                          Details
                        </Button>

                        <Button
                          variant="text"
                          onClick={() => setActivePage("Page2")}
                          sx={{
                            minWidth: "unset",
                            px: 2,
                            py: 1.2,
                            borderRadius: 0,
                            color:
                              activePage === "Page2" ? "#0078D4" : "#605E5C",
                            fontWeight: activePage === "Page2" ? 600 : 400,
                            fontSize: "14px",
                            textTransform: "none",
                            borderBottom:
                              activePage === "Page2"
                                ? "2px solid #0078D4"
                                : "2px solid transparent",

                            "&:hover": {
                              backgroundColor: "#F3F2F1",
                              borderBottom:
                                activePage === "Page2"
                                  ? "2px solid #0078D4"
                                  : "2px solid #C8C6C4",
                            },
                          }}
                        >
                          History
                        </Button>

                        <Button
                          variant="text"
                          onClick={() => setActivePage("Page3")}
                          sx={{
                            px: 2,
                            py: 1.2,
                            borderRadius: 0,
                            color:
                              activePage === "Page3" ? "#0078D4" : "#605E5C",
                            fontWeight: activePage === "Page3" ? 600 : 400,
                            fontSize: "14px",
                            textTransform: "none",
                            borderBottom:
                              activePage === "Page3"
                                ? "2px solid #0078D4"
                                : "2px solid transparent",

                            "&:hover": {
                              backgroundColor: "#F3F2F1",
                              borderBottom:
                                activePage === "Page3"
                                  ? "2px solid #0078D4"
                                  : "2px solid #C8C6C4",
                            },
                          }}
                        >
                          Attachments
                        </Button>
                      </Box>
                    </Box>
                   </Box>
                  </Box>
                  {activePage === "Page1" && (
                    <Box
                      sx={{
                        display: "flex",
                      }}
                    >
                      <Box
                        sx={{
                          width: "60%",
                          mr: 1,
                        }}
                      >
                   
                        <Box
                          sx={{
                            borderLeft: "6px solid #1a2c47",
                            borderRadius:"5px", 
                            mt:2
                          }}
                        >
                          <Box
                            sx={{
                              ml: 4,
                            }}
                          >
                            <Typography
                              sx={{
                                variant: "subtitle2",
                                fontWeight: 700,
                              }}
                            >
                              Description
                            </Typography>
                            <Box
                              sx={{
                                paddingRight: 2,
                              }}
                            >
                              <RichTextEditor
                                value={form.description ?? ""}
                                onChange={(val) =>
                                  setForm((prev) => ({
                                    ...prev,
                                    description: val,
                                  }))
                                }
                              />
                            </Box>
                          </Box>
                        </Box>
                  
              
                        <Box
                          sx={{
                            borderLeft: "6px solid #1a2c47",
                            borderRadius:"5px", 
                            mt:2
                          }}
                        >
                          <Box
                            sx={{
                              ml: 4,
                            }}
                          >
                            <Typography
                              sx={{
                                variant: "subtitle2",
                                fontWeight: 700,
                              }}
                            >
                              Comment
                            </Typography>
                            <Box
                              sx={{
                                paddingRight: 2,
                              }}
                            >
                              <RichTextEditor
                                value={form.comment ?? ""}
                                onChange={(val) =>
                                  setForm((prev) => ({ ...prev, comment: val }))
                                }
                              />
                            </Box>
                          </Box>
                        </Box>


                      <Box
                          sx={{
                            borderLeft: "6px solid #1a2c47",
                            borderRadius:"5px", 
                            mt:2
                          }}
                        >
                      
                          <Typography
                        sx={{
                          fontSize:"1.2rem",
                          variant: "subtitle2",
                          fontWeight: 700,
                          ml:5,
                          mt:2
                        }}
                      >
                        Milestones
                      </Typography>


                  <Timeline
                    sx={{

                        borderBottom: "1px solid #e5e7eb",       
                      "& .MuiTimelineItem-root:before": {
                        flex: 0,
                        padding: 0,
                      },
                    }}
                  >
                    {form.milestones?.map((m, index) => (
                      <TimelineItem key={m.id}>
                        <TimelineSeparator>
                        <TimelineDot
                          sx={{
                            bgcolor: "#1a2c47",
                            color: "#fff",
                            width: 32,
                            height: 32,
                            fontWeight: 700,

                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",

                            p: 0,
                            m: 0,
                          }}
                        >
                          {index + 1}
                        </TimelineDot>
                          {index <milestoneCount - 1 && (
                            <TimelineConnector />
                          )}
                        </TimelineSeparator>

                        <TimelineContent>
                   
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            mb: 2,
                          }}
                        >
                          <EditableField
                            fontSize="1.2rem"
                            value={m.title}
                            onSave={(val) =>
                              setForm((prev) => ({
                                ...prev,
                                milestones: prev.milestones?.map((milestone) =>
                                  milestone.id === m.id
                                    ? { ...milestone, title: val }
                                    : milestone,
                                ),
                              }))
                            }
                          />

<Autocomplete
 forcePopupIcon={false}
  disableClearable
  options={[
    "Not Started",
    "In Progress",
    "Completed",
  ]}
  value={m.status}
  sx={{
    width: 150,

    "& .MuiOutlinedInput-root": {
      minHeight: 32,
      backgroundColor: "transparent",

      "& fieldset": {
        border: "1px solid transparent",
      },

      "&:hover fieldset": {
        borderColor: "#c8c8c8",
      },

      "&.Mui-focused fieldset": {
        borderColor: "#0078d4",
        borderWidth: "1px",
      },
    },

    "& .MuiAutocomplete-input": {
      fontSize: "0.85rem",
    },

    "& .MuiAutocomplete-popupIndicator": {
      opacity: 0,
      transition: "opacity 0.15s ease",
      color: "#605e5c",
    },

    "&:hover .MuiAutocomplete-popupIndicator": {
      opacity: 1,
    },

    "& .Mui-focused .MuiAutocomplete-popupIndicator": {
      opacity: 1,
    },
  }}
  slotProps={{
    paper: {
      sx: {
        "& .MuiAutocomplete-option.Mui-focused": {
          backgroundColor: "#f3f2f1",
        },

        "& .MuiAutocomplete-option[aria-selected='true']": {
          backgroundColor: "#e1dfdd",
          color: "#111827",
        },

        "& .MuiAutocomplete-option[aria-selected='true'].Mui-focused":
          {
            backgroundColor: "#d2d0ce",
          },
      },
    },
  }}
  onChange={(_, value) =>
    setForm((prev) => ({
      ...prev,
      milestones: prev.milestones?.map((milestone) =>
        milestone.id === m.id
          ? {
              ...milestone,
              status: value as Milestone["status"],
            }
          : milestone,
      ),
    }))
  }
  renderInput={(params) => (
    <TextField
      {...params}
      size="small"
    />
  )}
/>
                        </Box>

                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 1.5,
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Typography
                              sx={{
                                fontWeight: 600,
                                color: "#374151",
                                minWidth: 100,
                              }}
                            >
                              Assigned To:
                            </Typography>

                            <EditableField

                              value={m.assignedTo}
                              onSave={(val) =>
                                setForm((prev) => ({
                                  ...prev,
                                  milestones: prev.milestones?.map((milestone) =>
                                    milestone.id === m.id
                                      ? { ...milestone, assignedTo: val }
                                      : milestone,
                                  ),
                                }))
                              }
                            />
                          </Box>

                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Typography
                              sx={{
                                fontWeight: 600,
                                color: "#374151",
                                minWidth: 100,
                              }}
                            >
                              Due Date:
                            </Typography>

                            <EditableField
                              value={m.dueDate}
                              type="date"
                              onSave={(val) =>
                                setForm((prev) => ({
                                  ...prev,
                                  milestones: prev.milestones?.map((milestone) =>
                                    milestone.id === m.id
                                      ? { ...milestone, dueDate: val }
                                      : milestone,
                                  ),
                                }))
                              }
                            />
                          </Box>
                        </Box>
                        </TimelineContent>
                      </TimelineItem>
                    ))}
                  </Timeline>
                      </Box>


                   

                        <Box
                          sx={{
                            borderLeft: "6px solid #1a2c47",
                            borderRadius:"5px",
                            mt:2
                          }}
                        >
                      <RelatedItems
                        tasks={form.relatedTasks ?? []}
                        campaigns={form.relatedCampaigns ?? []}
                        onTasksChange={(val) => setForm((prev) => ({ ...prev, relatedTasks: val }))}
                        onCampaignsChange={(val) => setForm((prev) => ({ ...prev, relatedCampaigns: val }))}
                      />
                    </Box>
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          width: "40%",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            width: "50%",
                            mt:2,
                          }}
                        >
                          <Box
                            sx={{
                              height: "30%",
                              display: "flex",
                              flexDirection: "column",
                              pl:1,
                              pb:1
                            }}
                          >
                            <h1>Planning</h1>

                            <Box
                            sx={{
                              mb:1
                            }}>
                          
                              <Typography
                                variant="caption"
                                sx={{
                                  color: "text.secondary",
                                  fontWeight: 600,
                                  display: "block",
                                  mb: 0.5,
                                }}
                              >
                                Priority 
                              </Typography>
                              <Autocomplete
                              disableClearable
                              forcePopupIcon={false}
                                size="small"
                                options={priorityOptions}
                                getOptionLabel={(option) => option.label}
                                value={
                                  priorityOptions.find(
                                    (option) => option.label === form.priority,
                                  ) ?? undefined
                                }
                                onChange={(_, value) =>
                                  setForm((prev) => ({
                                    ...prev,
                                    priority: value?.label,
                                  }))
                                }
                                sx={{
                                  minWidth: 180,

                                  "& .MuiOutlinedInput-notchedOutline": {
                                    border: "1px solid transparent",
                                  },

                                  "&:hover .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "#c8c8c8",
                                  },

                                  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                                    {
                                      borderColor: "#0078d4",
                                      borderWidth: "1px",
                                    },

                                  "& .MuiOutlinedInput-root": {
                                    backgroundColor: "transparent",
                                  },
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    placeholder="Select Priority"
                                  />
                                )}
                              />
                            </Box>

                          <Box
                            sx={{
                              mb:1
                            }}>
                       <Typography
                                variant="caption"
                                sx={{
                                  color: "text.secondary",
                                  fontWeight: 600,
                                  display: "block",
                                  mb: 0.5,
                                }}
                              >
                                Status 
                              </Typography>
                                <Autocomplete
                                 forcePopupIcon={false}
                                disableClearable
                                  size="small"
                                  options={statusOptions}
                                  getOptionLabel={(option) => option.label}
                                  value={
                                    statusOptions.find(
                                      (option) => option.value === form.status,
                                    ) ?? undefined
                                  }
                                  onChange={(_, value) =>
                                    setForm((prev) => ({
                                      ...prev,
                                      status: value?.value,
                                    }))
                                  }
                                  sx={{
                                    minWidth: 180,

                                    "& .MuiOutlinedInput-root": {
                                      minHeight: 32,
                                      paddingRight: "28px !important",
                                      backgroundColor: "transparent",

                                      "& fieldset": {
                                        border: "1px solid transparent",
                                      },

                                      "&:hover": {
                                        backgroundColor: "transparent",
                                      },

                                      "&:hover fieldset": {
                                        borderColor: "#c8c6c4",
                                      },

                                      "&.Mui-focused": {
                                        backgroundColor: "#fff",
                                      },

                                      "&.Mui-focused fieldset": {
                                        borderColor: "#0078d4",
                                        borderWidth: "1px",
                                      },
                                    },

                                    "& .MuiAutocomplete-input": {
                                      fontSize: "14px",
                                    
                                    },

                                    "& .MuiAutocomplete-popupIndicator": {
                                      color: "#605e5c",
                                    },
                                    
                                  }}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      variant="outlined"
                                      placeholder="Select Status"
                                    />
                                  )}
                                />
                            </Box>

                            <Box>
   
                              <Typography
                                variant="caption"
                                sx={{
                                  color: "text.secondary",
                                  fontWeight: 600,
                                  display: "block",
                                  mb: 0.5,
                                }}
                              >
                                Type 
                              </Typography>
<Autocomplete
 forcePopupIcon={false}
 disableClearable
  size="small"
  options={typeOptions}
  getOptionLabel={(option) => option.label}
  value={
    typeOptions.find(
      (option) => option.value === form.type,
    ) ?? undefined
  }
  onChange={(_, value) =>
    setForm((prev) => ({
      ...prev,
      type: value?.value as
        | "Campaign"
        | "Workshop"
        | "Meeting"
        | "Webinar"
        | "Content Release",
    }))
  }
  sx={{
    minWidth: 180,

    "& .MuiOutlinedInput-root": {
      minHeight: 32,
      paddingRight: "28px !important",
      backgroundColor: "transparent",

      "& fieldset": {
        border: "1px solid transparent",
      },

      "&:hover": {
        backgroundColor: "transparent",
      },

      "&:hover fieldset": {
        borderColor: "#c8c6c4",
      },

      "&.Mui-focused": {
        backgroundColor: "#fff",
      },

      "&.Mui-focused fieldset": {
        borderColor: "#0078d4",
        borderWidth: "1px",
      },

    },

    "& .MuiAutocomplete-input": {
      fontSize: "14px",
     
    },

    "& .MuiAutocomplete-popupIndicator": {
      color: "#605e5c",
    },
  }}
  renderInput={(params) => (
    <TextField
      {...params}
      variant="outlined"
      placeholder="Select Type"
    />
  )}
/>
                            </Box>
                          </Box>

                          <Box
                            sx={{
                              height: "50%",
                              display: "flex",
                              flexDirection: "column",
                              ml: 1,
                              pt:2
                            }}
                          >
                            <h1>Efforts</h1>
                            <Box
                              sx={{
                                mb: 1,
                              }}
                            >
                              <Typography
                                variant="caption"
                                sx={{
                                  color: "text.secondary",
                                  fontWeight: 600,
                                  display: "block",
                                  mb: 0.5,
                                }}
                              >
                                Original Estimated
                              </Typography>

                          
                              <TextField
  size="small"
  variant="outlined"
  fullWidth
  value={form.effortOriginal ?? ""}
  onChange={(e) =>
    setForm((prev) => ({ ...prev, effortOriginal: e.target.value }))
  }
  sx={{
    minWidth: 220,
    "& .MuiInputBase-root": { height: 32, fontSize: "14px" },
    "& .MuiOutlinedInput-root": {
      backgroundColor: "#fff",
      "& .MuiOutlinedInput-notchedOutline": { borderColor: "transparent" },
      "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#d2d0ce" },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#0078d4" },
    },
  }}
/>
                            </Box>
                            <Box
                              sx={{
                                mb: 1,
                              }}
                            >
                              <Typography
                                variant="caption"
                                sx={{
                                  color: "text.secondary",
                                  fontWeight: 600,
                                  display: "block",
                                  mb: 0.5,
                                }}
                              >
                                Remaining
                              </Typography>

                              

                              <TextField
  size="small"
  variant="outlined"
  fullWidth
  value={form.effortRemaining ?? ""}
  onChange={(e) =>
    setForm((prev) => ({ ...prev, effortRemaining: e.target.value }))
  }
  sx={{
    minWidth: 220,
    "& .MuiInputBase-root": { height: 32, fontSize: "14px" },
    "& .MuiOutlinedInput-root": {
      backgroundColor: "#fff",
      "& .MuiOutlinedInput-notchedOutline": { borderColor: "transparent" },
      "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#d2d0ce" },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#0078d4" },
    },
  }}
/>

                            </Box>
                            <Box
                              sx={{
                                mb: 1,
                              }}
                            >
                              <Typography
                                variant="caption"
                                sx={{
                                  color: "text.secondary",
                                  fontWeight: 600,
                                  display: "block",
                                  mb: 0.5,
                                }}
                              >
                                Completed
                              </Typography>

                              <TextField
  size="small"
  variant="outlined"
  fullWidth
  value={form.effortCompleted ?? ""}
  onChange={(e) =>
    setForm((prev) => ({ ...prev, effortCompleted: e.target.value }))
  }
  sx={{
    minWidth: 220,
    "& .MuiInputBase-root": { height: 32, fontSize: "14px" },
    "& .MuiOutlinedInput-root": {
      backgroundColor: "#fff",
      "& .MuiOutlinedInput-notchedOutline": { borderColor: "transparent" },
      "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#d2d0ce" },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#0078d4" },
    },
  }}
/>
                            </Box>
                          </Box>
                        </Box>

                        <Box
                          sx={{
                            width: "70%",
                            mt:2
                          }}
                        >
                          <h1>History</h1>
                        </Box>
                      </Box>
                    </Box>
                  )}


                {activePage === "Page2" && (
  <Box sx={{ p: 2, height: "100%" }}>
    <HistoryTab eventId={form.id ?? 0} />
  </Box>
                  )}


                  {activePage === "Page3" && (
                    <Box sx={{ p: 3 }}>
                       <Box sx={{ p: 2, height: "100%" }}>
    <AttachmentTab
      eventId={form.id ?? 0}
      attachments={form.attachments ?? []}
      onAttachmentsChange={(val) =>
        setForm((prev) => ({
          ...prev,
          // ← handle both direct array and functional updater
          attachments: typeof val === "function"
            ? val(prev.attachments ?? [])
            : val,
        }))
      }
    />
  </Box>
                    </Box>
                  )}
                </Box>
              </DialogContent>
            </Box>

   
            <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
              <Button
                startIcon={<ContentCopyIcon />}
                variant="outlined"
                size="small"
                onClick={handleDuplicate}
                sx={{ borderRadius: "8px", textTransform: "none" }}
              >
                Duplicate
              </Button>
              <Button
                startIcon={<SaveIcon />}
                variant="contained"
                size="small"
                onClick={handleSave}
                sx={{ borderRadius: "8px", textTransform: "none" }}
              >
                Save
              </Button>
              <Button
                startIcon={<DeleteIcon />}
                variant="outlined"
                size="small"
                color="error"
                onClick={handleDelete}
                sx={{ borderRadius: "8px", textTransform: "none" }}
              >
                Delete
              </Button>
            </DialogActions>
          </Dialog> */}

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
