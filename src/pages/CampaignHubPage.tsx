
export interface CampaignApi {
  campaign_id: string;

  campaign_type: string;

  created_at: string;

  created_by: string;

  created_by_name: string;

  description: string;

  end_date: string;

  event_count: number;

  location: string;

  max_hierarchy_level: number;

  priority: string;

  start_date: string;

  status: string;

  tags: string;

  task_count: number;

  title: string;

  updated_at: string;
}





import HeaderSection from "@/components/common/HeaderSection"
import { Button } from "../components/ui/button";
import { Plus, Calendar as CalendarIcon, Search, List, ArrowLeft, ArrowRight, Star } from 'lucide-react';
import { useEffect, useRef, useState } from "react";
import { useCampaign } from "@/store/useCampaign";
import { Card, CardContent } from "../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Input } from "../components/ui/input";
import AllCampaign from "@/components/ui/CampaingnHub/AllCampaign";
import CalendarApp from "@/components/ui/CampaingnHub/CalenderView";
import KanBanView from "@/components/ui/KanBanView";
import KanBanCard from "@/components/ui/KanBanCard";
import { createCampaign, updateCampaign, deleteCampaign } from "@/api/CampaignHub";
import { EventDialog } from "@/components/ui/EventsComponent";
import type { CalendarEvent } from "@/components/ui/calendar copy";
import type { TeamMember } from "@/components/ui/EditableAssignedTeams";

// Mock team options for the assigned-team picker inside EventDialog.
const TEAM_OPTIONS: TeamMember[] = [
  { id: 1, name: "John Doe", role: "Developer", initials: "JD" },
  { id: 2, name: "Sarah Khan", role: "Designer", initials: "SK" },
  { id: 3, name: "Mike Ross", role: "QA", initials: "MR" },
];

const todayISO = () => new Date().toISOString().slice(0, 10);

// ── Blank form used when creating a new campaign ──────────────────────────────
const emptyCampaignForm = (date: string = todayISO()): Partial<CalendarEvent> => ({
  title: "",
  description: "",
  comment: "",
  date,
  eventDate: date,
  endDate: date,
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
  priority: "Medium",
  status: "Planning",
  type: "Campaign",
});

// ── Backend campaign → EventDialog form mappers ───────────────────────────────
const STATUS_TO_CE: Record<string, CalendarEvent["status"]> = {
  upcoming: "Upcoming",
  in_progress: "In Progress",
  completed: "Completed",
  planning: "Planning",
  follow_up: "Follow Up",
};
const PRIORITY_TO_CE: Record<string, CalendarEvent["priority"]> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};
const TYPE_TO_CE: Record<string, CalendarEvent["type"]> = {
  campaign: "Campaign",
  workshop: "Workshop",
  meeting: "Meeting",
  webinar: "Webinar",
  content_release: "Content Release",
};

const mapCampaignToForm = (c: any): Partial<CalendarEvent> => ({
  id: c.campaign_id,
  title: c.title ?? "",
  type: TYPE_TO_CE[(c.campaign_type ?? "").toLowerCase()] ?? "Campaign",
  status: STATUS_TO_CE[(c.status ?? "").toLowerCase()] ?? "Planning",
  priority: PRIORITY_TO_CE[(c.priority ?? "").toLowerCase()] ?? "Medium",
  date: c.start_date ?? "",
  eventDate: c.start_date ?? "",
  endDate: c.end_date ?? "",
  location: c.location ?? "",
  description: c.description ?? "",
  comment: "",
  assignedTeam: [],
  milestones: [],
  relatedTasks: [],
  relatedCampaigns: [],
  attachments: [],
  effortOriginal: "",
  effortRemaining: "",
  effortCompleted: "",
});

// ── EventDialog form → campaign API payload ───────────────────────────────────
const buildCampaignPayload = (f: Partial<CalendarEvent>) => ({
  title: f.title ?? "",
  start_date: f.date ?? f.eventDate ?? todayISO(),
  description: f.description ?? "",
  campaign_type: f.type ? f.type.toLowerCase() : "",
  priority: f.priority ? f.priority.toLowerCase() : "medium",
  status:
    f.status === "In Progress"
      ? "in_progress"
      : f.status === "Follow Up"
        ? "follow_up"
        : f.status
          ? f.status.toLowerCase()
          : "planning",
  location: f.location ?? "",
  tags: "",
  end_date: f.endDate || f.date || todayISO(),
  max_hierarchy_level: 2,
  assigned_team: (f.assignedTeam ?? []).map((m) => String(m.id)),
});

