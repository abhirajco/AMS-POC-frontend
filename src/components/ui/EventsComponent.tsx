import { Dialog, DialogTitle, DialogContent, DialogActions, Box, Typography, Chip, Button, IconButton, TextField, Autocomplete, } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import { Timeline, TimelineItem, TimelineSeparator, TimelineDot, TimelineConnector, TimelineContent, } from "@mui/lab";
import { useState } from "react";
import { CalendarEvent, Milestone } from "../ui/calendar copy";
import { EditableField } from "./InlineEditableField";
import { EditableAssignedTeam, TeamMember } from "./EditableAssignedTeams";
import RichTextEditor from "../ui/CommentSection copy";
import { RelatedItems } from "./RelatedItems";
import { HistoryTab } from "./EventHistoryTwo";
import { AttachmentTab, Attachment } from "../ui/Attachment";

type ActivePage = "Page1" | "Page2" | "Page3";

interface EventDialogProps {
  history: any[];
  open: boolean;
  form: Partial<CalendarEvent>;
  teamOptions: TeamMember[];
  onClose: () => void;
  onSave: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onFormChange: (
    form:
      | Partial<CalendarEvent>
      | ((prev: Partial<CalendarEvent>) => Partial<CalendarEvent>)
  ) => void;
}


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

// ── Tab button ───────────────────────────────────────────────────

const TabButton = ({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) => (
  <Button
    variant="text"
    onClick={onClick}
    sx={{
      //   minWidth: "unset",
      px: 2,
      py: 1.2,
      borderRadius: 0,
      color: active ? "#0078D4" : "#000",
      fontWeight: active ? 600 : 400,
      fontSize: "14px",
      textTransform: "none",
      borderBottom: active ? "2px solid #0078D4" : "2px solid transparent",
      "&:hover": {
        backgroundColor: "#F3F2F1",
        borderBottom: active ? "2px solid #0078D4" : "2px solid #C8C6C4",
      },
    }}
  >
    {label}
  </Button>
);

// ── Options ──────────────────────────────────────────────────────

const priorityOptions: { label: CalendarEvent["priority"] }[] = [
  { label: "Low" },
  { label: "Medium" },
  { label: "High" },
];

const statusOptions: {
  label: CalendarEvent["status"];
  value: CalendarEvent["status"];
}[] = [
    { label: "Planning", value: "Planning" },
    { label: "In Progress", value: "In Progress" },
    { label: "Completed", value: "Completed" },
    { label: "Upcoming", value: "Upcoming" },
    { label: "Follow Up", value: "Follow Up" },
  ];

const typeOptions: {
  label: CalendarEvent["type"];
  value: CalendarEvent["type"];
}[] = [
    { label: "Campaign", value: "Campaign" },
    { label: "Workshop", value: "Workshop" },
    { label: "Meeting", value: "Meeting" },
    { label: "Webinar", value: "Webinar" },
    { label: "Content Release", value: "Content Release" },
  ];

// ── Autocomplete shared sx ───────────────────────────────────────
const autocompleteSx = {
  minWidth: 180,
  "& .MuiOutlinedInput-root": {
    minHeight: 32,
    backgroundColor: "transparent",
    "& fieldset": { border: "1px solid #d2d0ce" },
    "&:hover fieldset": { borderColor: "#c8c6c4" },
    "&.Mui-focused fieldset": { borderColor: "#0078d4", borderWidth: "2px" },
  },
  "& .MuiAutocomplete-input": { fontSize: "14px" },
  "& .MuiAutocomplete-popupIndicator": { color: "#605e5c" },
};

const textFieldSx = {
  minWidth: 220,
  "& .MuiInputBase-root": { height: 32, fontSize: "14px" },
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#fff",
    "& .MuiOutlinedInput-notchedOutline": { borderColor: "#d2d0ce" },
    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#d2d0ce" },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#0078d4" },
  },
};

const sectionBoxSx = {
  borderLeft: "6px solid #1a2c47",
  borderRadius: "5px",
  pb: 2,
  pt: 2,
  mb: 1,
  mt: 1,
};

