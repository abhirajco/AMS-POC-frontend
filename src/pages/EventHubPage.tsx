import AllEvent from '@/components/ui/EventHub/AllEvent';
import HeaderSection from '@/components/common/HeaderSection'
import { Button } from "../components/ui/button";
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEvent } from '@/store/useEvent';
import { useCampaign } from '@/store/useCampaign';
import { Card, CardContent } from "../components/ui/card";
import {Plus, Search, Filter, List, Star, Calendar as CalendarIcon, ArrowLeft, ArrowRight} from 'lucide-react';
import { Input } from '../components/ui/input';
import KanBanView from '@/components/ui/KanBanView';
import KanBanCard from '@/components/ui/KanBanCard';
import { updateEvent, deleteEvent, createEventUnderCampaign } from '@/api/EventHub';
import FullCalendar from "@fullcalendar/react";
import CalendarApp, { eventToCalendarItem } from '@/components/ui/CampaingnHub/CalenderView';
import { EventDialog } from '@/components/ui/EventsComponent';
import type { CalendarEvent } from '@/components/ui/calendar copy';
import type { TeamMember } from '@/components/ui/EditableAssignedTeams';

const eventColumns = [
  { key: "planning", title: "Planning" },
  { key: "in_progress", title: "In Progress" },
  { key: "completed", title: "Completed" },
  { key: "upcoming", title: "Upcoming" },
];
import { Select } from '@/components/ui/select';
import { SelectTrigger } from '@/components/ui/select';
import { SelectItem } from '@/components/ui/select';
import { SelectContent } from '@/components/ui/select';
import { SelectValue } from '@/components/ui/select';

// Mock team options for the EventDialog's assigned-team picker.
const TEAM_OPTIONS: TeamMember[] = [
  { id: 1, name: "John Doe", role: "Developer", initials: "JD" },
  { id: 2, name: "Sarah Khan", role: "Designer", initials: "SK" },
  { id: 3, name: "Mike Ross", role: "QA", initials: "MR" },
];

const todayISO = () => new Date().toISOString().slice(0, 10);

// ── Backend ↔ EventDialog (CalendarEvent) enum mappers ────────────────────────
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
const CE_TO_PRIORITY: Record<string, string> = {
  Low: "low",
  Medium: "medium",
  High: "high",
};
const CE_TO_STATUS: Record<string, string> = {
  "In Progress": "in_progress",
  Upcoming: "upcoming",
  Planning: "planning",
  Completed: "completed",
  "Follow Up": "follow_up",
};

// Only forward valid UUIDs to the backend (the mock team picker uses numeric ids).
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// ── Blank form used when creating a new event ─────────────────────────────────
const emptyEventForm = (date: string = todayISO()): Partial<CalendarEvent> => ({
  title: "",
  description: "",
  comment: "",
  date,
  eventDate: date,
  endDate: date,
  location: "",
  campaign: "",
  assignedTeam: [],
  milestones: [],
  relatedTasks: [],
  relatedCampaigns: [],
  attachments: [],
  priority: "Medium",
  status: "Planning",
  type: "Campaign",
  effortOriginal: "",
  effortRemaining: "",
  effortCompleted: "",
});

// ── EventDialog form → POST payload (create under a campaign). The campaign id
// travels in the URL, so it is NOT part of this body. ─────────────────────────
const buildEventCreatePayload = (f: Partial<CalendarEvent>) => {
  const assignedTeam = (f.assignedTeam ?? [])
    .map((m) => String(m.id))
    .filter((id) => UUID_RE.test(id));

  const payload: Record<string, any> = {
    title: (f.title ?? "").trim(),
    start_date: f.date || f.eventDate || todayISO(),
    description: f.description ?? "",
    event_type: f.type ? f.type.toLowerCase().replace(/\s+/g, "_") : "",
    priority: (f.priority && CE_TO_PRIORITY[f.priority]) || "medium",
    status: (f.status && CE_TO_STATUS[f.status]) || "planning",
    location: f.location ?? "",
    tags: "",
    end_date: f.endDate || f.date || f.eventDate || todayISO(),
  };

  // Optional, but the backend rejects an empty list — omit it when no valid UUIDs.
  if (assignedTeam.length > 0) {
    payload.assigned_team = assignedTeam;
  }

  return payload;
};

