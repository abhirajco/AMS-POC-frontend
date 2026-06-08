// import { Box, Typography, Avatar, Chip, Divider } from "@mui/material";
// import { HistoryEntry, STATUS_ORDER, STATUS_COLORS, allEventHistory } from "../../data/HistoryData";
// import CheckCircleIcon from "@mui/icons-material/CheckCircle";
// import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
// import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

// // ── State Graph ──────────────────────────────────────────────────
// const StateGraph = ({ history }: { history: HistoryEntry[] }) => {
//   // Get all status transitions from history
//   const statusChanges = history.filter((h) => h.field === "Status");

//   // Find current status (last status change newValue)
//   const currentStatus =
//     statusChanges.length > 0
//       ? statusChanges[statusChanges.length - 1].newValue
//       : null;

//   // Find which statuses were actually visited
//   const visitedStatuses = new Set<string>();
//   statusChanges.forEach((h) => {
//     visitedStatuses.add(h.oldValue);
//     visitedStatuses.add(h.newValue);
//   });

//   // Get index of current status in the order
//   const currentIndex = STATUS_ORDER.indexOf(currentStatus as any);

//   if (statusChanges.length === 0) {
//     return (
//       <Box sx={{ p: 2, textAlign: "center" }}>
//         <Typography sx={{ fontSize: "12px", color: "#9ca3af" }}>
//           No status changes recorded yet.
//         </Typography>
//       </Box>
//     );
//   }

//   return (
//     <Box
//       sx={{
//         px: 3,
//         py: 2,
//         backgroundColor: "#f8fafc",
//         borderRadius: "8px",
//         border: "1px solid #e2e8f0",
//         mb: 3,
//       }}
//     >
//       <Typography sx={{ fontSize: "12px", fontWeight: 700, color: "#64748b", mb: 2, textTransform: "uppercase", letterSpacing: "0.05em" }}>
//         State Progression
//       </Typography>

//       <Box sx={{ display: "flex", alignItems: "center", overflowX: "auto", pb: 1 }}>
//         {STATUS_ORDER.map((status, index) => {
//           const isVisited = visitedStatuses.has(status);
//           const isCurrent = status === currentStatus;
//           const isPast = currentIndex > index && isVisited;
//           const colors = STATUS_COLORS[status];

//           return (
//             <Box key={status} sx={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
//               {/* Node */}
//               <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0.5 }}>
//                 <Box
//                   sx={{
//                     width: 32,
//                     height: 32,
//                     borderRadius: "50%",
//                     backgroundColor: isCurrent ? colors.border : isPast ? colors.bg : "#f1f5f9",
//                     border: `2px solid ${isCurrent || isPast ? colors.border : "#cbd5e1"}`,
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     transition: "all 0.2s",
//                     boxShadow: isCurrent ? `0 0 0 3px ${colors.border}30` : "none",
//                   }}
//                 >
//                   {isPast ? (
//                     <CheckCircleIcon sx={{ fontSize: 16, color: colors.border }} />
//                   ) : isCurrent ? (
//                     <FiberManualRecordIcon sx={{ fontSize: 12, color: "#fff" }} />
//                   ) : (
//                     <RadioButtonUncheckedIcon sx={{ fontSize: 16, color: "#cbd5e1" }} />
//                   )}
//                 </Box>

//                 <Typography
//                   sx={{
//                     fontSize: "11px",
//                     fontWeight: isCurrent ? 700 : 400,
//                     color: isCurrent ? colors.border : isPast ? colors.text : "#94a3b8",
//                     whiteSpace: "nowrap",
//                     maxWidth: 72,
//                     textAlign: "center",
//                     lineHeight: 1.2,
//                   }}
//                 >
//                   {status}
//                 </Typography>

//                 {isCurrent && (
//                   <Box
//                     sx={{
//                       px: 0.75,
//                       py: 0.25,
//                       backgroundColor: colors.bg,
//                       border: `1px solid ${colors.border}`,
//                       borderRadius: "4px",
//                     }}
//                   >
//                     <Typography sx={{ fontSize: "9px", fontWeight: 700, color: colors.text }}>
//                       CURRENT
//                     </Typography>
//                   </Box>
//                 )}
//               </Box>