const campaignColumns = [
  { key: "planning", title: "Planning" },
  { key: "in_progress", title: "In Progress" },
  { key: "completed", title: "Completed" },
  { key: "upcoming", title: "Upcoming" },
];
import FullCalendar from "@fullcalendar/react";

const CampaignHubPage = () => {

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [viewMode, setViewMode] = useState('list');
  const [activeTab, setActiveTab] = useState('all');
  // ── Unified EventDialog state (shared across list / calendar / kanban) ──────
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [dialogForm, setDialogForm] = useState<Partial<CalendarEvent>>(emptyCampaignForm);
  const [selectedCampaignId, setSelectedCampaignId] = useState("");
  const [history, setHistory] = useState<any[]>([]);
  const calendarRef = useRef<FullCalendar>(null);
  const [currentLabel, setCurrentLabel] = useState("");

  const campaigns = useCampaign((s) => s.campaigns);
  const fetchCampaigns = useCampaign((s) => s.fetchCampaigns);
  const filterCampaigns = useCampaign((s) => s.filterCampaigns);
  const fetchHistoryById = useCampaign((s) => s.fetchHistoryById);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);


const handlePrev = () => {
  const api = calendarRef.current?.getApi();
  if (!api) return;
  api.prev();
  setCurrentLabel(api.view.title);
};

const handleNext = () => {
  const api = calendarRef.current?.getApi();
  if (!api) return;
  api.next();
  setCurrentLabel(api.view.title);
};


