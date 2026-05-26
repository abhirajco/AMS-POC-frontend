import HeaderSection from "@/components/common/HeaderSection";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowLeft, ArrowRight, Filter, Plus, Search, Star, X } from 'lucide-react';
import { Link } from "react-router-dom";
import AllContent from "@/components/ui/AllContent";
import { useState, useEffect, useRef, KeyboardEvent } from "react";
import { BASE_URL } from "@/utils/BASE_URL";
import { Popover, Box, FormControl, InputLabel, Select, MenuItem, Typography, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Chip } from "@mui/material";

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
}

const TagInput = ({ tags, onChange }: TagInputProps) => {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const addTag = (raw: string) => {
    const value = raw.trim().replace(/,$/, "").trim();
    if (value && !tags.includes(value)) {
      onChange([...tags, value]);
    }
    setInputValue("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === " " || e.key === ",") {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === "Backspace" && inputValue === "" && tags.length > 0) {
      onChange(tags.slice(0, -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      addTag(inputValue);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // Auto-split if user pastes "tag1, tag2"
    if (val.includes(",")) {
      const parts = val.split(",");
      const last = parts.pop() ?? "";
      parts.forEach((p) => addTag(p));
      setInputValue(last);
    } else {
      setInputValue(val);
    }
  };

  const removeTag = (index: number) => {
    onChange(tags.filter((_, i) => i !== index));
  };

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "6px",
        alignItems: "center",
        border: "1px solid #c4c4c4",
        borderRadius: "4px",
        padding: "6px 10px",
        minHeight: "42px",
        cursor: "text",
        backgroundColor: "#fff",
      }}
    >
      {tags.map((tag, i) => (
        <span
          key={i}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
            backgroundColor: "#f0f4ff",
            border: "1px solid #c7d4f5",
            borderRadius: "4px",
            padding: "2px 8px",
            fontSize: "13px",
            color: "#1a2c47",
            fontWeight: 500,
            lineHeight: "1.6",
          }}
        >
          {tag}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              removeTag(i);
            }}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "0",
              display: "flex",
              alignItems: "center",
              color: "#6b7280",
              marginLeft: "2px",
            }}
            aria-label={`Remove tag ${tag}`}
          >
            <X size={12} strokeWidth={2.5} />
          </button>
        </span>
      ))}
      <input
        ref={inputRef}
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={() => { if (inputValue.trim()) addTag(inputValue); }}
        placeholder={tags.length === 0 ? "Add tags (space or , to confirm)" : ""}
        style={{
          border: "none",
          outline: "none",
          fontSize: "14px",
          flex: "1",
          minWidth: "120px",
          background: "transparent",
          color: "#1a2c47",
        }}
      />
    </div>
  );
};

// ─── Tag Input Label Wrapper ──────────────────────────────────────────────────

const LabeledTagInput = ({ tags, onChange }: TagInputProps) => (
  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
    <label
      style={{
        fontSize: "12px",
        color: "#6b7280",
        paddingLeft: "2px",
        fontFamily: "inherit",
      }}
    >
      Tags
    </label>
    <TagInput tags={tags} onChange={onChange} />
  </div>
);