//               {/* Connector line */}
//               {index < STATUS_ORDER.length - 1 && (
//                 <Box
//                   sx={{
//                     width: 40,
//                     height: 2,
//                     backgroundColor: isPast ? STATUS_COLORS[STATUS_ORDER[index + 1]]?.border ?? "#cbd5e1" : "#e2e8f0",
//                     mx: 0.5,
//                     mt: -2.5,
//                     transition: "background-color 0.2s",
//                   }}
//                 />
//               )}
//             </Box>
//           );
//         })}
//       </Box>

//       {/* Transition summary */}
//       {statusChanges.length > 0 && (
//         <Box sx={{ mt: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
//           {statusChanges.map((change, i) => (
//             <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
//               <Chip
//                 label={change.oldValue}
//                 size="small"
//                 sx={{
//                   height: 18,
//                   fontSize: "10px",
//                   backgroundColor: STATUS_COLORS[change.oldValue]?.bg ?? "#f1f5f9",
//                   color: STATUS_COLORS[change.oldValue]?.text ?? "#374151",
//                   border: `1px solid ${STATUS_COLORS[change.oldValue]?.border ?? "#cbd5e1"}`,
//                 }}
//               />
//               <Typography sx={{ fontSize: "10px", color: "#94a3b8" }}>→</Typography>
//               <Chip
//                 label={change.newValue}
//                 size="small"
//                 sx={{
//                   height: 18,
//                   fontSize: "10px",
//                   backgroundColor: STATUS_COLORS[change.newValue]?.bg ?? "#f1f5f9",
//                   color: STATUS_COLORS[change.newValue]?.text ?? "#374151",
//                   border: `1px solid ${STATUS_COLORS[change.newValue]?.border ?? "#cbd5e1"}`,
//                 }}
//               />
//               {i < statusChanges.length - 1 && (
//                 <Typography sx={{ fontSize: "10px", color: "#cbd5e1", ml: 0.5 }}>•</Typography>
//               )}
//             </Box>
//           ))}
//         </Box>
//       )}
//     </Box>
//   );
// };

// // ── Field badge ──────────────────────────────────────────────────
// const fieldColors: Record<string, { bg: string; color: string }> = {
//   Status:           { bg: "#dbeafe", color: "#1e40af" },
//   Priority:         { bg: "#fef3c7", color: "#92400e" },
//   Title:            { bg: "#f3e8ff", color: "#6b21a8" },
//   Location:         { bg: "#dcfce7", color: "#166534" },
//   Time:             { bg: "#e0f2fe", color: "#075985" },
//   "Assigned Team":  { bg: "#fce7f3", color: "#9d174d" },
//   Milestone:        { bg: "#fff7ed", color: "#9a3412" },
//   Description:      { bg: "#f1f5f9", color: "#475569" },
//   "Related Task":   { bg: "#ecfdf5", color: "#065f46" },
//   "Related Campaign": { bg: "#fdf4ff", color: "#7e22ce" },
// };

// // ── Single history entry ─────────────────────────────────────────
// const HistoryEntryRow = ({ entry }: { entry: HistoryEntry }) => {
//   const fieldStyle = fieldColors[entry.field] ?? { bg: "#f1f5f9", color: "#374151" };

//   const formatDate = (iso: string) => {
//     const d = new Date(iso);
//     return d.toLocaleDateString("en-GB", {
//       day: "2-digit", month: "short", year: "numeric",
//     }) + " " + d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
//   };

//   return (
//     <Box
//       sx={{
//         display: "flex",
//         gap: 2,
//         py: 1.5,
//         "&:not(:last-child)": { borderBottom: "1px solid #f1f5f9" },
//       }}
//     >
//       {/* Avatar */}
//       <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
//         <Avatar
//           sx={{
//             width: 30,
//             height: 30,
//             fontSize: "11px",
//             fontWeight: 700,
//             backgroundColor: entry.userColor,
//           }}
//         >
//           {entry.userInitials}
//         </Avatar>
//         <Box sx={{ width: 1, flex: 1, backgroundColor: "#f1f5f9", mt: 0.5, minHeight: 16 }} />
//       </Box>