useEffect(() => {
  setTimeout(() => {
    const api = calendarRef.current?.getApi();
    if (api) setCurrentLabel(api.view.title);
  }, 100);
}, []);

  const handleCampaignStatusChange = async (id: string, status: string) => {
    await updateCampaign(id, { status });
    await fetchCampaigns();
  };

  // ── Open the dialog in "create" mode (Create Campaign button / calendar +) ──
  const openCreateCampaign = (date?: string) => {
    setIsCreateMode(true);
    setSelectedCampaignId("");
    setHistory([]);
    setDialogForm(emptyCampaignForm(date));
    setDialogOpen(true);
  };

  // ── Open the dialog showing an existing campaign's details ──────────────────
  const openCampaignDetail = async (campaign: any) => {
    setIsCreateMode(false);
    setSelectedCampaignId(campaign.campaign_id);
    setDialogForm(mapCampaignToForm(campaign));
    setHistory([]);
    setDialogOpen(true);

    try {
      await fetchHistoryById(campaign.campaign_id);
      setHistory(useCampaign.getState().history ?? []);
    } catch {
      // History is non-critical; the dialog still opens without it.
    }
  };

  // Calendar emits a FullCalendar event id (the campaign_id) — resolve it.
  const openCampaignDetailById = (campaignId: string) => {
    const campaign = campaigns.find(
      (c: any) => String(c.campaign_id) === String(campaignId)
    );
    if (campaign) openCampaignDetail(campaign);
  };

  // ── Save: create or update depending on the dialog mode ─────────────────────
  const handleDialogSave = async () => {
    const { toast } = await import("sonner");
    const payload = buildCampaignPayload(dialogForm);

    try {
      if (isCreateMode) {
        await createCampaign(payload);
        toast.success("Campaign created successfully");
      } else {
        // updateCampaign already toasts success/error.
        await updateCampaign(selectedCampaignId, payload);
      }
      await fetchCampaigns();
      setDialogOpen(false);
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong");
    }
  };

  // ── Delete the currently opened campaign ────────────────────────────────────
  const handleDialogDelete = async () => {
    if (isCreateMode || !selectedCampaignId) {
      setDialogOpen(false);
      return;
    }
    try {
      // deleteCampaign already toasts success/error.
      await deleteCampaign(selectedCampaignId);
      await fetchCampaigns();
      setDialogOpen(false);
    } catch {
      // Errors are surfaced by the API layer.
    }
  };

  // ── Duplicate: create a copy of the currently opened campaign ───────────────
  const handleDialogDuplicate = async () => {
    const { toast } = await import("sonner");
    const payload = {
      ...buildCampaignPayload(dialogForm),
      title: `${dialogForm.title ?? "Campaign"} (Copy)`,
    };
    try {
      await createCampaign(payload);
      toast.success("Campaign duplicated successfully");
      await fetchCampaigns();
      setDialogOpen(false);
    } catch (err: any) {
      toast.error(err?.message || "Failed to duplicate campaign");
    }
  };

  useEffect(() => {
    const hasFilters =
      searchQuery.trim() !== "" ||
      selectedType !== "all" ||
      selectedStatus !== "all";

    const handler = setTimeout(() => {
      if (hasFilters) {
        filterCampaigns({
          search: searchQuery.trim(),
          campaign_type: selectedType === "all" ? "" : selectedType,
          status: selectedStatus === "all" ? "" : selectedStatus,
        });
      } else {
        fetchCampaigns();
      }
    }, 400);

    return () => clearTimeout(handler);
  }, [searchQuery, selectedType, selectedStatus]);

  return (
    <div className="bg-neutral-50 flex flex-col h-full">
      <HeaderSection />

      <div className="px-4 sm:px-6 py-4 sm:py-6 bg-white border-b border-gray-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-[20px] sm:text-[24px] lg:text-[28px] text-black">Campaign Hub</h1>
            <p className="text-[12px] sm:text-[14px] text-gray-600 mt-1">Plan, execute, and track marketing campaigns and their impact</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="rounded-full border-gray-300 text-sm whitespace-nowrap"
              onClick={() => import('sonner').then(({ toast }) => toast('Events added by AI is coming soon.'))}
            >
              <Star className="w-4 h-4 mr-2" /> Events added by AI
            </Button>
            <Button
              className="bg-[#1a2c47] text-white rounded-full px-4 py-2"
              onClick={() => openCreateCampaign()}
            >
              <Plus className="w-4 h-4 mr-2" /> Create Campaign
            </Button>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 mt-6">
          <Card className="bg-white border border-gray-200">
            <CardContent className="p-6">
              <h3 className="text-[16px] text-gray-800 mb-2">Total Events</h3>
              <p className="text-[36px] text-gray-900 font-semibold tracking-tight">17</p>
            </CardContent>
          </Card>
          <Card className="bg-white border border-gray-200">
            <CardContent className="p-6">
              <h3 className="text-[16px] text-gray-800 mb-2">Upcoming</h3>
              <p className="text-[36px] text-gray-900 font-semibold tracking-tight">10</p>
            </CardContent>
          </Card>
          <Card className="bg-white border border-gray-200">
            <CardContent className="p-6">
              <h3 className="text-[16px] text-gray-800 mb-2">Follow-ups</h3>
              <p className="text-[36px] text-gray-900 font-semibold tracking-tight">2</p>
            </CardContent>
          </Card>
        </div>

        {/* Search & Filters */}
        <Card className="bg-white border border-gray-200 mb-6">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative flex-1 max-w-full sm:max-w-80">
                <Input
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 rounded-full border-gray-300 text-sm"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              </div>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-full sm:w-auto min-w-[120px] rounded-full border-gray-300 text-sm">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="campaign">Campaign</SelectItem>
                    <SelectItem value="webinar">Webinar</SelectItem>
                    <SelectItem value="workshop">Workshop</SelectItem>
                    <SelectItem value="training">Training</SelectItem>
                    <SelectItem value="meeting">Meeting</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-full sm:w-auto min-w-[120px] rounded-full border-gray-300 text-sm">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="planning">Planning</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs + Date Nav + View Toggle — all in ONE row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 flex-wrap">
          {/* Tabs */}
          <div className="bg-gray-200 bg-opacity-40 rounded-full p-1 inline-flex overflow-x-auto">
            <Button
              variant={activeTab === 'all' ? 'default' : 'ghost'}
              className={`rounded-full px-3 sm:px-4 py-1 text-xs sm:text-sm whitespace-nowrap ${activeTab === 'all' ? 'bg-white text-black shadow-sm' : 'text-black hover:bg-gray-100'
                }`}
              onClick={() => setActiveTab('all')}
            >
              All
            </Button>
            <Button
              variant={activeTab === 'upcoming' ? 'default' : 'ghost'}
              className={`rounded-full px-3 sm:px-4 py-1 text-xs sm:text-sm whitespace-nowrap ${activeTab === 'upcoming' ? 'bg-white text-black shadow-sm' : 'text-black hover:bg-gray-100'
                }`}
              onClick={() => setActiveTab('upcoming')}
            >
              Upcoming
            </Button>
            <Button
              variant={activeTab === 'follow-ups' ? 'default' : 'ghost'}
              className={`rounded-full px-3 sm:px-4 py-1 text-xs sm:text-sm whitespace-nowrap ${activeTab === 'follow-ups' ? 'bg-white text-black shadow-sm' : 'text-black hover:bg-gray-100'
                }`}
              onClick={() => setActiveTab('follow-ups')}
            >
              Past Events
            </Button>
          </div>

          {/* Date Nav + View Toggle */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => { }}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div className="flex items-center gap-2 px-3 py-1 border border-gray-300 rounded-full">
                <CalendarIcon className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-700"></span>
              </div>
              <Button variant="outline" size="sm">
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div> */}
            <div className="flex items-center gap-2">
  <Button variant="outline" size="sm" onClick={handlePrev}>
    <ArrowLeft className="w-4 h-4" />
  </Button>

  <div className="flex items-center gap-2 px-3 py-1 border border-gray-300 rounded-full">
    <CalendarIcon className="w-4 h-4 text-gray-600" />
    <span className="text-sm text-gray-700">
      {currentLabel}
    </span>
  </div>

  <Button variant="outline" size="sm" onClick={handleNext}>
    <ArrowRight className="w-4 h-4" />
  </Button>