const ContentHubPage = () => {

  const [stats, setStats] = useState({
    total: 0,
    draft: 0,
    in_review: 0,
    published: 0,
    approved: 0
  });
  const [status, setStatus] = useState("all");
  const [type, setType] = useState("all");
  const [quarter, setQuarter] = useState("");
  const [title, setTitle] = useState("");
  const [brief, setBrief] = useState("");
  const [campaignId, setCampaignId] = useState("");
  const [eventId, setEventId] = useState("");
  const [executiveId, setExecutiveId] = useState("");
  const [contentType, setContentType] = useState("");

  // Tags stored as an array internally; joined to comma-separated string for the API
  const [tagList, setTagList] = useState<string[]>([]);

  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [executives, setExecutives] = useState<any[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const open = Boolean(anchorEl);


  
  const fetchCampaigns = async () => {
    const token = localStorage.getItem("accessToken");
    const res = await fetch(`${BASE_URL}/board/campaigns/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setCampaigns(data);
  };

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const createNewContent = async () => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      toast.error("Session expired. Please login again.");
      localStorage.clear();
      navigate("/login");
      return;
    }

    const tagsString = tagList.join(",");

    try {
      const res1 = await fetch(`${BASE_URL}/content/contents/new/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          brief,
          content_type: contentType,
          campaign_id: campaignId,
          ...(eventId && { event_id: eventId }),
          tags: tagsString,
          executive_id: executiveId,
        }),
      });

      let data1: any = {};
      try 
      {
        data1 = await res1.json();
      } catch{
        data1 = {};
      }

      if (!res1.ok) {
        if (res1.status === 401) {
          toast.error("Session expired. Please login again.");
          localStorage.clear();
          navigate("/login");
          return;
        }
        if (res1.status === 403) {
          toast.error("You are not authorized to create content.");
          return;
        }
        toast.error(data1?.message || "Failed to create content.");
        return;
      }

      const contentId = data1?.content_id;
      const executiveIdFromResponse = data1?.executive_id;

      if (!contentId || !executiveIdFromResponse) {
        toast.error("Invalid response from server.");
        return;
      }

      const res2 = await fetch(
        `${BASE_URL}/content/contents/${contentId}/assign-sme/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            executive_id: executiveIdFromResponse,
          }),
        }
      );

      let data2: any = {};
      try {
        data2 = await res2.json();
      } catch {
        data2 = {};
      }

      if (!res2.ok) {
        if (res2.status === 401) {
          toast.error("Session expired. Please login again.");
          localStorage.clear();
          navigate("/login");
          return;
        }
        toast.error(data2?.message || "Failed to assign SME.");
        return;
      }

      toast.success("Content created successfully");

      setTitle("");
      setBrief("");
      setCampaignId("");
      setEventId("");
      setExecutiveId("");
      setContentType("");
      setTagList([]);
      handleClose();

      navigate("/generate-new-content", {
        state: {
          contentId,
          title,
          brief,
          contentType,
        },
      });

    } catch (err) {
      console.error("Unexpected Error:", err);
      toast.error("Network error. Please try again.");
    }
  };

  const fetchEvents = async (id: string) => {
    const token = localStorage.getItem("accessToken");
    const res = await fetch(
      `${BASE_URL}/board/campaigns/${id}/events/`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const data = await res.json();
    setEvents(data.events || []);
  };

  const fetchExecutives = async () => {
    const token = localStorage.getItem("accessToken");
    const res = await fetch(`${BASE_URL}/content/contents/exe`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setExecutives(data);
  };

  const fetchNumberOfDifferentContent = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${BASE_URL}/content/contents/stats/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      console.log(data);
      setStats(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNumberOfDifferentContent();
    fetchCampaigns();
    fetchExecutives();
  }, []);

  return (
    <>
      <HeaderSection />

      <div className="mt-8 px-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl">Content Hub</h1>
            <p className="text-gray-600 mt-2">
              Manage all your marketing content at one place
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="rounded-full border-gray-300 text-sm whitespace-nowrap"
            >
              <Star className="w-4 h-4 mr-2" />
              Contents by AI
            </Button>

            <Button
              className="bg-[#1a2c47] text-white rounded-full px-4 py-2"
              onClick={handleOpen}
            >
              <Plus className="w-4 h-4 mr-2" />
              New Content
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-4">
        <div className="border rounded-sm border-gray-200 bg-white p-6">
          <h1 className="text-xl mb-4">Total Content</h1>
          <h1 className="text-4xl">{stats.total}</h1>
        </div>

        <div className="border rounded-sm border-gray-200 bg-white p-6">
          <h1 className="text-xl mb-4">Drafts</h1>
          <h1 className="text-4xl">{stats.draft}</h1>
        </div>

        <div className="border rounded-sm border-gray-200 bg-white p-6">
          <h1 className="text-xl mb-4">In Review</h1>
          <h1 className="text-4xl">{stats.in_review}</h1>
        </div>

        <div className="border rounded-sm border-gray-200 bg-white p-6">
          <h1 className="text-xl mb-4">Published</h1>
          <h1 className="text-4xl">{stats.published}</h1>
        </div>

        <div className="border rounded-sm border-gray-200 bg-white p-6">
          <h1 className="text-xl mb-4">Approved</h1>
          <h1 className="text-4xl">{stats.approved}</h1>
        </div>
      </div>

      <div className="mt-4 flex justify-between">
        <div className="border rounded-3xl py-1 px-3 border-gray-300">
          <select onChange={(e) => setStatus(e.target.value)}>
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="in_review">In Review</option>
            <option value="published">Published</option>
            <option value="rejected">Rejected</option>
            <option value="approved">Approved</option>
          </select>
        </div>

        <div className="border rounded-3xl py-1 px-3 border-gray-300">
          <select onChange={(e) => setQuarter(e.target.value)}>
            <option value="">All Quaters</option>
            <option value="1">Q1</option>
            <option value="2">Q2</option>
            <option value="3">Q3</option>
            <option value="4">Q4</option>
          </select>
        </div>

        <div className="border rounded-3xl py-1 px-3 border-gray-300">
          <select onChange={(e) => setType(e.target.value)}>
            <option value="">All Types</option>
            <option value="case_study">Case Study</option>
            <option value="blog">Blog</option>
            <option value="social">Social</option>
            <option value="white_paper">White Paper</option>
          </select>
        </div>
      </div>

      <div>
        <AllContent status={status} type={type} quarter={quarter} />
      </div>

      {/* ── Create New Content Form ── */}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Box
          sx={{
            p: 2,
            width: 420,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <TextField
            label="Title"
            size="small"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <TextField
            label="Brief"
            size="small"
            multiline
            rows={2}
            value={brief}
            onChange={(e) => setBrief(e.target.value)}
          />

          <FormControl fullWidth size="small">
            <InputLabel>Campaign</InputLabel>
            <Select
              value={campaignId}
              label="Campaign"
              onChange={(e) => {
                const id = e.target.value;
                setCampaignId(id);
                fetchEvents(id);
              }}
            >
              {campaigns.map((c) => (
                <MenuItem key={c.campaign_id} value={c.campaign_id}>
                  {c.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel>Event</InputLabel>
            <Select
              value={eventId}
              label="Event"
              onChange={(e) => setEventId(e.target.value)}
            >
              {events.map((ev) => (
                <MenuItem key={ev.event_id} value={ev.event_id}>
                  {ev.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel>Executive</InputLabel>
            <Select
              value={executiveId}
              label="Executive"
              onChange={(e) => setExecutiveId(e.target.value)}
            >
              {executives.map((ex) => (
                <MenuItem key={ex.user_id} value={ex.user_id}>
                  {ex.full_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel>Content Type</InputLabel>
            <Select
              value={contentType}
              label="Content Type"
              onChange={(e) => setContentType(e.target.value)}
            >
              {[
                "Use Case",
                "Video",
                "Blog",
                "Case Study",
                "Webinar",
                "Whitepaper",
                "E-book",
              ].map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* ── Tag Input ── */}
          <LabeledTagInput tags={tagList} onChange={setTagList} />

          <Button
            onClick={createNewContent}
            className="bg-blue-950 hover:bg-blue-950 text-white"
          >
            Create
          </Button>
        </Box>
      </Popover>
    </>
  );
};

export default ContentHubPage;