//       {/* Content */}
//       <Box sx={{ flex: 1, minWidth: 0 }}>
//         {/* Top row: user + field + timestamp */}
//         <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 0.75, mb: 0.5 }}>
//           <Typography sx={{ fontSize: "13px", fontWeight: 700, color: "#1e293b" }}>
//             {entry.user}
//           </Typography>
//           <Typography sx={{ fontSize: "12px", color: "#94a3b8" }}>changed</Typography>
//           <Chip
//             label={entry.field}
//             size="small"
//             sx={{
//               height: 18,
//               fontSize: "10px",
//               fontWeight: 600,
//               backgroundColor: fieldStyle.bg,
//               color: fieldStyle.color,
//               border: "none",
//             }}
//           />
//           <Typography sx={{ fontSize: "11px", color: "#000", ml: "auto" }}>
//             {formatDate(entry.timestamp)}
//           </Typography>
//         </Box>

//         {/* Old → New value */}
//         <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: entry.comment ? 0.75 : 0 }}>
//           {entry.field === "Status" ? (
//             <>
//               <Chip
//                 label={entry.oldValue}
//                 size="small"
//                 sx={{
//                   height: 20,
//                   fontSize: "11px",
//                   backgroundColor: STATUS_COLORS[entry.oldValue]?.bg ?? "#f1f5f9",
//                   color: STATUS_COLORS[entry.oldValue]?.text ?? "#374151",
//                   border: `1px solid ${STATUS_COLORS[entry.oldValue]?.border ?? "#e2e8f0"}`,
//                 }}
//               />
//               <Typography sx={{ fontSize: "12px", color: "#94a3b8" }}>→</Typography>
//               <Chip
//                 label={entry.newValue}
//                 size="small"
//                 sx={{
//                   height: 20,
//                   fontSize: "11px",
//                   backgroundColor: STATUS_COLORS[entry.newValue]?.bg ?? "#f1f5f9",
//                   color: STATUS_COLORS[entry.newValue]?.text ?? "#374151",
//                   border: `1px solid ${STATUS_COLORS[entry.newValue]?.border ?? "#e2e8f0"}`,
//                 }}
//               />
//             </>
//           ) : (
//             <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//               <Typography
//                 sx={{
//                   fontSize: "12px",
//                   color: "#64748b",
//                   backgroundColor: "#f8fafc",
//                   border: "1px solid #e2e8f0",
//                   borderRadius: "4px",
//                   px: 1,
//                   py: 0.25,
//                   textDecoration: "line-through",
//                 }}
//               >
//                 {entry.oldValue || "—"}
//               </Typography>
//               <Typography sx={{ fontSize: "12px", color: "#94a3b8" }}>→</Typography>
//               <Typography
//                 sx={{
//                   fontSize: "12px",
//                   color: "#1e293b",
//                   backgroundColor: "#f0fdf4",
//                   border: "1px solid #bbf7d0",
//                   borderRadius: "4px",
//                   px: 1,
//                   py: 0.25,
//                   fontWeight: 500,
//                 }}
//               >
//                 {entry.newValue || "—"}
//               </Typography>
//             </Box>
//           )}
//         </Box>

//         {/* Comment */}
//         {entry.comment && (
//           <Box
//             sx={{
//               mt: 0.75,
//               px: 1.5,
//               py: 1,
//               backgroundColor: "#fffbeb",
//               border: "1px solid #fde68a",
//               borderLeft: "3px solid #f59e0b",
//               borderRadius: "4px",
//             }}
//           >
//             <Typography sx={{ fontSize: "12px", color: "#78350f", lineHeight: 1.5 }}>
//                {entry.comment}
//             </Typography>
//           </Box>
//         )}
//       </Box>
//     </Box>
//   );
// };