</div>
            <div className="flex items-center gap-2">

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant={viewMode === 'kanban' ? 'default' : 'outline'}
                  className={`rounded-full ${viewMode === 'kanban'
                    ? 'bg-[#1a2c47] text-white border-[#1a2c47] hover:bg-[#1a2c47]'
                    : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-100'
                    }`}
                  onClick={() => setViewMode('kanban')}
                >
                  Kanban View
                </Button>

                <Button
                  size="sm"
                  variant={viewMode === 'calendar' ? 'default' : 'outline'}
                  className={`rounded-full ${viewMode === 'calendar'
                    ? 'bg-[#1a2c47] text-white border-[#1a2c47] hover:bg-[#1a2c47]'
                    : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-100'
                    }`}
                  onClick={() => setViewMode('calendar')}
                >
                  <CalendarIcon className="w-4 h-4 mr-1" /> Calendar View
                </Button>

                <Button
                  size="sm"
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  className={`rounded-full ${viewMode === 'list'
                    ? 'bg-[#1a2c47] text-white border-[#1a2c47] hover:bg-[#1a2c47]'
                    : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-100'
                    }`}
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4 mr-1" /> List View
                </Button>
              </div>
            </div>
          </div>
        </div>

        {viewMode === "calendar" ? (
          <div
            style={{
              height: "330vh",
              width: "100%",
            }}
          >
            <CalendarApp
              calendarRef={calendarRef}
              onEventClick={openCampaignDetailById}
              onCreateClick={openCreateCampaign}
            />
          </div>
        ) : viewMode === "kanban" ? (
          <KanBanView
            columns={campaignColumns}
            items={campaigns}
            getId={(c) => c.campaign_id}
            getStatus={(c) => c.status}
            onStatusChange={handleCampaignStatusChange}
            renderCard={(c) => (
              <KanBanCard
                title={c.title}
                description={c.description}
                priority={c.priority}
                category={c.campaign_type}
                tags={c.tags ? c.tags.split(",").map((t: string) => t.trim()) : []}
                startDate={c.start_date}
                endDate={c.end_date}
                location={c.location}
                taskCount={c.task_count}
                onClick={() => openCampaignDetail(c)}
              />
            )}
          />
        ) : (
          <AllCampaign campaigns={campaigns} onCampaignClick={openCampaignDetail} />
        )}
      </div>
      <EventDialog
        open={dialogOpen}
        history={history}
        form={dialogForm}
        teamOptions={TEAM_OPTIONS}
        onClose={() => setDialogOpen(false)}
        onSave={handleDialogSave}
        onDelete={handleDialogDelete}
        onDuplicate={handleDialogDuplicate}
        onFormChange={(val) =>
          setDialogForm((prev) =>
            typeof val === "function" ? val(prev) : { ...prev, ...val }
          )
        }
      />
    </div>
  )
}

export default CampaignHubPage;