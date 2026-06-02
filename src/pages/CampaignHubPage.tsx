
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
import { Plus, Calendar as CalendarIcon, Search, List, ArrowLeft, ArrowRight, Clock, MapPin, Edit, Trash2, Copy, Star } from 'lucide-react';
import { useEffect, useRef, useState } from "react";
import { getAllCampaign } from "@/api/CampaignHub";
import { Card, CardContent } from "../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Input } from "../components/ui/input";
import AllCampaign from "@/components/ui/CampaingnHub/AllCampaign";
import CreateCampaignDialog from "@/components/ui/CampaingnHub/CreateCampaign";
// import CalendarApp from "@/components/ui/CampaingnHub/CalenderView";
import FullCalendar from "@fullcalendar/react";
import CalendarApp from "@/components/ui/calendar copy";

import { useCampaign } from "@/store/useCampaign";

const CampaignHubPage = () => {

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [viewMode, setViewMode] = useState('list');
  const [activeTab, setActiveTab] = useState('all');
  const [isCreateCampaignOpen, setIsCreateCampaignOpen] = useState(false);
  const calendarRef = useRef<FullCalendar>(null);
const [currentLabel, setCurrentLabel] = useState("");


  const {
    campaigns,
    fetchCampaigns,
    isLoading,
    error,
  } = useCampaign();

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);


  console.log("@@@@@@@@@@@@@@",campaigns);
  


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


  useEffect(() => 
  {
    getAllCampaign();
  }, [])

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
              onClick={() => setIsCreateCampaignOpen(true)}
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
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="follow-up">Follow Up</SelectItem>
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
  campaigns={campaigns}
  calendarRef={calendarRef}
/>
          </div>
        ) : (
          <AllCampaign />
        )}
      </div>
      <CreateCampaignDialog
        open={isCreateCampaignOpen}
        setOpen={setIsCreateCampaignOpen}
      />
    </div>
  )
}

export default CampaignHubPage;