// ── Main component ───────────────────────────────────────────────

export const EventDialog = ({
  history,
  open,
  form,
  teamOptions,
  onClose,
  onSave,
  onDelete,
  onDuplicate,
  onFormChange,
}: EventDialogProps) => {
  const [activePage, setActivePage] = useState<ActivePage>("Page1");

  const set = (patch: Partial<CalendarEvent>) =>
    onFormChange({ ...form, ...patch });

  const milestoneCount = form.milestones?.length ?? 0;

  const formatDisplayDate = (date?: string) => {
    if (!date) return "";

    const [y, m, d] = date.split("-");
    return `${d}-${m}-${y}`;
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      slotProps={{
        paper: {
          sx: {
            maxWidth: "100%",
            height: "95vh",
            maxHeight: "95vh",
            display: "flex",
            flexDirection: "column",
            pl: 1,
            pt: 1,
          },
        },
      }}
    >
      {/* ── Title ─────────────────────────────────────── */}
      <DialogTitle
        sx={{
          pb: 1,
          pt: 2.5,
          px: 3,
          position: "relative",
          backgroundColor: "#ffffff",
          borderBottom: "1px solid #E5E7EB",
          borderLeft: "6px solid #1a2c47",
          borderRadius: "5px",
          flexShrink: 0,
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            color: "#6b7280",
            "&:hover": { backgroundColor: "#f3f4f6", color: "#4c5871" },
          }}
        >
          <CloseIcon sx={{ fontSize: 20 }} />
        </IconButton>

        <Box sx={{ fontSize: "1.5rem", fontWeight: 700, color: "#1F2937", pb: 2 }}>
          Campaign
        </Box>

        <Box
          sx={{
            pb: 2,
            // "& input": { fontSize: "1.5rem !important", fontWeight: "700 !important", color: "#1F2937" },
            // "& .MuiTypography-root": { fontSize: "1.5rem !important", fontWeight: "700 !important", color: "#1F2937" },
          }}
        >
          <EditableField
            fontSize="1.5rem"
            inputHeight={48}
            value={form.title ?? ""}
            placeholder="Enter campaign title"
            onSave={(val) => set({ title: val })}
          />
        </Box>

        <Box sx={{ display: "flex", paddingBottom: 1 }}>
          <Typography sx={{ display: "flex", alignItems: "center", fontWeight: 700, paddingRight: 4 }}>
            Assigned Team
          </Typography>
          <EditableAssignedTeam
            value={form.assignedTeam ?? []}
            options={teamOptions}
            onSave={(val) => set({ assignedTeam: val })}
          />
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}>
          <Box sx={{ display: "flex", gap: 1, mt: 1.5, flexWrap: "wrap", "& .MuiChip-root": { borderRadius: "4px", height: 24, fontSize: 12 } }}>
            {form.status && <Chip label={form.status} size="small" sx={getStatusChipSx(form.status)} />}
            {form.priority && <Chip label={form.priority} size="small" sx={getPriorityChipSx(form.priority)} />}
            {form.type && <Chip label={form.type} size="small" variant="outlined" />}
          </Box>
          <Box
            sx={{
              display: "flex", gap: 1, mt: 1.5, flexWrap: "wrap", "& .MuiChip-root": { borderRadius: "4px", height: 24, fontSize: 12 }
            }}
          >
            {form.type && form.endDate && (() => {
              const daysDiff = Math.ceil(
                (
                  new Date(form.endDate).setHours(0, 0, 0, 0) -
                  new Date().setHours(0, 0, 0, 0)
                ) /
                (1000 * 60 * 60 * 24)
              );

              return (
                <Chip
                  label={
                    daysDiff < 0
                      ? `Overdue by ${Math.abs(daysDiff)} days`
                      : `Due in ${daysDiff} days`
                  }
                  color={daysDiff < 0 ? "error" : "default"}
                  size="small"
                  variant="outlined"
                />
              );
            })()}
          </Box>
        </Box>
      </DialogTitle>

      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", width: "100%" }}>
        <DialogContent sx={{ flex: 1, padding: 0, boxSizing: "border-box" }}>
          <Box sx={{ width: "100%", boxSizing: "border-box", }}>

            {/* ── Event details bar ──────────────────── */}
            <Box sx={{ backgroundColor: "#DADADA", borderLeft: "6px solid #1a2c47", borderRadius: "5px", mt: 2 }}>
              <Box sx={{ pt: 2, pb: 2 }}>
                <Typography sx={{ fontSize: "1.2rem", fontWeight: 700, ml: 4, }}>
                  Event Details
                </Typography>

                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  {/* Fields grid */}
                  <Box sx={{ display: "grid", gridTemplateColumns: "7fr 7fr", gap: 2, ml: 4, mt: 2, width: "80%" }}>
                    {[
                      {
                        label: "Start Date",
                        value: form.eventDate
                          ? (() => {
                            const [y, m, d] = form.eventDate.split("-");
                            return `${d}-${m}-${y}`;
                          })()
                          : "",
                        type: "date",
                        onSave: (iso: string) => {
                          set({
                            date: iso,
                            eventDate: iso,
                          });
                        },
                      },
                      {
                        label: "Location",
                        value: form.location ?? "",
                        onSave: (val: string) => set({ location: val }),
                      },
                      {
                        label: "End Date",
                        value: formatDisplayDate(form.endDate),
                        type: "date",
                        onSave: (iso: string) => {
                          set({
                            endDate: iso,
                          });
                        },
                      },

                    ].map(({ label, value, onSave, type }) => (
                      <Box key={label} sx={{ display: "flex", alignItems: "center" }}>
                        <Typography sx={{ fontSize: "1.1rem" }} color="text.secondary">
                          {label}:
                        </Typography>
                        <Box sx={{ display: "flex", ml: 2 }}>
                          <EditableField fontSize="14px" value={value} onSave={onSave} type={type} />
                          {label === "Due" && <Typography color="text.secondary">days</Typography>}
                        </Box>
                      </Box>
                    ))}
                  </Box>

                  {/* Tab buttons */}
                  <Box sx={{ display: "flex", alignItems: "end", width: "20%", borderBottom: "1px solid #E1DFDD", }}>
                    <TabButton
                      label="Details" active={activePage === "Page1"} onClick={() => setActivePage("Page1")} />
                    <TabButton label="History" active={activePage === "Page2"} onClick={() => setActivePage("Page2")} />
                    <TabButton label="Attachments" active={activePage === "Page3"} onClick={() => setActivePage("Page3")} />
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* ── Page 1 — Details ──────────────────── */}
            {activePage === "Page1" && (
              <Box sx={{ display: "flex" }}>
                {/* Left column */}
                <Box sx={{ width: "60%", }}>

                  {/* Description */}
                  <Box sx={sectionBoxSx}>
                    <Box sx={{ ml: 4 }}>
                      <Typography sx={{ fontWeight: 700 }}>Description</Typography>
                      <Box sx={{ paddingRight: 2 }}>
                        <RichTextEditor
                          value={form.description ?? ""}
                          onChange={(val) => onFormChange((prev: Partial<CalendarEvent>) => ({ ...prev, description: val }))}
                        />
                      </Box>
                    </Box>
                  </Box>

                  {/* Comment */}
                  <Box sx={sectionBoxSx}>
                    <Box sx={{ ml: 4 }}>
                      <Typography sx={{ fontWeight: 700 }}>Comment</Typography>
                      <Box sx={{ paddingRight: 2 }}>
                        <RichTextEditor
                          value={form.comment ?? ""}
                          onChange={(val) => onFormChange((prev: Partial<CalendarEvent>) => ({ ...prev, comment: val }))}
                        />
                      </Box>
                    </Box>
                  </Box>

                  {/* Milestones */}
                  <Box sx={sectionBoxSx}>
                    <Typography sx={{ fontSize: "1.2rem", fontWeight: 700, ml: 5, mt: 2 }}>
                      Milestones
                    </Typography>
                    <Timeline
                      sx={{
                        borderBottom: "1px solid #e5e7eb",
                        "& .MuiTimelineItem-root:before": { flex: 0, padding: 0 },
                      }}
                    >
                      {form.milestones?.map((m, index) => (
                        <TimelineItem key={m.id}>
                          <TimelineSeparator>
                            <TimelineDot
                              sx={{
                                bgcolor: "#1a2c47", color: "#fff",
                                width: 32, height: 32, fontWeight: 700,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                p: 0, m: 0,
                              }}
                            >
                              {index + 1}
                            </TimelineDot>
                            {index < milestoneCount - 1 && <TimelineConnector />}
                          </TimelineSeparator>

                          <TimelineContent>
                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                              <EditableField
                                fontSize="1.2rem"
                                value={m.title}
                                onSave={(val) =>
                                  onFormChange({
                                    ...form,
                                    milestones: form.milestones?.map((ms) =>
                                      ms.id === m.id ? { ...ms, title: val } : ms
                                    ),
                                  })
                                }
                              />
                              <Autocomplete
                                forcePopupIcon={false}
                                disableClearable
                                options={["Not Started", "In Progress", "Completed"]}
                                value={m.status}
                                sx={{ width: 150, ...autocompleteSx }}
                                onChange={(_, value) =>
                                  onFormChange({
                                    ...form,
                                    milestones: form.milestones?.map((ms) =>
                                      ms.id === m.id ? { ...ms, status: value as Milestone["status"] } : ms
                                    ),
                                  })
                                }
                                renderInput={(params) => <TextField {...params} size="small" />}
                              />
                            </Box>

                            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Typography sx={{ fontWeight: 600, color: "#374151", minWidth: 100 }}>
                                  Assigned To:
                                </Typography>
                                <EditableField
                                  value={m.assignedTo}
                                  onSave={(val) =>
                                    onFormChange({
                                      ...form,
                                      milestones: form.milestones?.map((ms) =>
                                        ms.id === m.id ? { ...ms, assignedTo: val } : ms
                                      ),
                                    })
                                  }
                                />
                              </Box>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Typography sx={{ fontWeight: 600, color: "#374151", minWidth: 100 }}>
                                  Due Date:
                                </Typography>
                                <EditableField
                                  value={m.dueDate}
                                  type="date"
                                  onSave={(val) =>
                                    onFormChange({
                                      ...form,
                                      milestones: form.milestones?.map((ms) =>
                                        ms.id === m.id ? { ...ms, dueDate: val } : ms
                                      ),
                                    })
                                  }
                                />
                              </Box>
                            </Box>
                          </TimelineContent>
                        </TimelineItem>
                      ))}
                    </Timeline>
                  </Box>

                  {/* Related Items */}
                  <Box sx={sectionBoxSx}>
                    <RelatedItems
                      tasks={form.relatedTasks ?? []}
                      campaigns={form.relatedCampaigns ?? []}
                      onTasksChange={(val) => set({ relatedTasks: val })}
                      onCampaignsChange={(val) => set({ relatedCampaigns: val })}
                    />
                  </Box>
                </Box>

                {/* Right column */}
                <Box sx={{ display: "flex", justifyContent: "center", width: "40%" }}>
                  <Box sx={{ display: "flex", flexDirection: "column", width: "50%", mt: 2 }}>

                    {/* Planning */}
                    <Box sx={{ display: "flex", flexDirection: "column", pl: 1, pb: 1 }}>
                      <h1>Planning</h1>

                      {[
                        {
                          label: "Priority", render: () => (
                            <Autocomplete
                              disableClearable forcePopupIcon={false}
                              size="small" options={priorityOptions}
                              getOptionLabel={(o) => o.label}
                              value={priorityOptions.find((o) => o.label === form.priority) ?? undefined}
                              onChange={(_, v) => set({ priority: v?.label })}
                              sx={autocompleteSx}
                              renderInput={(params) => <TextField {...params} placeholder="Select Priority" />}
                            />
                          )
                        },
                        {
                          label: "Status", render: () => (
                            <Autocomplete
                              disableClearable forcePopupIcon={false}
                              size="small" options={statusOptions}
                              getOptionLabel={(o) => o.label}
                              value={statusOptions.find((o) => o.value === form.status) ?? undefined}
                              onChange={(_, v) => set({ status: v?.value })}
                              sx={autocompleteSx}
                              renderInput={(params) => <TextField {...params} placeholder="Select Status" />}
                            />
                          )
                        },
                        {
                          label: "Type", render: () => (
                            <Autocomplete
                              disableClearable forcePopupIcon={false}
                              size="small" options={typeOptions}
                              getOptionLabel={(o) => o.label}
                              value={typeOptions.find((o) => o.value === form.type) ?? undefined}
                              onChange={(_, v) => set({ type: v?.value as CalendarEvent["type"] })}
                              sx={autocompleteSx}
                              renderInput={(params) => <TextField {...params} placeholder="Select Type" />}
                            />
                          )
                        },
                      ].map(({ label, render }) => (
                        <Box key={label} sx={{ mb: 1 }}>
                          <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600, display: "block", mb: 0.5 }}>
                            {label}
                          </Typography>
                          {render()}
                        </Box>
                      ))}
                    </Box>

                    {/* Efforts */}
                    <Box sx={{ display: "flex", flexDirection: "column", ml: 1, pt: 2 }}>
                      <h1>Efforts</h1>
                      {[
                        { label: "Original Estimated", key: "effortOriginal" as const },
                        { label: "Remaining", key: "effortRemaining" as const },
                        { label: "Completed", key: "effortCompleted" as const },
                      ].map(({ label, key }) => (
                        <Box key={key} sx={{ mb: 1 }}>
                          <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600, display: "block", mb: 0.5 }}>
                            {label}
                          </Typography>
                          <TextField
                            size="small" variant="outlined" fullWidth
                            value={form[key] ?? ""}
                            onChange={(e) => set({ [key]: e.target.value })}
                            sx={textFieldSx}
                          />
                        </Box>
                      ))}
                    </Box>
                  </Box>
                  {/* <Box sx={{ width: "50%", mt: 2 }}>
                    <h1>History</h1>
                  </Box> */}
                </Box>
              </Box>
            )}

            {/* ── Page 2 — History ──────────────────── */}
            {activePage === "Page2" && (
              <Box sx={{ p: 2, minHeight: "100%" }}>
                <HistoryTab history={history} />
              </Box>
            )}

            {/* ── Page 3 — Attachments ──────────────── */}
            {activePage === "Page3" && (
              <Box sx={{ p: 2, minHeight: "100%" }}>
                <AttachmentTab
                  eventId={form.id ?? 0}
                  attachments={(form.attachments as Attachment[]) ?? []}
                  onAttachmentsChange={(val) =>
                    onFormChange({
                      ...form,
                      attachments:
                        typeof val === "function"
                          ? val((form.attachments as Attachment[]) ?? [])
                          : val,
                    })
                  }
                />
              </Box>
            )}

          </Box>
        </DialogContent>
      </Box>

      {/* ── Actions ───────────────────────────────────── */}
      <DialogActions sx={{ px: 3, pb: 2, gap: 1, flexShrink: 0 }}>
        <Button startIcon={<ContentCopyIcon />} variant="outlined" size="small" onClick={onDuplicate} sx={{ borderRadius: "8px", textTransform: "none" }}>
          Duplicate
        </Button>
        <Button startIcon={<SaveIcon />} variant="contained" size="small" onClick={onSave} sx={{ borderRadius: "8px", textTransform: "none" }}>
          Save
        </Button>
        <Button startIcon={<DeleteIcon />} variant="outlined" size="small" color="error" onClick={onDelete} sx={{ borderRadius: "8px", textTransform: "none" }}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};