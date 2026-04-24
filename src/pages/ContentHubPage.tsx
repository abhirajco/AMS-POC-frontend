import HeaderSection from "@/components/common/HeaderSection";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowLeft, ArrowRight, Filter, Plus, Search, Star } from 'lucide-react';
import { Link } from "react-router-dom";
import AllContent from "@/components/ui/AllContent";
import { useState, useEffect } from "react";
import { BASE_URL } from "@/utils/BASE_URL";
import { Popover, Box, FormControl, InputLabel, Select, MenuItem, Typography, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";

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
  const [tags, setTags] = useState("");
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [executives, setExecutives] = useState<any[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate()
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
          tags,
          executive_id: executiveId,
        }),
      });

      const data1 = await res1.json();

      if (!res1.ok) {
        console.error("Create Content Failed:", data1);
        return;
      }

      const contentId = data1.content_id;
      const executiveIdFromResponse = data1.executive_id;

      if (!contentId || !executiveIdFromResponse) {
        console.error("Missing content_id or executive_id in response");
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

      const data2 = await res2.json();

      if (!res2.ok) {
        console.error("Assign SME Failed:", data2);
        return;
      }

    
      setTitle("");
      setBrief("");
      setCampaignId("");
      setEventId("");
      setExecutiveId("");
      setContentType("");
      setTags("");
      handleClose();

      navigate("/generate-new-content", {
        state: {
          contentId: contentId,
          title,
          brief,
          contentType,
        },
      });

    } catch (err) {
      console.error("Unexpected Error:", err);
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
      })
      const data = await res.json();
      console.log(data)
      setStats(data);
    }
    catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchNumberOfDifferentContent();
    fetchCampaigns();
    fetchExecutives();
  }, [])


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


            <Button className="bg-[#1a2c47] text-white rounded-full px-4 py-2"
              onClick={handleOpen}>
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

      {/* Create new content form */}
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
              //onChange={(e) => setEventId(e.target.value)}
              onChange={(e) => {
                const id = e.target.value;
                setEventId(id);
                //setEventId(id);
                //fetchEvents(id);
              }}
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

          <TextField
            label="Tags"
            size="small"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />

          <Button onClick={createNewContent}
            className="bg-blue-950 hover:bg-blue-950 text-white">
            Create
          </Button>
        </Box>
      </Popover>
    </>
  )
}

export default ContentHubPage;
