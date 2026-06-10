import { useState, useRef, useCallback } from "react";
import { Box, Typography, IconButton, Chip, LinearProgress } from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import ImageIcon from "@mui/icons-material/Image";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import TableChartIcon from "@mui/icons-material/TableChart";
import CodeIcon from "@mui/icons-material/Code";
import FolderZipIcon from "@mui/icons-material/FolderZip";
import VideoFileIcon from "@mui/icons-material/VideoFile";
import AudioFileIcon from "@mui/icons-material/AudioFile";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { createPortal } from "react-dom";

// ── Types ────────────────────────────────────────────────────────
export interface Attachment {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedBy: string;
  uploadedAt: string;
  file: File;
  previewUrl?: string;
}

interface UploadingFile {
  id: string;
  name: string;
  progress: number;
}

interface AttachmentTabProps {
  eventId: number;
  attachments: Attachment[];
  onAttachmentsChange: (
    attachments: Attachment[] | ((prev: Attachment[]) => Attachment[])
  ) => void;
}

// ── Helpers ──────────────────────────────────────────────────────
const formatSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const formatDate = (iso: string): string => {
  const d = new Date(iso);
  return (
    d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) +
    " " +
    d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
  );
};

const getFileIcon = (type: string) => {
  if (type.startsWith("image/"))   return <ImageIcon sx={{ fontSize: 28, color: "#10b981" }} />;
  if (type === "application/pdf")  return <PictureAsPdfIcon sx={{ fontSize: 28, color: "#ef4444" }} />;
  if (type.includes("spreadsheet") || type.includes("excel") || type.includes("csv"))
    return <TableChartIcon sx={{ fontSize: 28, color: "#22c55e" }} />;
  if (type.includes("zip") || type.includes("rar") || type.includes("tar"))
    return <FolderZipIcon sx={{ fontSize: 28, color: "#f59e0b" }} />;
  if (type.startsWith("video/"))   return <VideoFileIcon sx={{ fontSize: 28, color: "#8b5cf6" }} />;
  if (type.startsWith("audio/"))   return <AudioFileIcon sx={{ fontSize: 28, color: "#06b6d4" }} />;
  if (type.includes("javascript") || type.includes("json") || type.includes("html") || type.includes("css"))
    return <CodeIcon sx={{ fontSize: 28, color: "#6366f1" }} />;
  return <InsertDriveFileIcon sx={{ fontSize: 28, color: "#64748b" }} />;
};

const getFileColor = (type: string): string => {
  if (type.startsWith("image/"))  return "#d1fae5";
  if (type === "application/pdf") return "#fee2e2";
  if (type.includes("spreadsheet") || type.includes("excel") || type.includes("csv")) return "#dcfce7";
  if (type.includes("zip"))       return "#fef3c7";
  if (type.startsWith("video/"))  return "#ede9fe";
  if (type.startsWith("audio/"))  return "#e0f2fe";
  return "#f1f5f9";
};

// ── Drop Zone ────────────────────────────────────────────────────
const DropZone = ({ onFiles }: { onFiles: (files: File[]) => void }) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const files = Array.from(e.dataTransfer.files);
      if (files.length) onFiles(files);
    },
    [onFiles]
  );

  return (
    <Box
      onDrop={handleDrop}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onClick={() => inputRef.current?.click()}
      sx={{
        border: `2px dashed ${isDragging ? "#6366f1" : "#cbd5e1"}`,
        borderRadius: "10px",
        backgroundColor: isDragging ? "#eef2ff" : "#f8fafc",
        py: 4,
        px: 3,
        textAlign: "center",
        cursor: "pointer",
        transition: "all 0.2s",
        "&:hover": { borderColor: "#6366f1", backgroundColor: "#eef2ff" },
      }}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        style={{ display: "none" }}
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []);
          if (files.length) onFiles(files);
          e.target.value = "";
        }}
      />
      <UploadFileIcon sx={{ fontSize: 36, color: isDragging ? "#6366f1" : "#94a3b8", mb: 1 }} />
      <Typography sx={{ fontSize: "14px", fontWeight: 600, color: isDragging ? "#6366f1" : "#475569" }}>
        Drop files here or click to upload
      </Typography>
      <Typography sx={{ fontSize: "12px", color: "#94a3b8", mt: 0.5 }}>
        Supports images, PDFs, documents, spreadsheets, and more
      </Typography>
    </Box>
  );
};