// // ── Main exported component ──────────────────────────────────────
// export const HistoryTab = ({ eventId }: { eventId: number }) => {
//   const history = allEventHistory.filter((h) => h.eventId === eventId);

//   if (history.length === 0) {
//     return (
//       <Box sx={{ textAlign: "center", py: 6 }}>
//         <Typography sx={{ fontSize: "13px", color: "#9ca3af" }}>
//           No history recorded for this event yet.
//         </Typography>
//       </Box>
//     );
//   }

//   // Sort oldest → newest for timeline
//   const sorted = [...history].sort(
//     (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
//   );

//   // Stats
//   const statusChanges = history.filter((h) => h.field === "Status").length;
//   const contributors = [...new Set(history.map((h) => h.user))];

//   return (
//     <Box sx={{ px: 1 }}>
//       {/* Stats row */}
//       <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
//         {[
//           { label: "Total Changes", value: history.length },
//           { label: "Status Changes", value: statusChanges },
//           { label: "Contributors", value: contributors.length },
//         ].map(({ label, value }) => (
//           <Box
//             key={label}
//             sx={{
//               flex: 1,
//               minWidth: 80,
//               textAlign: "center",
//               backgroundColor: "#f8fafc",
//               border: "1px solid #e2e8f0",
//               borderRadius: "8px",
//               py: 1,
//               px: 1.5,
//             }}
//           >
//             <Typography sx={{ fontSize: "18px", fontWeight: 700, color: "#1e293b" }}>
//               {value}
//             </Typography>
//             <Typography sx={{ fontSize: "10px", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>
//               {label}
//             </Typography>
//           </Box>
//         ))}
//       </Box>

//       {/* State graph */}
//       <StateGraph history={history} />

//       {/* Timeline header */}
//       <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
//         <Typography sx={{ fontSize: "12px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>
//           Change Timeline
//         </Typography>
//         <Divider sx={{ flex: 1 }} />
//       </Box>

//       {/* Timeline entries */}
//       <Box>
//         {sorted.map((entry) => (
//           <HistoryEntryRow key={entry.id} entry={entry} />
//         ))}
//       </Box>
//     </Box>
//   );
// };



import { Box, Typography, Avatar, Chip, Divider } from "@mui/material";

// ── Types ────────────────────────────────────────────────────────
export interface HistoryEntry {
  history_id: string;
  action: string;
  performed_by_name: string;
  detail: string;
  timestamp: string;
}

// ── Action badge colors ──────────────────────────────────────────
const ACTION_STYLES: Record<string, { bg: string; color: string; border: string }> = {
  created:     { bg: "#dcfce7", color: "#166534", border: "#bbf7d0" },
  updated:     { bg: "#dbeafe", color: "#1e40af", border: "#bfdbfe" },
  approved:    { bg: "#d1fae5", color: "#065f46", border: "#6ee7b7" },
  rejected:    { bg: "#fee2e2", color: "#991b1b", border: "#fca5a5" },
  deleted:     { bg: "#fee2e2", color: "#991b1b", border: "#fca5a5" },
  commented:   { bg: "#fef3c7", color: "#92400e", border: "#fde68a" },
  resubmitted: { bg: "#ede9fe", color: "#5b21b6", border: "#c4b5fd" },
  assigned:    { bg: "#fce7f3", color: "#9d174d", border: "#f9a8d4" },
  closed:      { bg: "#f1f5f9", color: "#475569", border: "#cbd5e1" },
};

const AVATAR_COLORS = [
  "#6366f1","#ec4899","#f59e0b","#10b981","#3b82f6",
  "#8b5cf6","#ef4444","#06b6d4","#84cc16","#f97316",
];

// ── Helpers ──────────────────────────────────────────────────────
const nameColorCache: Record<string, string> = {};
function getAvatarColor(name: string) {
  if (!nameColorCache[name]) {
    let h = 0;
    for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
    nameColorCache[name] = AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
  }
  return nameColorCache[name];
}

