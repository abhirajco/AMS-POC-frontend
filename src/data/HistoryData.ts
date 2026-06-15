export type HistoryField =
  | "Status"
  | "Priority"
  | "Title"
  | "Location"
  | "Time"
  | "Assigned Team"
  | "Milestone"
  | "Description"
  | "Related Task"
  | "Related Campaign";

export interface HistoryEntry {
  id: number;
  eventId: number;
  timestamp: string;
  user: string;
  userInitials: string;
  userColor: string;
  field: HistoryField;
  oldValue: string;
  newValue: string;
  comment?: string;
}

// Status order for the state graph
export const STATUS_ORDER = [
  "Planning",
  "Upcoming",
  "In Progress",
  "Follow Up",
  "Completed",
] as const;

export const STATUS_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  Planning:    { bg: "#fef9c3", border: "#ca8a04", text: "#854d0e" },
  Upcoming:    { bg: "#ede9fe", border: "#7c3aed", text: "#4c1d95" },
  "In Progress": { bg: "#dbeafe", border: "#2563eb", text: "#1e3a8a" },
  "Follow Up": { bg: "#ffedd5", border: "#ea580c", text: "#7c2d12" },
  Completed:   { bg: "#dcfce7", border: "#16a34a", text: "#14532d" },
};

export const allEventHistory: HistoryEntry[] = [
  // Event 1 history
  {
    id: 1, eventId: 1,
    timestamp: "2026-05-01T09:00:00",
    user: "John Doe", userInitials: "JD", userColor: "#6366f1",
    field: "Status", oldValue: "Planning", newValue: "Upcoming",
    comment: "Event confirmed and scheduled.",
  },
  {
    id: 2, eventId: 1,
    timestamp: "2026-05-05T11:30:00",
    user: "Sarah Khan", userInitials: "SK", userColor: "#ec4899",
    field: "Priority", oldValue: "Low", newValue: "Medium",
  },
  {
    id: 3, eventId: 1,
    timestamp: "2026-05-10T14:00:00",
    user: "John Doe", userInitials: "JD", userColor: "#6366f1",
    field: "Status", oldValue: "Upcoming", newValue: "In Progress",
    comment: "Kickoff meeting done. Work started.",
  },
  {
    id: 4, eventId: 1,
    timestamp: "2026-05-12T10:00:00",
    user: "Mike Ross", userInitials: "MR", userColor: "#f59e0b",
    field: "Assigned Team", oldValue: "John Doe", newValue: "John Doe, Mike Ross",
  },
  {
    id: 5, eventId: 1,
    timestamp: "2026-05-15T16:00:00",
    user: "Sarah Khan", userInitials: "SK", userColor: "#ec4899",
    field: "Status", oldValue: "In Progress", newValue: "Follow Up",
    comment: "Waiting for client feedback.",
  },
  {
    id: 6, eventId: 1,
    timestamp: "2026-05-20T09:30:00",
    user: "John Doe", userInitials: "JD", userColor: "#6366f1",
    field: "Status", oldValue: "Follow Up", newValue: "Completed",
    comment: "All tasks done. Event closed.",
  },

  // Event 2 history
  {
    id: 7, eventId: 2,
    timestamp: "2026-05-02T10:00:00",
    user: "Sarah Khan", userInitials: "SK", userColor: "#ec4899",
    field: "Status", oldValue: "Planning", newValue: "In Progress",
    comment: "Workshop preparation started.",
  },
  {
    id: 8, eventId: 2,
    timestamp: "2026-05-08T13:00:00",
    user: "Mike Ross", userInitials: "MR", userColor: "#f59e0b",
    field: "Priority", oldValue: "Medium", newValue: "High",
    comment: "Escalated due to deadline.",
  },
  {
    id: 9, eventId: 2,
    timestamp: "2026-05-14T15:00:00",
    user: "Sarah Khan", userInitials: "SK", userColor: "#ec4899",
    field: "Location", oldValue: "Room A", newValue: "Main Hall",
  },
  {
    id: 10, eventId: 2,
    timestamp: "2026-05-18T11:00:00",
    user: "John Doe", userInitials: "JD", userColor: "#6366f1",
    field: "Status", oldValue: "In Progress", newValue: "Completed",
    comment: "Workshop completed successfully.",
  },

  // Event 3 history
  {
    id: 11, eventId: 3,
    timestamp: "2026-05-03T08:00:00",
    user: "Mike Ross", userInitials: "MR", userColor: "#f59e0b",
    field: "Status", oldValue: "Planning", newValue: "Upcoming",
  },
  {
    id: 12, eventId: 3,
    timestamp: "2026-05-09T10:30:00",
    user: "Mike Ross", userInitials: "MR", userColor: "#f59e0b",
    field: "Title", oldValue: "Q2 Meeting", newValue: "Q2 Strategy Meeting",
    comment: "Renamed to better reflect scope.",
  },
  {
    id: 13, eventId: 3,
    timestamp: "2026-05-16T14:00:00",
    user: "Sarah Khan", userInitials: "SK", userColor: "#ec4899",
    field: "Status", oldValue: "Upcoming", newValue: "In Progress",
  },
];