// ── Attachment Row ───────────────────────────────────────────────
const AttachmentRow = ({
  attachment,
  onDelete,
  onPreview,
  onDownload,
}: {
  attachment: Attachment;
  onDelete: (id: string) => void;
  onPreview: (attachment: Attachment) => void;
  onDownload: (attachment: Attachment) => void;
}) => {
  const isPreviewable =
    attachment.type.startsWith("image/") ||
    attachment.type === "application/pdf";

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        px: 2,
        py: 1.5,
        borderRadius: "8px",
        border: "1px solid #e2e8f0",
        backgroundColor: "#fff",
        "&:hover": { backgroundColor: "#f8fafc", borderColor: "#cbd5e1" },
        "&:hover .attachment-actions": { opacity: 1 },
        transition: "all 0.15s",
      }}
    >
      {/* File icon */}
      <Box
        sx={{
          width: 44,
          height: 44,
          borderRadius: "8px",
          backgroundColor: getFileColor(attachment.type),
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {getFileIcon(attachment.type)}
      </Box>

      {/* Info */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          sx={{
            fontSize: "13px",
            fontWeight: 600,
            color: "#1e293b",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {attachment.name}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.25, flexWrap: "wrap" }}>
          <Typography sx={{ fontSize: "11px", color: "#94a3b8" }}>
            {formatSize(attachment.size)}
          </Typography>
          <Typography sx={{ fontSize: "11px", color: "#cbd5e1" }}>•</Typography>
          <Typography sx={{ fontSize: "11px", color: "#94a3b8" }}>
            {attachment.uploadedBy}
          </Typography>
          <Typography sx={{ fontSize: "11px", color: "#cbd5e1" }}>•</Typography>
          <Typography sx={{ fontSize: "11px", color: "#94a3b8" }}>
            {formatDate(attachment.uploadedAt)}
          </Typography>
        </Box>
      </Box>

      {/* Actions — visible on hover */}
      <Box
        className="attachment-actions"
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          opacity: 0,
          transition: "opacity 0.15s",
          flexShrink: 0,
        }}
      >
        {isPreviewable && (
          <IconButton
            size="small"
            onClick={() => onPreview(attachment)}
            sx={{ color: "#6366f1", "&:hover": { backgroundColor: "#eef2ff" } }}
            title="Preview"
          >
            <VisibilityIcon sx={{ fontSize: 16 }} />
          </IconButton>
        )}

        {/* ← clean download button, just calls onDownload */}
        <IconButton
          size="small"
          onClick={() => onDownload(attachment)}
          sx={{ color: "#0ea5e9", "&:hover": { backgroundColor: "#e0f2fe" } }}
          title="Download"
        >
          <DownloadIcon sx={{ fontSize: 16 }} />
        </IconButton>

        <IconButton
          size="small"
          onClick={() => onDelete(attachment.id)}
          sx={{ color: "#ef4444", "&:hover": { backgroundColor: "#fee2e2" } }}
          title="Delete"
        >
          <DeleteIcon sx={{ fontSize: 16 }} />
        </IconButton>
      </Box>
    </Box>
  );
};

// ── Preview Modal ────────────────────────────────────────────────
const PreviewModal = ({
  attachment,
  onClose,
}: {
  attachment: Attachment;
  onClose: () => void;
}) => {
  return createPortal(
    <Box
      onClick={onClose}
      sx={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.75)",
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 3,
      }}
    >
      <Box
        onClick={(e) => e.stopPropagation()}
        sx={{
          backgroundColor: "#fff",
          borderRadius: "12px",
          overflow: "hidden",
          maxWidth: "80vw",
          maxHeight: "85vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 2,
            py: 1.5,
            borderBottom: "1px solid #e2e8f0",
          }}
        >
          <Typography sx={{ fontSize: "14px", fontWeight: 600, color: "#1e293b" }}>
            {attachment.name}
          </Typography>
          <IconButton size="small" onClick={onClose}>✕</IconButton>
        </Box>

        <Box sx={{ overflow: "auto", flex: 1, p: 2 }}>
          {attachment.type.startsWith("image/") && attachment.previewUrl ? (
            <img
              src={attachment.previewUrl}
              alt={attachment.name}
              style={{
                maxWidth: "100%",
                maxHeight: "70vh",
                objectFit: "contain",
                display: "block",
                margin: "0 auto",
              }}
            />
          ) : attachment.type === "application/pdf" && attachment.previewUrl ? (
            <iframe
              src={attachment.previewUrl}
              title={attachment.name}
              style={{ width: "70vw", height: "70vh", border: "none" }}
            />
          ) : null}
        </Box>
      </Box>
    </Box>,
    document.body
  );
};

