// import { useState } from "react";
// import { Box, Typography, IconButton, TextField } from "@mui/material";
// import AddIcon from "@mui/icons-material/Add";
// import EditIcon from "@mui/icons-material/Edit";
// import CheckIcon from "@mui/icons-material/Check";
// import CloseIcon from "@mui/icons-material/Close";
// import DeleteIcon from "@mui/icons-material/Delete";
// import LinkIcon from "@mui/icons-material/Link";
// // import CampaignIcon from "@mui/icons-material/Campaign";

// export interface RelatedItem {
//   id: number;
//   label: string;
// }

// interface RelatedItemsProps {
//   tasks: RelatedItem[];
//   campaigns: RelatedItem[];
//   onTasksChange: (items: RelatedItem[]) => void;
//   onCampaignsChange: (items: RelatedItem[]) => void;
// }

// // Single editable item row
// const ItemRow = ({
//   item,
//   onSave,
//   onDelete,
// }: {
//   item: RelatedItem;
//   onSave: (id: number, label: string) => void;
//   onDelete: (id: number) => void;
// }) => {
//   const [editing, setEditing] = useState(false);
//   const [val, setVal] = useState(item.label);

//   const handleSave = () => {
//     if (!val.trim()) return;
//     onSave(item.id, val.trim());
//     setEditing(false);
//   };

//   const handleCancel = () => {
//     setVal(item.label);
//     setEditing(false);
//   };

//   if (editing) {
//     return (
//       <Box
//         sx={{
//           display: "flex",
//           alignItems: "center",
//           gap: 0.5,
//           py: 0.5,
//         }}
//       >
//         <TextField
//           size="small"
//           value={val}
//           autoFocus
//           onChange={(e) => setVal(e.target.value)}
//           onKeyDown={(e) => {
//             if (e.key === "Enter") handleSave();
//             if (e.key === "Escape") handleCancel();
//           }}
//           sx={{
//             flex: 1,
//             "& .MuiInputBase-root": { height: 28, fontSize: "13px" },
//             "& .MuiOutlinedInput-notchedOutline": { borderColor: "#6366f1" },
//           }}
//         />
//         <IconButton size="small" onClick={handleSave} sx={{ color: "#16a34a" }}>
//           <CheckIcon sx={{ fontSize: 16 }} />
//         </IconButton>
//         <IconButton size="small" onClick={handleCancel} sx={{ color: "#6b7280" }}>
//           <CloseIcon sx={{ fontSize: 16 }} />
//         </IconButton>
//       </Box>
//     );
//   }

//   return (
//     <Box
//       sx={{
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "space-between",
//         py: 0.5,
//         px: 1,
//         borderRadius: "6px",
//         "&:hover": { backgroundColor: "#f1f5f9" },
//         "&:hover .row-actions": { opacity: 1 },
//         cursor: "default",
//       }}
//     >
//       <Typography
//         sx={{
//           fontSize: "13px",
//           color: "#1e40af",
//           textDecoration: "underline",
//           cursor: "pointer",
//           flex: 1,
//           overflow: "hidden",
//           textOverflow: "ellipsis",
//           whiteSpace: "nowrap",
//         }}
//       >
//         {item.label}
//       </Typography>

//       <Box
//         className="row-actions"
//         sx={{
//           display: "flex",
//           alignItems: "center",
//           opacity: 0,
//           transition: "opacity 0.15s",
//           ml: 1,
//         }}
//       >
//         <IconButton
//           size="small"
//           onClick={() => setEditing(true)}
//           sx={{ color: "#6b7280", p: "2px" }}
//         >
//           <EditIcon sx={{ fontSize: 14 }} />
//         </IconButton>
//         <IconButton
//           size="small"
//           onClick={() => onDelete(item.id)}
//           sx={{ color: "#ef4444", p: "2px" }}
//         >
//           <DeleteIcon  sx={{ fontSize: 14 }} />
//         </IconButton>
//       </Box>
//     </Box>
//   );
// };

