import AllEvent from '@/components/ui/EventHub/AllEvent';
import HeaderSection from '@/components/common/HeaderSection'
import { Button } from "../components/ui/button";
import { useEffect, useState } from 'react';
import { useEvent } from '@/store/useEvent';
import { Card, CardContent } from "../components/ui/card";
import CreateEventDialog from '@/components/ui/EventHub/CreateEvent';
import {Plus, Search, Filter, List, Star} from 'lucide-react';
import { Input } from '../components/ui/input';
import KanBanView from '@/components/ui/KanBanView';
import KanBanCard from '@/components/ui/KanBanCard';
import { updateEvent } from '@/api/EventHub';

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

const EventHubPage = () => {

    const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
     const [selectedType, setSelectedType] = useState('all');
     const [selectedStatus, setSelectedStatus] = useState('all');
     const [searchQuery, setSearchQuery] = useState('');
     const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');

     const eventsRaw = useEvent((s) => s.events);
     const events = Array.isArray(eventsRaw) ? eventsRaw : [];
     const fetchEvents = useEvent((s) => s.fetchEvents);
     const filterEvents = useEvent((s) => s.filterEvents);

     const handleEventStatusChange = async (id: string, status: string) => {
       await updateEvent(id, { status });
       await fetchEvents();
     };

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
                            onClick={() => setIsCreateEventOpen(true)}
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

            <div className="flex items-center justify-end gap-2 mb-4">
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
                                category={e.campaign_title}
                                startDate={e.start_date}
                                endDate={e.end_date}
                                taskCount={e.task_count}
                            />
                        )}
                    />
                ) : (
                    <AllEvent events={events} />
                )}
            </div>
                <CreateEventDialog
   open={isCreateEventOpen}
   setOpen={setIsCreateEventOpen}
/>
        </div>
    )
}

export default EventHubPage;