function getInitials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map(w => w[0].toUpperCase()).join("");
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return (
    d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) +
    " " +
    d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
  );
}

function getActionStyle(action: string) {
  return ACTION_STYLES[action?.toLowerCase()] ?? { bg: "#f1f5f9", color: "#374151", border: "#e2e8f0" };
}

// ── Single history entry ─────────────────────────────────────────
const HistoryEntryRow = ({ entry, isLast }: { entry: HistoryEntry; isLast: boolean }) => {
  const color  = getAvatarColor(entry.performed_by_name || "?");
  const inits  = getInitials(entry.performed_by_name || "?");
  const aStyle = getActionStyle(entry.action);

  return (
    <Box sx={{ display: "flex", gap: 2, py: 1.5, "&:not(:last-child)": { borderBottom: "1px solid #f1f5f9" } }}>
      {/* Avatar + connector line */}
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
        <Avatar sx={{ width: 30, height: 30, fontSize: "11px", fontWeight: 700, backgroundColor: color }}>
          {inits}
        </Avatar>
        {!isLast && <Box sx={{ width: 1, flex: 1, backgroundColor: "#f1f5f9", mt: 0.5, minHeight: 16 }} />}
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        {/* Top row */}
        <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 0.75, mb: 0.75 }}>
          <Typography sx={{ fontSize: "13px", fontWeight: 700, color: "#1e293b" }}>
            {entry.performed_by_name || "Unknown"}
          </Typography>
          <Typography sx={{ fontSize: "12px", color: "#94a3b8" }}>performed</Typography>
          <Chip
            label={entry.action}
            size="small"
            sx={{
              height: 18, fontSize: "10px", fontWeight: 600,
              backgroundColor: aStyle.bg, color: aStyle.color,
              border: `1px solid ${aStyle.border}`,
            }}
          />
          <Typography sx={{ fontSize: "11px", color: "#94a3b8", ml: "auto" }}>
            {formatDate(entry.timestamp)}
          </Typography>
        </Box>

        {/* Detail */}
        {entry.detail && (
          <Box sx={{
            px: 1.5, py: 1,
            backgroundColor: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderRadius: "4px",
          }}>
            <Typography sx={{ fontSize: "12px", color: "#64748b", lineHeight: 1.5 }}>
              {entry.detail}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

// ── Main exported component ──────────────────────────────────────
export const HistoryTab = ({ history }: { history: HistoryEntry[] }) => {

  console.log("Rendering the history &&&&&&&&&&&&&&&&&&&&&&&&&&&",history)
  if (!history || history.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 6 }}>
        <Typography sx={{ fontSize: "13px", color: "#9ca3af" }}>
          No history recorded for this event yet.
        </Typography>
      </Box>
    );
  }

  const sorted = [...history].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  const contributors = [...new Set(history.map(h => h.performed_by_name))].length;
  const uniqueActions = [...new Set(history.map(h => h.action?.toLowerCase()))].length;

  return (
    <Box sx={{ px: 1 }}>
      {/* Stats */}
      <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
        {[
          { label: "Total Changes", value: history.length },
          { label: "Contributors",  value: contributors },
          { label: "Actions",       value: uniqueActions },
        ].map(({ label, value }) => (
          <Box key={label} sx={{
            flex: 1, minWidth: 80, textAlign: "center",
            backgroundColor: "#f8fafc", border: "1px solid #e2e8f0",
            borderRadius: "8px", py: 1, px: 1.5,
          }}>
            <Typography sx={{ fontSize: "18px", fontWeight: 700, color: "#1e293b" }}>{value}</Typography>
            <Typography sx={{ fontSize: "10px", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              {label}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Timeline header */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
        <Typography sx={{ fontSize: "12px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Change Timeline
        </Typography>
        <Divider sx={{ flex: 1 }} />
      </Box>

      {/* Entries */}
      <Box>
        {sorted.map((entry, i) => (
          <HistoryEntryRow key={entry.history_id} entry={entry} isLast={i === sorted.length - 1} />
        ))}
      </Box>
    </Box>
  );
};