// // Column component
// const RelatedColumn = ({
//   title,
//   icon,
//   items,
//   accentColor,
//   onSave,
//   onDelete,
//   onAdd,
// }: {
//   title: string;
//   icon: React.ReactNode;
//   items: RelatedItem[];
//   accentColor: string;
//   onSave: (id: number, label: string) => void;
//   onDelete: (id: number) => void;
//   onAdd: (label: string) => void;
// }) => {
//   const [adding, setAdding] = useState(false);
//   const [newVal, setNewVal] = useState("");

//   const handleAdd = () => {
//     if (!newVal.trim()) return;
//     onAdd(newVal.trim());
//     setNewVal("");
//     setAdding(false);
//   };

//   return (
//     <Box
//       sx={{
//         flex: 1,
//         borderLeft: `4px solid ${accentColor}`,
//         pl: 1.5,
//         minWidth: 0,
//       }}
//     >
//       {/* Column header */}
//       <Box
//         sx={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//           mb: 1,
//         }}
//       >
//         <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
//           {icon}
//           <Typography sx={{ fontSize: "13px", fontWeight: 700, color: "#374151" }}>
//             {title}
//           </Typography>
//           <Typography
//             sx={{
//               fontSize: "11px",
//               color: "#9ca3af",
//               ml: 0.5,
//             }}
//           >
//             ({items.length})
//           </Typography>
//         </Box>

//         <IconButton
//           size="small"
//           onClick={() => setAdding(true)}
//           sx={{
//             color: accentColor,
//             p: "2px",
//             "&:hover": { backgroundColor: `${accentColor}15` },
//           }}
//         >
//           <AddIcon sx={{ fontSize: 16 }} />
//         </IconButton>
//       </Box>

//       {/* Items */}
//       <Box sx={{ display: "flex", flexDirection: "column", gap: 0.25 }}>
//         {items.length === 0 && !adding && (
//           <Typography
//             sx={{
//               fontSize: "12px",
//               color: "#9ca3af",
//               fontStyle: "italic",
//               py: 0.5,
//               px: 1,
//             }}
//           >
//             No {title.toLowerCase()} linked
//           </Typography>
//         )}

//         {items.map((item) => (
//           <ItemRow
//             key={item.id}
//             item={item}
//             onSave={onSave}
//             onDelete={onDelete}
//           />
//         ))}

//         {/* Add new row */}
//         {adding && (
//           <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, py: 0.5 }}>
//             <TextField
//               size="small"
//               value={newVal}
//               autoFocus
//               placeholder={`Add ${title.toLowerCase()}...`}
//               onChange={(e) => setNewVal(e.target.value)}
//               onKeyDown={(e) => {
//                 if (e.key === "Enter") handleAdd();
//                 if (e.key === "Escape") { setAdding(false); setNewVal(""); }
//               }}
//               sx={{
//                 flex: 1,
//                 "& .MuiInputBase-root": { height: 28, fontSize: "13px" },
//                 "& .MuiOutlinedInput-notchedOutline": { borderColor: accentColor },
//               }}
//             />
//             <IconButton size="small" onClick={handleAdd} sx={{ color: "#16a34a" }}>
//               <CheckIcon sx={{ fontSize: 16 }} />
//             </IconButton>
//             <IconButton
//               size="small"
//               onClick={() => { setAdding(false); setNewVal(""); }}
//               sx={{ color: "#6b7280" }}
//             >
//               <CloseIcon sx={{ fontSize: 16 }} />
//             </IconButton>
//           </Box>
//         )}
//       </Box>
//     </Box>
//   );
// };

// // Main exported component
// export const RelatedItems = ({
//   tasks,
//   campaigns,
//   onTasksChange,
//   onCampaignsChange,
// }: RelatedItemsProps) => {

//   const handleSaveTask = (id: number, label: string) => {
//     onTasksChange(tasks.map((t) => (t.id === id ? { ...t, label } : t)));
//   };

//   const handleDeleteTask = (id: number) => {
//     onTasksChange(tasks.filter((t) => t.id !== id));
//   };

//   const handleAddTask = (label: string) => {
//     onTasksChange([...tasks, { id: Date.now(), label }]);
//   };

//   const handleSaveCampaign = (id: number, label: string) => {
//     onCampaignsChange(campaigns.map((c) => (c.id === id ? { ...c, label } : c)));
//   };