// ── Main Component ───────────────────────────────────────────────
export const AttachmentTab = ({
  attachments,
  onAttachmentsChange,
}: AttachmentTabProps) => {
  const [uploading, setUploading] = useState<UploadingFile[]>([]);
  const [preview, setPreview]     = useState<Attachment | null>(null);
  const [filter, setFilter]       = useState<"all" | "images" | "docs" | "other">("all");

  // ── defined here, passed down to AttachmentRow ──
  const handleDownload = (attachment: Attachment) => {
    const url = URL.createObjectURL(attachment.file);
    const link = document.createElement("a");
    link.href = url;
    link.download = attachment.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 100);
  };

  // ── revokes previewUrl if exists, then removes from state ──
  const handleDelete = (id: string) => {
    const target = attachments.find((a) => a.id === id);
    if (target?.previewUrl) {
      URL.revokeObjectURL(target.previewUrl);
    }
    onAttachmentsChange((prev) => prev.filter((a) => a.id !== id));
  };

  const handleFiles = (files: File[]) => {
    const oversized = files.filter((f) => f.size > 50 * 1024 * 1024);
    if (oversized.length > 0) {
      alert(`These files exceed 50MB:\n${oversized.map((f) => f.name).join("\n")}`);
    }
    const valid = files.filter((f) => f.size <= 50 * 1024 * 1024);
    if (!valid.length) return;

    const newUploading: UploadingFile[] = valid.map((f) => ({
      id: `upload-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      name: f.name,
      progress: 0,
    }));
    setUploading((prev) => [...prev, ...newUploading]);

    valid.forEach((file, i) => {
      const uploadId = newUploading[i].id;
      let progress = 0;

      const interval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress >= 100) {
          clearInterval(interval);

          const newAttachment: Attachment = {
            id:         uploadId,
            name:       file.name,
            size:       file.size,
            type:       file.type || "application/octet-stream",
            uploadedBy: "You",
            uploadedAt: new Date().toISOString(),
            file:       file,
            previewUrl:
              file.type.startsWith("image/") || file.type === "application/pdf"
                ? URL.createObjectURL(file)
                : undefined,
          };

          onAttachmentsChange((prev) => [...prev, newAttachment]);
          setTimeout(() => {
            setUploading((prev) => prev.filter((u) => u.id !== uploadId));
          }, 300);
        } else {
          setUploading((prev) =>
            prev.map((u) => (u.id === uploadId ? { ...u, progress } : u))
          );
        }
      }, 150);
    });
  };

  // ── Filter ───────────────────────────────────────
  const filtered = attachments.filter((a) => {
    if (filter === "images") return a.type.startsWith("image/");
    if (filter === "docs")   return a.type.includes("pdf") || a.type.includes("word") || a.type.includes("document") || a.type.includes("text");
    if (filter === "other")  return !a.type.startsWith("image/") && !a.type.includes("pdf") && !a.type.includes("word");
    return true;
  });

  // ── Group by date ────────────────────────────────
  const grouped: Record<string, Attachment[]> = {};
  filtered.forEach((a) => {
    const day = new Date(a.uploadedAt).toLocaleDateString("en-GB", {
      day: "2-digit", month: "short", year: "numeric",
    });
    if (!grouped[day]) grouped[day] = [];
    grouped[day].push(a);
  });

  const filterOptions: { key: typeof filter; label: string }[] = [
    { key: "all",    label: `All (${attachments.length})` },
    { key: "images", label: `Images (${attachments.filter((a) => a.type.startsWith("image/")).length})` },
    { key: "docs",   label: `Docs (${attachments.filter((a) => a.type.includes("pdf") || a.type.includes("word") || a.type.includes("document")).length})` },
    { key: "other",  label: `Other (${attachments.filter((a) => !a.type.startsWith("image/") && !a.type.includes("pdf") && !a.type.includes("word")).length})` },
  ];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, p: 1 }}>

      <DropZone onFiles={handleFiles} />

      {/* Upload progress bars */}
      {uploading.length > 0 && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {uploading.map((u) => (
            <Box
              key={u.id}
              sx={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px", px: 2, py: 1.5 }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                <Typography sx={{ fontSize: "12px", fontWeight: 600, color: "#475569" }}>
                  {u.name}
                </Typography>
                <Typography sx={{ fontSize: "12px", color: "#94a3b8" }}>
                  {Math.round(u.progress)}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={u.progress}
                sx={{
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: "#e2e8f0",
                  "& .MuiLinearProgress-bar": { backgroundColor: "#6366f1", borderRadius: 2 },
                }}
              />
            </Box>
          ))}
        </Box>
      )}

      {/* Filter chips */}
      {attachments.length > 0 && (
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          {filterOptions.map(({ key, label }) => (
            <Chip
              key={key}
              label={label}
              size="small"
              onClick={() => setFilter(key)}
              sx={{
                fontSize: "12px",
                height: 26,
                cursor: "pointer",
                backgroundColor: filter === key ? "#6366f1" : "#f1f5f9",
                color: filter === key ? "#fff" : "#475569",
                border: filter === key ? "none" : "1px solid #e2e8f0",
                "&:hover": { backgroundColor: filter === key ? "#4f46e5" : "#e2e8f0" },
              }}
            />
          ))}
        </Box>
      )}

      {/* List */}
      {attachments.length === 0 && uploading.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography sx={{ fontSize: "13px", color: "#9ca3af" }}>
            No attachments yet. Drop files above to upload.
          </Typography>
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {Object.entries(grouped).map(([date, items]) => (
            <Box key={date}>
              <Typography
                sx={{
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "#94a3b8",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  mb: 1,
                }}
              >
                {date}
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {items.map((a) => (
                  <AttachmentRow
                    key={a.id}
                    attachment={a}
                    onDelete={handleDelete}
                    onPreview={setPreview}
                    onDownload={handleDownload}  // ← defined in parent, passed down
                  />
                ))}
              </Box>
            </Box>
          ))}
        </Box>
      )}

      {preview && (
        <PreviewModal attachment={preview} onClose={() => setPreview(null)} />
      )}
    </Box>
  );
};