// ── Backend event → EventDialog form ──────────────────────────────────────────
const eventToForm = (e: any): Partial<CalendarEvent> => ({
  id: e.event_id,
  title: e.title ?? "",
  type: "Campaign", // event_type isn't represented in the dialog's type enum
  status: STATUS_TO_CE[(e.status ?? "").toLowerCase()] ?? "Planning",
  priority: PRIORITY_TO_CE[(e.priority ?? "").toLowerCase()] ?? "Medium",
  date: e.start_date ?? "",
  eventDate: e.start_date ?? "",
  endDate: e.end_date ?? "",
  location: e.location ?? "",
  description: e.description ?? "",
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

// ── EventDialog form → PATCH payload (update) ─────────────────────────────────
const buildEventUpdatePayload = (f: Partial<CalendarEvent>) => ({
  title: (f.title ?? "").trim(),
  description: f.description ?? "",
  start_date: f.date || f.eventDate || todayISO(),
  end_date: f.endDate || f.date || f.eventDate || todayISO(),
  priority: (f.priority && CE_TO_PRIORITY[f.priority]) || "medium",
  status: (f.status && CE_TO_STATUS[f.status]) || "planning",
  location: f.location ?? "",
});

// ── Duplicate → POST body for the by-campaign endpoint. The campaign id goes in
// the URL; event_type / tags come from the original (the dialog omits them). ──
const buildEventDuplicatePayload = (original: any, f: Partial<CalendarEvent>) => ({
  title: `${f.title ?? original?.title ?? "Event"} (Copy)`,
  description: f.description ?? original?.description ?? "",
  start_date: f.date || f.eventDate || original?.start_date || todayISO(),
  end_date: f.endDate || f.date || original?.end_date || todayISO(),
  event_type: original?.event_type ?? "",
  priority: (f.priority && CE_TO_PRIORITY[f.priority]) || original?.priority || "medium",
  status: (f.status && CE_TO_STATUS[f.status]) || original?.status || "planning",
  location: f.location ?? original?.location ?? "",
  tags: original?.tags ?? "",
});

const EventHubPage = () => {

    const [selectedType, setSelectedType] = useState('all');
     const [selectedStatus, setSelectedStatus] = useState('all');
     const [searchQuery, setSearchQuery] = useState('');
     const [viewMode, setViewMode] = useState<'list' | 'kanban' | 'calendar'>('list');
     const calendarRef = useRef<FullCalendar>(null);
     const [currentLabel, setCurrentLabel] = useState("");

     // ── Unified EventDialog state (create + existing-event update/delete/duplicate) ──
     const [dialogOpen, setDialogOpen] = useState(false);
     const [isCreateMode, setIsCreateMode] = useState(false);
     const [dialogForm, setDialogForm] = useState<Partial<CalendarEvent>>({});
     const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
     const [selectedEventId, setSelectedEventId] = useState("");

     const navigate = useNavigate();
     const { id } = useParams();
     // The event id the route has already opened — prevents an events refresh
     // from re-triggering the detail dialog.
     const openedIdRef = useRef<string | null>(null);

     const eventsRaw = useEvent((s) => s.events);
     const events = Array.isArray(eventsRaw) ? eventsRaw : [];
     const fetchEvents = useEvent((s) => s.fetchEvents);
     const filterEvents = useEvent((s) => s.filterEvents);

     // Close the dialog and, when on an /event/:id route, return to the hub list.
     const closeDialog = () => {
       setDialogOpen(false);
       if (id) navigate("/event-hub");
     };

     // Related-campaign options for the create dialog (title shown, id sent).
     const campaigns = useCampaign((s: any) => s.campaigns);
     const fetchCampaigns = useCampaign((s: any) => s.fetchCampaigns);
     const campaignOptions = (Array.isArray(campaigns) ? campaigns : []).map(
       (c: any) => ({ id: c.campaign_id, title: c.title })
     );

     useEffect(() => {
       fetchCampaigns();
     }, [fetchCampaigns]);

     const handleEventStatusChange = async (id: string, status: string) => {
       await updateEvent(id, { status });
       await fetchEvents();
     };

     // ── Open the dialog in "create" mode ───────────────────────────────────────
     const openCreateEvent = (date?: string) => {
       setIsCreateMode(true);
       setSelectedEvent(null);
       setSelectedEventId("");
       setDialogForm(emptyEventForm(date));
       setDialogOpen(true);
     };

     // ── Open the dialog showing an existing event's details ────────────────────
     const openEventDetail = (event: any) => {
       setIsCreateMode(false);
       setSelectedEvent(event);
       setSelectedEventId(event.event_id);
       setDialogForm(eventToForm(event));
       setDialogOpen(true);
     };

     // Clicking an event (list / kanban / calendar) navigates to its detail
     // route; the effect below resolves the id and opens the dialog.
     const goToEvent = (eventId: string) => navigate(`/event/${eventId}`);

     // Open the detail dialog from the URL (click-through and deep links both
     // land on /event/:id). Waits for the events to load before resolving the id.
     useEffect(() => {
       if (id) {
         if (openedIdRef.current === id) return;
         const ev = events.find((e: any) => String(e.event_id) === String(id));
         if (ev) {
           openedIdRef.current = id;
           openEventDetail(ev);
         }
         return;
       }
       openedIdRef.current = null;
       if (!isCreateMode) setDialogOpen(false);
       // eslint-disable-next-line react-hooks/exhaustive-deps
     }, [id, events, isCreateMode]);

     // ── Save: create (under a campaign) or update depending on mode ────────────
     const handleDialogSave = async () => {
       const { toast } = await import("sonner");

       try {
         if (isCreateMode) {
           const createPayload = buildEventCreatePayload(dialogForm);
           if (!createPayload.title) {
             toast.error("Please enter an event title.");
             return;
           }
           if (!dialogForm.campaign) {
             toast.error("Please select a related campaign.");
             return;
           }
           // createEventUnderCampaign already toasts success/error.
           await createEventUnderCampaign(dialogForm.campaign, createPayload);
         } else {
           const payload = buildEventUpdatePayload(dialogForm);
           if (!payload.title) {
             toast.error("Please enter an event title.");
             return;
           }
           // updateEvent already toasts success/error.
           await updateEvent(selectedEventId, payload);
         }
         await fetchEvents();
         closeDialog();
       } catch {
         // Errors are surfaced by the API layer.
       }
     };

     // ── Delete the currently opened event ──────────────────────────────────────
     const handleDialogDelete = async () => {
       if (!selectedEventId) {
         closeDialog();
         return;
       }
       try {
         // deleteEvent already toasts success/error.
         await deleteEvent(selectedEventId);
         await fetchEvents();
         closeDialog();
       } catch {
         // Errors are surfaced by the API layer.
       }
     };

     // ── Duplicate the currently opened event (under its own campaign) ──────────
     const handleDialogDuplicate = async () => {
       const { toast } = await import("sonner");
       const campaignId = selectedEvent?.campaign;
       if (!campaignId) {
         toast.error("This event has no related campaign to duplicate under.");
         return;
       }
       try {
         // createEventUnderCampaign already toasts success/error.
         await createEventUnderCampaign(
           campaignId,
           buildEventDuplicatePayload(selectedEvent, dialogForm)
         );
         await fetchEvents();
         closeDialog();
       } catch {
         // Errors are surfaced by the API layer.
       }
     };

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

     const openCreateOnDate = (date: string) => {
       openCreateEvent(date);
     };

     useEffect(() => {
       if (viewMode !== 'calendar') return;
       const t = setTimeout(() => {
         const api = calendarRef.current?.getApi();
         if (api) setCurrentLabel(api.view.title);
       }, 100);
       return () => clearTimeout(t);
     }, [viewMode]);

     useEffect(() => {
       const hasFilters =
         searchQuery.trim() !== "" ||
         selectedType !== "all" ||
         selectedStatus !== "all";

       const handler = setTimeout(() => {
         if (hasFilters) {
           filterEvents({
             search: searchQuery.trim(),
             event_type: selectedType === "all" ? "" : selectedType,
             status: selectedStatus === "all" ? "" : selectedStatus,
           });
         } else {
           fetchEvents();
         }
       }, 400);

       return () => clearTimeout(handler);
     }, [searchQuery, selectedType, selectedStatus]);

    return (
        <div className="bg-neutral-50 flex flex-col h-full">
            <HeaderSection />

            <div className="px-4 sm:px-6 py-4 sm:py-6 bg-white border-b border-gray-200 mb-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-[20px] sm:text-[24px] lg:text-[28px] text-black">Event Hub</h1>
                        <p className="text-[12px] sm:text-[14px] text-gray-600 mt-1">Plan, execute, and track marketing events and their impact</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            className="rounded-full border-gray-300 text-sm whitespace-nowrap"
                            onClick={() => import('sonner').then(({ toast }) => toast('Events added by AI is coming soon.'))}
                        >
                            <Star className="w-4 h-4 mr-2" />
                            Events added by AI
                        </Button>
                        <Button
                            className="bg-[#1a2c47] text-white rounded-full px-4 py-2 hover:bg-[#2a3c57] text-sm whitespace-nowrap"
                            onClick={() => openCreateEvent()}
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Create Event
                        </Button>
                    </div>
                </div>
            </div>



            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <Card className="bg-white border border-gray-200">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-[16px] text-gray-800">Total Events</h3>
                        </div>
                        <p className="text-[36px] text-gray-900 font-semibold tracking-tight">
                            11
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-white border border-gray-200">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-[16px] text-gray-800">Upcoming</h3>
                        </div>
                        <p className="text-[36px] text-gray-900 font-semibold tracking-tight">
                            8
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-white border border-gray-200">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-[16px] text-gray-800">Past Events</h3>
                        </div>
                        <p className="text-[36px] text-gray-900 font-semibold tracking-tight">
                            3
                        </p>
                    </CardContent>
                </Card>
            </div>


            <div>
                 <Card className="bg-white border border-gray-200 mb-6">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-4">
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
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="follow-up">Follow Up</SelectItem>
                      <SelectItem value="planning">Planning</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button variant="outline" className="rounded-full border-gray-300 text-sm whitespace-nowrap">
                    <Filter className="w-4 h-4 mr-2" />
                    More filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
            </div>

            <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
                {/* Date navigation — only relevant in calendar view */}
                {viewMode === 'calendar' ? (
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={handlePrev}>
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                        <div className="flex items-center gap-2 px-3 py-1 border border-gray-300 rounded-full">
                            <CalendarIcon className="w-4 h-4 text-gray-600" />
                            <span className="text-sm text-gray-700">{currentLabel}</span>
                        </div>
                        <Button variant="outline" size="sm" onClick={handleNext}>
                            <ArrowRight className="w-4 h-4" />
                        </Button>
                    </div>
                ) : (
                    <div />
                )}

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

            <div className='mt-4'>
                {viewMode === 'kanban' ? (
                    <KanBanView
                        columns={eventColumns}
                        items={events}
                        getId={(e) => e.event_id}
                        getStatus={(e) => e.status}
                        onStatusChange={handleEventStatusChange}
                        renderCard={(e) => (
                            <KanBanCard
                                title={e.title}
                                description={e.description}
                                priority={e.priority}
                                category={e.event_type}
                                tags={e.tags ? e.tags.split(",").map((t: string) => t.trim()) : []}
                                startDate={e.start_date}
                                endDate={e.end_date}
                                location={e.location}
                                taskCount={e.task_count}
                                onClick={() => goToEvent(e.event_id)}
                            />
                        )}
                    />
                ) : viewMode === 'calendar' ? (
                    <div style={{ height: "330vh", width: "100%" }}>
                        <CalendarApp
                            calendarRef={calendarRef}
                            items={events}
                            mapItem={eventToCalendarItem}
                            onEventClick={goToEvent}
                            onCreateClick={openCreateOnDate}
                        />
                    </div>
                ) : (
                    <AllEvent events={events} onEventClick={(e: any) => goToEvent(e.event_id)} />
                )}
            </div>
                <EventDialog
                    open={dialogOpen}
                    mode={isCreateMode ? "create" : "update"}
                    entity="event"
                    campaignOptions={campaignOptions}
                    history={[]}
                    form={dialogForm}
                    teamOptions={TEAM_OPTIONS}
                    onClose={closeDialog}
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

export default EventHubPage;