//   const handleDeleteCampaign = (id: number) => {
//     onCampaignsChange(campaigns.filter((c) => c.id !== id));
//   };

//   const handleAddCampaign = (label: string) => {
//     onCampaignsChange([...campaigns, { id: Date.now(), label }]);
//   };

//   return (
//     <Box
//       sx={{
//         pl: 0,
//         mt: 2,
//       }}
//     >
//       <Typography
//         sx={{ fontWeight: 700, fontSize: "13px", ml: 4, mb: 1.5 }}
//       >
//         Related Items
//       </Typography>

//       <Box
//         sx={{
//           display: "flex",
//           gap: 3,
//           ml: 4,
//           mr: 2,
//         }}
//       >
//         <RelatedColumn
//           title="Related Tasks"
//           icon={<LinkIcon sx={{ fontSize: 14, color: "#2563eb" }} />}
//           items={tasks}
//           accentColor="#2563eb"
//           onSave={handleSaveTask}
//           onDelete={handleDeleteTask}
//           onAdd={handleAddTask}
//         />

//         {/* Vertical divider */}
//         <Box sx={{ width: "1px", backgroundColor: "#e5e7eb", flexShrink: 0 }} />

//         <RelatedColumn
//           title="Related Campaigns"
//           icon={<LinkIcon sx={{ fontSize: 14, color: "#7c3aed" }} />}
//           items={campaigns}
//           accentColor="#7c3aed"
//           onSave={handleSaveCampaign}
//           onDelete={handleDeleteCampaign}
//           onAdd={handleAddCampaign}
//         />
//       </Box>
//     </Box>
//   );
// };


import { useState, useRef, useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  TextField,
  Button,
  Divider,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import LinkIcon from "@mui/icons-material/Link";
import CampaignIcon from "@mui/icons-material/Campaign";
import SearchIcon from "@mui/icons-material/Search";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { createPortal } from "react-dom";

export interface RelatedItem {
  id: number;
  label: string;
  type?: string;
  itemId?: string;
  description?: string;
}

interface RelatedItemsProps {
  tasks: RelatedItem[];
  campaigns: RelatedItem[];
  onTasksChange: (items: RelatedItem[]) => void;
  onCampaignsChange: (items: RelatedItem[]) => void;
}

// ── Mock existing items to search from ──────────────────────
const EXISTING_TASKS: RelatedItem[] = [
  { id: 101, label: "Fix login bug",           itemId: "#1023", type: "Bug",   description: "Users cannot login with SSO" },
  { id: 102, label: "Dashboard redesign",      itemId: "#1024", type: "Task",  description: "Redesign the main dashboard UI" },
  { id: 103, label: "API refactor",            itemId: "#1025", type: "Task",  description: "Refactor REST API endpoints" },
  { id: 104, label: "Unit test coverage",      itemId: "#1026", type: "Task",  description: "Increase coverage to 80%" },
  { id: 105, label: "Performance audit",       itemId: "#1027", type: "Task",  description: "Audit and fix performance issues" },
  { id: 106, label: "Mobile responsiveness",   itemId: "#1028", type: "Bug",   description: "Fix mobile layout breakpoints" },
];

const EXISTING_CAMPAIGNS: RelatedItem[] = [
  { id: 201, label: "Q2 Product Launch",       itemId: "#C001", type: "Campaign", description: "Launch new product line in Q2" },
  { id: 202, label: "Summer Email Campaign",   itemId: "#C002", type: "Campaign", description: "Email drip campaign for summer" },
  { id: 203, label: "Social Media Push",       itemId: "#C003", type: "Campaign", description: "Increase social media presence" },
  { id: 204, label: "Webinar Series",          itemId: "#C004", type: "Campaign", description: "Monthly webinar series Q3" },
  { id: 205, label: "Partner Co-marketing",    itemId: "#C005", type: "Campaign", description: "Co-marketing with strategic partners" },
];

// ── Add menu popup ───────────────────────────────────────────────
const AddMenu = ({
  anchorEl,
  onClose,
  onAddNew,
  onAddExisting,
}: {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  onAddNew: () => void;
  onAddExisting: () => void;
}) => {
  if (!anchorEl) return null;

  const rect = anchorEl.getBoundingClientRect();

  return createPortal(
    <>
      {/* backdrop */}
      <Box
        onClick={onClose}
        sx={{ position: "fixed", inset: 0, zIndex: 9998 }}
      />
      {/* menu */}
      <Box
        sx={{
          position: "fixed",
          top: rect.bottom + 4,
          left: rect.left,
          zIndex: 9999,
          backgroundColor: "#fff",
          border: "1px solid #e2e8f0",
          borderRadius: "8px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          minWidth: 200,
          overflow: "hidden",
        }}
      >
        <Box
          onClick={() => { onAddNew(); onClose(); }}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            px: 2,
            py: 1.5,
            cursor: "pointer",
            "&:hover": { backgroundColor: "#f8fafc" },
            transition: "background 0.1s",
          }}
        >
          <Box
            sx={{
              width: 28,
              height: 28,
              borderRadius: "6px",
              backgroundColor: "#eef2ff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <AddIcon sx={{ fontSize: 16, color: "" }} />
          </Box>
          <Box>
            <Typography sx={{ fontSize: "13px", fontWeight: 600, color: "#1e293b" }}>
              New item
            </Typography>
            <Typography sx={{ fontSize: "11px", color: "#94a3b8" }}>
              Create and link a new item
            </Typography>
          </Box>
        </Box>

        <Divider />

        <Box
          onClick={() => { onAddExisting(); onClose(); }}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            px: 2,
            py: 1.5,
            cursor: "pointer",
            "&:hover": { backgroundColor: "#f8fafc" },
            transition: "background 0.1s",
          }}
        >
          <Box
            sx={{
              width: 28,
              height: 28,
              borderRadius: "6px",
              backgroundColor: "#f0fdf4",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <SearchIcon sx={{ fontSize: 16, color: "" }} />
          </Box>
          <Box>
            <Typography sx={{ fontSize: "13px", fontWeight: 600, color: "#1e293b" }}>
              Existing item
            </Typography>
            <Typography sx={{ fontSize: "11px", color: "#94a3b8" }}>
              Search and link an existing item
            </Typography>
          </Box>
        </Box>
      </Box>
    </>,
    document.body
  );
};

// ── New item modal ───────────────────────────────────────────────
const NewItemModal = ({
  open,
  title,
  accentColor,
  onClose,
  onAdd,
}: {
  open: boolean;
  title: string;
  accentColor: string;
  onClose: () => void;
  onAdd: (item: RelatedItem) => void;
}) => {
  const [label, setLabel]       = useState("");
  const [description, setDesc]  = useState("");
  const [type, setType]         = useState("Task");

  const handleAdd = () => {
    if (!label.trim()) return;
    onAdd({
      id:          Date.now(),
      label:       label.trim(),
      description: description.trim(),
      type,
      itemId:      `#${Math.floor(Math.random() * 9000) + 1000}`,
    });
    setLabel("");
    setDesc("");
    setType("Task");
    onClose();
  };

  if (!open) return null;

  return createPortal(
    <Box
      onClick={onClose}
      sx={{
        position: "fixed", inset: 0,
        backgroundColor: "rgba(0,0,0,0.4)",
        zIndex: 99999,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
    >
      <Box
        onClick={(e) => e.stopPropagation()}
        sx={{
          backgroundColor: "#fff",
          borderRadius: "12px",
          width: 460,
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            px: 3, py: 2,
            borderBottom: "1px solid #e2e8f0",
            borderLeft: `4px solid ${accentColor}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography sx={{ fontSize: "15px", fontWeight: 700, color: "#1e293b" }}>
            Add new {title.toLowerCase()}
          </Typography>
          <IconButton size="small" onClick={onClose}>
            <CloseIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>

        {/* Body */}
        <Box sx={{ px: 3, py: 2.5, display: "flex", flexDirection: "column", gap: 2 ,borderLeft: `4px solid ${accentColor}`,}}>
          {/* Type selector */}
          <Box>
            <Typography sx={{ fontSize: "12px", fontWeight: 600, color: "#64748b", mb: 0.75 }}>
              Type
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              {["Task","Campaign", "Feature"].map((t) => (
                <Box
                  key={t}
                  onClick={() => setType(t)}
                  sx={{
                    px: 1.5, py: 0.5,
                    borderRadius: "6px",
                    fontSize: "12px",
                    fontWeight: 500,
                    cursor: "pointer",
                    border: `1px solid ${type === t ? accentColor : "#e2e8f0"}`,
                    backgroundColor: type === t ? `${accentColor}15` : "#fff",
                    color: type === t ? accentColor : "#64748b",
                    transition: "all 0.15s",
                  }}
                >
                  {t}
                </Box>
              ))}
            </Box>
          </Box>

          {/* Title */}
          <Box>
            <Typography sx={{ fontSize: "12px", fontWeight: 600, color: "#64748b", mb: 0.75 }}>
              Title <span style={{ color: "#ef4444" }}>*</span>
            </Typography>
            <TextField
              size="small"
              fullWidth
              autoFocus
              placeholder={`Enter ${title.toLowerCase()} title...`}
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleAdd(); }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  fontSize: "13px",
                  "&.Mui-focused fieldset": { borderColor: accentColor },
                },
              }}
            />
          </Box>

          {/* Description */}
          <Box>
            <Typography sx={{ fontSize: "12px", fontWeight: 600, color: "#64748b", mb: 0.75 }}>
              Description
            </Typography>
            <TextField
              size="small"
              fullWidth
              multiline
              rows={2}
              placeholder="Optional description..."
              value={description}
              onChange={(e) => setDesc(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  fontSize: "13px",
                  "&.Mui-focused fieldset": { borderColor: accentColor },
                },
              }}
            />
          </Box>
        </Box>

        {/* Footer */}
        <Box
          sx={{
            px: 3, py: 2,
            borderTop: "1px solid #e2e8f0",
            display: "flex",
            justifyContent: "flex-end",
            borderLeft: `4px solid ${accentColor}`,
            gap: 1,
          }}
        >
          <Button
            size="small"
            onClick={onClose}
            sx={{ textTransform: "none", color: "#64748b" }}
          >
            Cancel
          </Button>
          <Button
            size="small"
            variant="contained"
            disabled={!label.trim()}
            onClick={handleAdd}
            sx={{
              textTransform: "none",
              backgroundColor: accentColor,
              "&:hover": { backgroundColor: accentColor, filter: "brightness(0.9)" },
            }}
          >
            Add item
          </Button>
        </Box>
      </Box>
    </Box>,
    document.body
  );
};

// ── Existing item modal ──────────────────────────────────────────
const ExistingItemModal = ({
  open,
  title,
  accentColor,
  existingItems,
  alreadyLinked,
  onClose,
  onLink,
}: {
  open: boolean;
  title: string;
  accentColor: string;
  existingItems: RelatedItem[];
  alreadyLinked: number[];
  onClose: () => void;
  onLink: (item: RelatedItem) => void;
}) => {
  const [query, setQuery]             = useState("");
  const [selected, setSelected]       = useState<RelatedItem | null>(null);
  const inputRef                      = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQuery("");
      setSelected(null);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const filtered = existingItems.filter(
    (item) =>
      !alreadyLinked.includes(item.id) &&
      (item.label.toLowerCase().includes(query.toLowerCase()) ||
        item.itemId?.toLowerCase().includes(query.toLowerCase()) ||
        item.description?.toLowerCase().includes(query.toLowerCase()))
  );

  if (!open) return null;

  return createPortal(
    <Box
      onClick={onClose}
      sx={{
        position: "fixed", inset: 0,
        backgroundColor: "rgba(0,0,0,0.4)",
        zIndex: 99999,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
    >
      <Box
        onClick={(e) => e.stopPropagation()}
        sx={{
          backgroundColor: "#fff",
          borderRadius: "12px",
          width: 500,
          maxHeight: "70vh",
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            px: 3, py: 2,
            borderBottom: "1px solid #e2e8f0",
            borderLeft: `4px solid ${accentColor}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography sx={{ fontSize: "15px", fontWeight: 700, color: "#1e293b" }}>
            Link existing {title.toLowerCase()}
          </Typography>
          <IconButton size="small" onClick={onClose}>
            <CloseIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>

        {/* Search */}
        <Box sx={{ px: 3, pt: 2, pb: 1 ,borderLeft: `4px solid ${accentColor}`,}}>
          <TextField
            inputRef={inputRef}
            size="small"
            fullWidth
            placeholder={`Search ${title.toLowerCase()} by title or ID...`}
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelected(null); }}
            InputProps={{
              startAdornment: (
                <SearchIcon sx={{ fontSize: 18, color: "#94a3b8", mr: 1 }} />
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                fontSize: "13px",
                "&.Mui-focused fieldset": { borderColor: accentColor },
              },
            }}
          />
        </Box>

        {/* Results */}
        <Box sx={{ flex: 1, overflowY: "auto", px: 2, pb: 1 ,borderLeft: `4px solid ${accentColor}`,}}>
          {filtered.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography sx={{ fontSize: "13px", color: "#94a3b8" }}>
                {query ? "No results found" : `No ${title.toLowerCase()} available to link`}
              </Typography>
            </Box>
          ) : (
            filtered.map((item) => (
              <Box
                key={item.id}
                onClick={() => setSelected(item)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  px: 2,
                  py: 1.5,
                  borderRadius: "8px",
                  cursor: "pointer",
                  border: `1px solid ${selected?.id === item.id ? accentColor : "transparent"}`,
                  backgroundColor: selected?.id === item.id ? `${accentColor}10` : "transparent",
                  "&:hover": { backgroundColor: selected?.id === item.id ? `${accentColor}10` : "#f8fafc" },
                  transition: "all 0.1s",
                  mb: 0.5,
                }}
              >
                {/* ID badge */}
                <Box
                  sx={{
                    px: 1,
                    py: 0.25,
                    borderRadius: "4px",
                    backgroundColor: "#f1f5f9",
                    border: "1px solid #e2e8f0",
                    flexShrink: 0,
                  }}
                >
                  <Typography sx={{ fontSize: "11px", fontWeight: 700, color: "#64748b", fontFamily: "monospace" }}>
                    {item.itemId}
                  </Typography>
                </Box>

                {/* Info */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    sx={{
                      fontSize: "13px", fontWeight: 600, color: "#1e293b",
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    }}
                  >
                    {item.label}
                  </Typography>
                  {item.description && (
                    <Typography
                      sx={{
                        fontSize: "11px", color: "#94a3b8",
                        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                      }}
                    >
                      {item.description}
                    </Typography>
                  )}
                </Box>

                {/* Type badge */}
                <Box
                  sx={{
                    px: 1, py: 0.25,
                    borderRadius: "4px",
                    backgroundColor: accentColor + "15",
                    flexShrink: 0,
                  }}
                >
                  <Typography sx={{ fontSize: "10px", fontWeight: 600, color: accentColor }}>
                    {item.type}
                  </Typography>
                </Box>

                {/* Selected check */}
                {selected?.id === item.id && (
                  <CheckIcon sx={{ fontSize: 16, color: accentColor, flexShrink: 0 }} />
                )}
              </Box>
            ))
          )}
        </Box>

        {/* Footer */}
        <Box
          sx={{
            px: 3, py: 2,
            borderTop: "1px solid #e2e8f0",
            display: "flex",
            justifyContent: "space-between",
            borderLeft: `4px solid ${accentColor}`,
            alignItems: "center",
          }}
        >
          <Typography sx={{ fontSize: "12px", color: "#94a3b8" }}>
            {filtered.length} item{filtered.length !== 1 ? "s" : ""} found
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              size="small"
              onClick={onClose}
              sx={{ textTransform: "none", color: "#64748b" }}
            >
              Cancel
            </Button>
            <Button
              size="small"
              variant="contained"
              disabled={!selected}
              onClick={() => { if (selected) { onLink(selected); onClose(); } }}
              sx={{
                textTransform: "none",
                backgroundColor: accentColor,
                "&:hover": { backgroundColor: accentColor, filter: "brightness(0.9)" },
                "&.Mui-disabled": { backgroundColor: "#e2e8f0", color: "#94a3b8" },
              }}
            >
              Link item
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>,
    document.body
  );
};

// ── Single editable item row ─────────────────────────────────────
const ItemRow = ({
  item,
  accentColor,
  onSave,
  onDelete,
}: {
  item: RelatedItem;
  accentColor: string;
  onSave: (id: number, label: string) => void;
  onDelete: (id: number) => void;
}) => {
  const [editing, setEditing] = useState(false);
  const [val, setVal]         = useState(item.label);

  const handleSave = () => {
    if (!val.trim()) return;
    onSave(item.id, val.trim());
    setEditing(false);
  };

  if (editing) {
    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, py: 0.5 }}>
        <TextField
          size="small" autoFocus value={val}
          onChange={(e) => setVal(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") handleSave(); if (e.key === "Escape") { setVal(item.label); setEditing(false); } }}
          sx={{ flex: 1, "& .MuiInputBase-root": { height: 28, fontSize: "13px" }, "& .MuiOutlinedInput-notchedOutline": { borderColor: accentColor } }}
        />
        <IconButton size="small" onClick={handleSave} sx={{ color: "#16a34a" }}>
          <CheckIcon sx={{ fontSize: 16 }} />
        </IconButton>
        <IconButton size="small" onClick={() => { setVal(item.label); setEditing(false); }} sx={{ color: "#6b7280" }}>
          <CloseIcon sx={{ fontSize: 16 }} />
        </IconButton>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        py: 0.75,
        px: 1,
        borderRadius: "6px",
        "&:hover": { backgroundColor: "#f1f5f9" },
        "&:hover .row-actions": { opacity: 1 },
        cursor: "default",
        gap: 1,
      }}
    >
      {/* ID badge if present */}
      {item.itemId && (
        <Box
          sx={{
            px: 0.75, py: 0.1,
            borderRadius: "3px",
            backgroundColor: "#f1f5f9",
            border: "1px solid #e2e8f0",
            flexShrink: 0,
          }}
        >
          <Typography sx={{ fontSize: "10px", fontWeight: 700, color: "#64748b", fontFamily: "monospace" }}>
            {item.itemId}
          </Typography>
        </Box>
      )}

      <Typography
        sx={{
          fontSize: "13px",
          color: accentColor,
          textDecoration: "underline",
          cursor: "pointer",
          flex: 1,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {item.label}
      </Typography>

      <Box className="row-actions" sx={{ display: "flex", alignItems: "center", opacity: 0, transition: "opacity 0.15s", ml: 1, gap: 0.25 }}>
        <IconButton size="small" onClick={() => setEditing(true)} sx={{ color: "#6b7280", p: "2px" }}>
          <EditIcon sx={{ fontSize: 13 }} />
        </IconButton>
        <IconButton size="small" sx={{ color: "#6b7280", p: "2px" }} title="Open">
          <OpenInNewIcon sx={{ fontSize: 13 }} />
        </IconButton>
        <IconButton size="small" onClick={() => onDelete(item.id)} sx={{ color: "#ef4444", p: "2px" }}>
          <DeleteIcon sx={{ fontSize: 13 }} />
        </IconButton>
      </Box>
    </Box>
  );
};

// ── Column ───────────────────────────────────────────────────────
const RelatedColumn = ({
  title,
  icon,
  items,
  accentColor,
  existingItems,
  onSave,
  onDelete,
  onAdd,
}: {
  title: string;
  icon: React.ReactNode;
  items: RelatedItem[];
  accentColor: string;
  existingItems: RelatedItem[];
  onSave: (id: number, label: string) => void;
  onDelete: (id: number) => void;
  onAdd: (item: RelatedItem) => void;
}) => {
  const [menuAnchor,    setMenuAnchor]    = useState<HTMLElement | null>(null);
  const [showNewModal,  setShowNewModal]  = useState(false);
  const [showExisting,  setShowExisting]  = useState(false);

  return (
    <Box sx={{ flex: 1, borderLeft: `4px solid ${accentColor}`, pl: 1.5, minWidth: 0 }}>
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          {icon}
          <Typography sx={{ fontSize: "13px", fontWeight: 700, color: "#374151" }}>
            {title}
          </Typography>
          <Typography sx={{ fontSize: "11px", color: "#9ca3af", ml: 0.5 }}>
            ({items.length})
          </Typography>
        </Box>

        <IconButton
          size="small"
          onClick={(e) => setMenuAnchor(e.currentTarget)}
          sx={{
            color: accentColor, p: "2px",
            "&:hover": { backgroundColor: `${accentColor}15` },
          }}
        >
          <AddIcon sx={{ fontSize: 16 }} />
        </IconButton>
      </Box>

      {/* Items */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.25 }}>
        {items.length === 0 && (
          <Typography sx={{ fontSize: "12px", color: "#9ca3af", fontStyle: "italic", py: 0.5, px: 1 }}>
            No {title.toLowerCase()} linked
          </Typography>
        )}
        {items.map((item) => (
          <ItemRow
            key={item.id}
            item={item}
            accentColor={accentColor}
            onSave={onSave}
            onDelete={onDelete}
          />
        ))}
      </Box>

      {/* Add menu */}
      <AddMenu
        anchorEl={menuAnchor}
        onClose={() => setMenuAnchor(null)}
        onAddNew={() => setShowNewModal(true)}
        onAddExisting={() => setShowExisting(true)}
      />

      {/* New item modal */}
      <NewItemModal
        open={showNewModal}
        title={title}
        accentColor={accentColor}
        onClose={() => setShowNewModal(false)}
        onAdd={onAdd}
      />

      {/* Existing item modal */}
      <ExistingItemModal
        open={showExisting}
        title={title}
        accentColor={accentColor}
        existingItems={existingItems}
        alreadyLinked={items.map((i) => i.id)}
        onClose={() => setShowExisting(false)}
        onLink={onAdd}
      />
    </Box>
  );
};

// ── Main exported component ──────────────────────────────────────
export const RelatedItems = ({
  tasks,
  campaigns,
  onTasksChange,
  onCampaignsChange,
}: RelatedItemsProps) => {

  const handleSaveTask     = (id: number, label: string) => onTasksChange(tasks.map((t) => t.id === id ? { ...t, label } : t));
  const handleDeleteTask   = (id: number) => onTasksChange(tasks.filter((t) => t.id !== id));
  const handleAddTask      = (item: RelatedItem) => onTasksChange([...tasks, item]);

  const handleSaveCampaign   = (id: number, label: string) => onCampaignsChange(campaigns.map((c) => c.id === id ? { ...c, label } : c));
  const handleDeleteCampaign = (id: number) => onCampaignsChange(campaigns.filter((c) => c.id !== id));
  const handleAddCampaign    = (item: RelatedItem) => onCampaignsChange([...campaigns, item]);

  return (
    <Box sx={{  pl: 0, mt: 1.5 }}>
      <Typography sx={{ fontWeight: 700, fontSize: "13px", ml: 4, mb: 1.5 }}>
        Related Items
      </Typography>

      <Box sx={{ display: "flex", gap: 3, ml: 4, mr: 2 }}>
        <RelatedColumn
          title="Related Tasks"
          icon={<LinkIcon sx={{ fontSize: 14, color: "#1a2c47" }} />}
          items={tasks}
          accentColor="#1a2c47"
          existingItems={EXISTING_TASKS}
          onSave={handleSaveTask}
          onDelete={handleDeleteTask}
          onAdd={handleAddTask}
        />

        <Box sx={{ width: "1px", backgroundColor: "#e5e7eb", flexShrink: 0 }} />

        <RelatedColumn
          title="Related Campaigns"
          icon={<CampaignIcon sx={{ fontSize: 14, color: "#1a2c47" }} />}
          items={campaigns}
          accentColor="#1a2c47"
          existingItems={EXISTING_CAMPAIGNS}
          onSave={handleSaveCampaign}
          onDelete={handleDeleteCampaign}
          onAdd={handleAddCampaign}
        />
      </Box>
    </Box>
  );
};