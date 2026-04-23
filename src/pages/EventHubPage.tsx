// import { useMemo, useState } from 'react';
// import { Button } from "../components/ui/button";
// import { Input } from "../components/ui/input";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
// import { Badge } from "../components/ui/badge";
// import { Card, CardContent } from "../components/ui/card";
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../components/ui/dialog";
// import { Label } from "../components/ui/label";
// import { Textarea } from "../components/ui/textarea";

// import {
//   Plus, Search, Filter, Calendar as CalendarIcon, List,
//   ArrowLeft, ArrowRight, Clock, MapPin, Edit, Trash2, Copy, Star
// } from 'lucide-react';
// import { HeaderSection } from "../components/common/HeaderSection";
// import { mockEvents } from "../data/mockData";

// interface EventHubPageProps {
//   setIsSidebarOpen: (open: boolean) => void;
//   isEventDialogOpen: boolean;
//   setIsEventDialogOpen: (open: boolean) => void;
// }

// export const EventHubPage = ({
//   setIsSidebarOpen,
//   isEventDialogOpen,
//   setIsEventDialogOpen
// }: EventHubPageProps) => {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [events, setEvents] = useState(mockEvents);
//   const [selectedType, setSelectedType] = useState('all');
//   const [selectedStatus, setSelectedStatus] = useState('all');
//   const [viewMode, setViewMode] = useState('calendar');
//   const [activeTab, setActiveTab] = useState('all');
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
//   const [isEventDetailOpen, setIsEventDetailOpen] = useState(false);
//   const [isEditingEvent, setIsEditingEvent] = useState(false);
//   const [editDraft, setEditDraft] = useState<any | null>(null);

//   // Calculate event metrics
//   const eventMetrics = useMemo(() => ({
//     total: events.length,
//     upcoming: events.filter(event => event.status === 'Upcoming' || event.status === 'In Progress').length,
//     followUps: events.filter(event => event.status === 'Follow Up').length
//   }), [events]);

//   // Filter events based on search, type, and status
//   const filteredEvents = events.filter(event => {
//     if (searchQuery && !event.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
//         !event.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
//     if (selectedType !== 'all' && event.type.toLowerCase() !== selectedType) return false;
//     if (selectedStatus !== 'all' && event.status.toLowerCase() !== selectedStatus.replace('-', ' ')) return false;
//     return true;
//   });

//   // Filter events by active tab
//   const tabFilteredEvents = filteredEvents.filter(event => {
//     if (activeTab === 'all') return true;
//     if (activeTab === 'upcoming') return event.status === 'Upcoming' || event.status === 'In Progress';
//     if (activeTab === 'follow-ups') return event.status === 'Follow Up';
//     return true;
//   });

//   const handleEventClick = (eventId: number) => {
//     setSelectedEventId(eventId);
//     setIsEventDetailOpen(true);
//     setIsEditingEvent(false);
//     const selected = events.find(e => e.id === eventId);
//     setEditDraft(selected ? { ...selected } : null);
//   };

//   const handleDuplicate = () => {
//     if (!selectedEvent) return;
//     const maxId = Math.max(...events.map(e => e.id));
//     const newEvent = {
//       ...selectedEvent,
//       id: maxId + 1,
//       title: `${selectedEvent.title} (Copy)`,
//     } as any;
//     setEvents(prev => [...prev, newEvent]);
//     import('sonner').then(({ toast }) => toast.success('Event duplicated'));
//   };

//   const handleDelete = () => {
//     if (!selectedEvent) return;
//     const proceed = window.confirm('Delete this event? This cannot be undone.');
//     if (!proceed) return;
//     setEvents(prev => prev.filter(e => e.id !== selectedEvent.id));
//     setIsEventDetailOpen(false);
//     import('sonner').then(({ toast }) => toast.success('Event deleted'));
//   };

//   const handleSaveEdit = () => {
//     if (!editDraft) return;
//     setEvents(prev => prev.map(e => e.id === editDraft.id ? editDraft : e));
//     setIsEditingEvent(false);
//     import('sonner').then(({ toast }) => toast.success('Event updated'));
//   };

//   const getStatusBadge = (status: string) => {
//     switch (status) {
//       case 'In Progress':
//         return <Badge className="bg-blue-100 text-blue-800 text-xs">In Progress</Badge>;
//       case 'Upcoming':
//         return <Badge className="bg-green-100 text-green-800 text-xs">Upcoming</Badge>;
//       case 'Follow Up':
//         return <Badge className="bg-orange-100 text-orange-800 text-xs">Follow Up</Badge>;
//       case 'Planning':
//         return <Badge className="bg-purple-100 text-purple-800 text-xs">Planning</Badge>;
//       default:
//         return <Badge variant="outline" className="text-xs">{status}</Badge>;
//     }
//   };

//   const getPriorityBadge = (priority: string) => {
//     switch (priority) {
//       case 'High':
//         return <Badge className="bg-red-600 text-white text-xs">High</Badge>;
//       case 'Medium':
//         return <Badge className="bg-yellow-500 text-white text-xs">Medium</Badge>;
//       case 'Low':
//         return <Badge className="bg-gray-500 text-white text-xs">Low</Badge>;
//       default:
//         return <Badge variant="outline" className="text-xs">{priority}</Badge>;
//     }
//   };

//   // Generate calendar days for the current month
//   const generateCalendarDays = () => {
//     const year = selectedDate.getFullYear();
//     const month = selectedDate.getMonth();
//     const firstDay = new Date(year, month, 1);
//     const lastDay = new Date(year, month + 1, 0);
//     const daysInMonth = lastDay.getDate();
//     const startingDayOfWeek = firstDay.getDay();

//     const days = [];

//     // Add empty cells for days before the first day of the month
//     for (let i = 0; i < startingDayOfWeek; i++) {
//       days.push(null);
//     }

//     // Add days of the month
//     for (let day = 1; day <= daysInMonth; day++) {
//       const date = new Date(year, month, day);
//       const dayEvents = events.filter(event => {
//         const eventDate = new Date(event.date);
//         return eventDate.toDateString() === date.toDateString();
//       });

//       days.push({
//         day,
//         date,
//         events: dayEvents,
//         isToday: date.toDateString() === new Date().toDateString()
//       });
//     }

//     return days;
//   };

//   const calendarDays = generateCalendarDays();
//   const monthNames = ["January", "February", "March", "April", "May", "June",
//     "July", "August", "September", "October", "November", "December"];

//   const navigateMonth = (direction: 'prev' | 'next') => {
//     const newDate = new Date(selectedDate);
//     if (direction === 'prev') {
//       newDate.setMonth(newDate.getMonth() - 1);
//     } else {
//       newDate.setMonth(newDate.getMonth() + 1);
//     }
//     setSelectedDate(newDate);
//   };

//   const selectedEvent = selectedEventId ? events.find(e => e.id === selectedEventId) : null;

//   return (
//     <div className="bg-neutral-50 flex flex-col h-full">
//       <HeaderSection setIsSidebarOpen={setIsSidebarOpen} />

//       {/* Page Header */}
//       <div className="px-4 sm:px-6 py-4 sm:py-6 bg-white border-b border-gray-200">
//         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
//           <div>
//             <h1 className="text-[20px] sm:text-[24px] lg:text-[28px] text-black">Event Hub</h1>
//             <p className="text-[12px] sm:text-[14px] text-gray-600 mt-1">Plan, execute, and track marketing events and their impact</p>
//           </div>
//           <div className="flex items-center gap-2">
//             <Button
//               variant="outline"
//               className="rounded-full border-gray-300 text-sm whitespace-nowrap"
//               onClick={() => import('sonner').then(({ toast }) => toast('Events added by AI is coming soon.'))}
//             >
//               <Star className="w-4 h-4 mr-2" />
//               Events added by AI
//             </Button>
//             <Button
//               className="bg-[#1a2c47] text-white rounded-full px-4 py-2 hover:bg-[#2a3c57] text-sm whitespace-nowrap"
//               onClick={() => setIsEventDialogOpen(true)}
//             >
//               <Plus className="w-4 h-4 mr-2" />
//               Create Event
//             </Button>
//           </div>
//         </div>
//       </div>

//       <div className="flex-1 overflow-auto">
//         <div className="px-4 sm:px-6 py-4 sm:py-6">
//           {/* Event Metrics */}
//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
//             <Card className="bg-white border border-gray-200">
//               <CardContent className="p-6">
//                 <div className="flex items-center justify-between mb-2">
//                   <h3 className="text-[16px] text-gray-800">Total Events</h3>
//                 </div>
//                 <p className="text-[36px] text-gray-900 font-semibold tracking-tight">
//                   {eventMetrics.total.toLocaleString()}
//                 </p>
//               </CardContent>
//             </Card>

//             <Card className="bg-white border border-gray-200">
//               <CardContent className="p-6">
//                 <div className="flex items-center justify-between mb-2">
//                   <h3 className="text-[16px] text-gray-800">Upcoming</h3>
//                 </div>
//                 <p className="text-[36px] text-gray-900 font-semibold tracking-tight">
//                   {eventMetrics.upcoming.toLocaleString()}
//                 </p>
//               </CardContent>
//             </Card>

//             <Card className="bg-white border border-gray-200">
//               <CardContent className="p-6">
//                 <div className="flex items-center justify-between mb-2">
//                   <h3 className="text-[16px] text-gray-800">Follow-ups</h3>
//                 </div>
//                 <p className="text-[36px] text-gray-900 font-semibold tracking-tight">
//                   {eventMetrics.followUps}
//                 </p>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Search and Filters */}
//           <Card className="bg-white border border-gray-200 mb-6">
//             <CardContent className="p-4 sm:p-6">
//               <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-4">
//                 <div className="relative flex-1 max-w-full sm:max-w-80">
//                   <Input
//                     placeholder="Search events..."
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     className="pl-10 rounded-full border-gray-300 text-sm"
//                   />
//                   <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//                 </div>

//                 <div className="flex flex-wrap gap-2 sm:gap-3">
//                   <Select value={selectedType} onValueChange={setSelectedType}>
//                     <SelectTrigger className="w-full sm:w-auto min-w-[120px] rounded-full border-gray-300 text-sm">
//                       <SelectValue placeholder="All Types" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="all">All Types</SelectItem>
//                       <SelectItem value="campaign">Campaign</SelectItem>
//                       <SelectItem value="webinar">Webinar</SelectItem>
//                       <SelectItem value="workshop">Workshop</SelectItem>
//                       <SelectItem value="training">Training</SelectItem>
//                       <SelectItem value="meeting">Meeting</SelectItem>
//                     </SelectContent>
//                   </Select>

//                   <Select value={selectedStatus} onValueChange={setSelectedStatus}>
//                     <SelectTrigger className="w-full sm:w-auto min-w-[120px] rounded-full border-gray-300 text-sm">
//                       <SelectValue placeholder="All Status" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="all">All Status</SelectItem>
//                       <SelectItem value="upcoming">Upcoming</SelectItem>
//                       <SelectItem value="in-progress">In Progress</SelectItem>
//                       <SelectItem value="follow-up">Follow Up</SelectItem>
//                       <SelectItem value="planning">Planning</SelectItem>
//                     </SelectContent>
//                   </Select>

//                   <Button variant="outline" className="rounded-full border-gray-300 text-sm whitespace-nowrap">
//                     <Filter className="w-4 h-4 mr-2" />
//                     More filters
//                   </Button>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Tab Navigation and View Controls */}
//           <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
//             {/* Event Type Tabs */}
//             <div className="bg-gray-200 bg-opacity-40 rounded-full p-1 inline-flex w-full sm:w-auto overflow-x-auto">
//               <Button
//                 variant={activeTab === 'all' ? 'default' : 'ghost'}
//                 className={`rounded-full px-3 sm:px-4 py-1 text-xs sm:text-sm whitespace-nowrap ${
//                   activeTab === 'all'
//                     ? 'bg-white text-black shadow-sm'
//                     : 'text-black hover:bg-gray-100'
//                 }`}
//                 onClick={() => setActiveTab('all')}
//               >
//                 All ({eventMetrics.total})
//               </Button>
//               <Button
//                 variant={activeTab === 'upcoming' ? 'default' : 'ghost'}
//                 className={`rounded-full px-3 sm:px-4 py-1 text-xs sm:text-sm whitespace-nowrap ${
//                   activeTab === 'upcoming'
//                     ? 'bg-white text-black shadow-sm'
//                     : 'text-black hover:bg-gray-100'
//                 }`}
//                 onClick={() => setActiveTab('upcoming')}
//               >
//                 Upcoming ({eventMetrics.upcoming})
//               </Button>
//               <Button
//                 variant={activeTab === 'follow-ups' ? 'default' : 'ghost'}
//                 className={`rounded-full px-3 sm:px-4 py-1 text-xs sm:text-sm whitespace-nowrap ${
//                   activeTab === 'follow-ups'
//                     ? 'bg-white text-black shadow-sm'
//                     : 'text-black hover:bg-gray-100'
//                 }`}
//                 onClick={() => setActiveTab('follow-ups')}
//               >
//                 Follow Ups ({eventMetrics.followUps})
//               </Button>
//             </div>

//             {/* Date Navigation and View Controls */}
//             <div className="flex items-center gap-3 flex-wrap">
//               <div className="flex items-center gap-2">
//                 <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
//                   <ArrowLeft className="w-4 h-4" />
//                 </Button>
//                 <div className="flex items-center gap-2 px-3 py-1 border border-gray-300 rounded-full">
//                   <CalendarIcon className="w-4 h-4 text-gray-600" />
//                   <span className="text-sm text-gray-700">
//                     {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}
//                   </span>
//                 </div>
//                 <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
//                   <ArrowRight className="w-4 h-4" />
//                 </Button>
//               </div>

//               <div className="flex items-center gap-2">
//                 <Button
//                   variant={viewMode === 'calendar' ? 'default' : 'outline'}
//                   size="sm"
//                   className={`${viewMode === 'calendar' ? 'bg-[#1a2c47] text-white border-[#1a2c47]' : 'border-gray-300'} rounded-full`}
//                   onClick={() => setViewMode('calendar')}
//                 >
//                   <CalendarIcon className="w-4 h-4 mr-1" />
//                   Calendar View
//                 </Button>
//                 <Button
//                   variant={viewMode === 'list' ? 'default' : 'outline'}
//                   size="sm"
//                   className={`${viewMode === 'list' ? 'bg-[#1a2c47] text-white border-[#1a2c47]' : 'border-gray-300'} rounded-full`}
//                   onClick={() => setViewMode('list')}
//                 >
//                   <List className="w-4 h-4 mr-1" />
//                   List View
//                 </Button>
//               </div>
//             </div>
//           </div>

//           {/* Calendar/List View */}
//           {viewMode === 'calendar' ? (
//             <Card className="bg-white border border-gray-200">
//               <CardContent className="p-6">
//                 {/* Calendar Header */}
//                 <div className="grid grid-cols-7 gap-2 mb-4">
//                   {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
//                     <div key={day} className="text-center p-3 bg-white rounded-lg">
//                       <span className="text-sm text-gray-900">{day}</span>
//                     </div>
//                   ))}
//                 </div>

//                 {/* Calendar Grid */}
//                 <div className="grid grid-cols-7 gap-2">
//                   {calendarDays.map((day, index) => (
//                     <div
//                       key={index}
//                       className={`min-h-[80px] p-2 rounded-lg border ${
//                         day ? 'bg-white border-gray-200' : 'bg-transparent'
//                       }`}
//                       onDragOver={(e) => {
//                         if (day) e.preventDefault();
//                       }}
//                       onDrop={(e) => {
//                         if (!day) return;
//                         const idStr = e.dataTransfer.getData('text/plain');
//                         const id = Number(idStr);
//                         if (!id) return;
//                         const targetDate = day.date;
//                         const yyyy = targetDate.getFullYear();
//                         const mm = String(targetDate.getMonth() + 1).padStart(2, '0');
//                         const dd = String(targetDate.getDate()).padStart(2, '0');
//                         const iso = `${yyyy}-${mm}-${dd}`;
//                         const display = `${dd}-${mm}-${yyyy}`;
//                         setEvents(prev => prev.map(ev => ev.id === id ? { ...ev, date: iso, eventDate: display } : ev));
//                         import('sonner').then(({ toast }) => toast.success('Event date updated'));
//                       }}
//                     >
//                       {day && (
//                         <>
//                           <div className={`text-center mb-2 ${day.isToday ? 'font-semibold text-blue-600' : 'text-gray-900'}`}>
//                             {day.day}
//                           </div>
//                           <div className="space-y-1">
//                             {day.events.slice(0, 3).map(event => (
//                               <div
//                                 key={event.id}
//                                 className="flex items-center gap-1 cursor-pointer"
//                                 draggable
//                                 onDragStart={(e) => {
//                                   e.dataTransfer.setData('text/plain', String(event.id));
//                                 }}
//                                 onClick={() => handleEventClick(event.id)}
//                               >
//                                 <div className={`w-2 h-2 rounded-full ${
//                                   event.priority === 'High' ? 'bg-red-600' :
//                                   event.priority === 'Medium' ? 'bg-yellow-500' : 'bg-blue-600'
//                                 }`} />
//                                 <span className="text-xs text-gray-700 truncate">
//                                   {event.type}
//                                 </span>
//                               </div>
//                             ))}
//                             {day.events.length > 3 && (
//                               <div className="text-xs text-gray-500">
//                                 +{day.events.length - 3} more
//                               </div>
//                             )}
//                           </div>
//                         </>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               </CardContent>
//             </Card>
//           ) : (
//             <div className="space-y-4">
//               {tabFilteredEvents.map(event => (
//                 <Card
//                   key={event.id}
//                   className="bg-white border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
//                   onClick={() => handleEventClick(event.id)}
//                 >
//                   <CardContent className="p-6">
//                     <div className="flex items-start justify-between mb-4">
//                       <div className="flex-1">
//                         <div className="flex items-center gap-3 mb-2">
//                           <h3 className="text-lg text-black">{event.title}</h3>
//                           {getStatusBadge(event.status)}
//                           {getPriorityBadge(event.priority)}
//                         </div>
//                         <p className="text-sm text-gray-600 mb-3">{event.description}</p>
//                         <div className="flex items-center gap-4 text-sm text-gray-600">
//                           <div className="flex items-center gap-1">
//                             <CalendarIcon className="w-4 h-4" />
//                             {event.eventDate}
//                           </div>
//                           <div className="flex items-center gap-1">
//                             <Clock className="w-4 h-4" />
//                             {event.time}
//                           </div>
//                           <div className="flex items-center gap-1">
//                             <MapPin className="w-4 h-4" />
//                             {event.location}
//                           </div>
//                           {(event as any).relatedTaskId !== undefined && (
//                             <div className="flex items-center gap-1">
//                               <a
//                                 className="text-blue-600 hover:underline"
//                                 href={`/planner?task=${(event as any).relatedTaskId}`}
//                                 onClick={(e) => {
//                                   e.preventDefault();
//                                   e.stopPropagation();
//                                   const url = `/planner?task=${(event as any).relatedTaskId}`;
//                                   (window as any).openTaskFromQuery = (event as any).relatedTaskId;
//                                   window.history.pushState(null, '', url);
//                                   window.dispatchEvent(new Event('popstate'));
//                                 }}
//                               >
//                                 Related Task #{(event as any).relatedTaskId}
//                               </a>
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center gap-2">
//                         <Badge variant="outline" className="text-xs">
//                           {event.type}
//                         </Badge>
//                         <span className="text-xs text-gray-500">
//                           {event.assignedTeam.length} team members
//                         </span>
//                       </div>
//                       <span className="text-xs text-gray-500">{event.dueTime}</span>
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Event Detail Dialog */}
//       <Dialog open={isEventDetailOpen} onOpenChange={setIsEventDetailOpen}>
//         <DialogContent className="max-w-[95vw] sm:max-w-2xl bg-white mx-4 max-h-[90vh] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle>{selectedEvent?.title}</DialogTitle>
//             <DialogDescription>
//               View and manage event details and milestones
//             </DialogDescription>
//           </DialogHeader>

//           {selectedEvent && (
//             <div className="space-y-6">
//               <div className="flex items-center gap-2">
//                 {getStatusBadge(isEditingEvent ? editDraft?.status : selectedEvent.status)}
//                 {getPriorityBadge(isEditingEvent ? editDraft?.priority : selectedEvent.priority)}
//                 <Badge variant="outline">{isEditingEvent ? editDraft?.type : selectedEvent.type}</Badge>
//               </div>

//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 <div>
//                   <Label className="text-sm text-gray-700">Event Details</Label>
//                   <div className="mt-2 space-y-2 text-sm">
//                     <div className="flex justify-between gap-3 items-center">
//                       <span className="text-gray-600">Date:</span>
//                       {isEditingEvent ? (
//                         <Input
//                           value={editDraft?.eventDate || ''}
//                           onChange={(e) => setEditDraft((d: any) => ({ ...d, eventDate: e.target.value }))}
//                           className="border-gray-300 max-w-[180px]"
//                         />
//                       ) : (
//                         <span className="text-gray-900">{selectedEvent.eventDate}</span>
//                       )}
//                     </div>
//                     <div className="flex justify-between gap-3 items-center">
//                       <span className="text-gray-600">Time:</span>
//                       {isEditingEvent ? (
//                         <Input
//                           value={editDraft?.time || ''}
//                           onChange={(e) => setEditDraft((d: any) => ({ ...d, time: e.target.value }))}
//                           className="border-gray-300 max-w-[180px]"
//                         />
//                       ) : (
//                         <span className="text-gray-900">{selectedEvent.time}</span>
//                       )}
//                     </div>
//                     <div className="flex justify-between gap-3 items-center">
//                       <span className="text-gray-600">Location:</span>
//                       {isEditingEvent ? (
//                         <Input
//                           value={editDraft?.location || ''}
//                           onChange={(e) => setEditDraft((d: any) => ({ ...d, location: e.target.value }))}
//                           className="border-gray-300 max-w-[200px]"
//                         />
//                       ) : (
//                         <span className="text-gray-900">{selectedEvent.location}</span>
//                       )}
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Due:</span>
//                       <span className="text-gray-900">{selectedEvent.dueTime}</span>
//                     </div>
//                   </div>
//                 </div>

//                 <div>
//                   <Label className="text-sm text-gray-700">Assigned Team</Label>
//                   <div className="mt-2 space-y-2">
//                     {selectedEvent.assignedTeam.map(member => (
//                       <div key={member.id} className="flex items-center gap-2">
//                         <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
//                           <span className="text-xs text-gray-600">{member.initials}</span>
//                         </div>
//                         <div>
//                           <div className="text-sm text-gray-900">{member.name}</div>
//                           <div className="text-xs text-gray-600">{member.role}</div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>

//               <div>
//                 <Label className="text-sm text-gray-700">Description</Label>
//                 {isEditingEvent ? (
//                   <Textarea
//                     className="border-gray-300 mt-2"
//                     rows={3}
//                     value={editDraft?.description || ''}
//                     onChange={(e) => setEditDraft((d: any) => ({ ...d, description: e.target.value }))}
//                   />
//                 ) : (
//                   <p className="mt-2 text-sm text-gray-900">{selectedEvent.description}</p>
//                 )}
//               </div>

//               <div>
//                 <Label className="text-sm text-gray-700">Milestones</Label>
//                 <div className="mt-2 space-y-3">
//                   {selectedEvent.milestones.map(milestone => (
//                     <div key={milestone.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//                       <div className="flex-1">
//                         <div className="text-sm text-gray-900">{milestone.title}</div>
//                         <div className="text-xs text-gray-600">
//                           Assigned to {milestone.assignedTo} • Due: {milestone.dueDate}
//                         </div>
//                       </div>
//                       <Badge
//                         variant={milestone.status === 'Completed' ? 'default' : 'outline'}
//                         className="text-xs"
//                       >
//                         {milestone.status}
//                       </Badge>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               <div className="flex justify-between items-center gap-2 pt-4 border-t">
//                 {(selectedEvent as any).relatedTaskId !== undefined && (
//                   <div className="text-sm">
//                     <span className="text-gray-600 mr-1">Related Task:</span>
//                     <a
//                       className="text-blue-600 hover:underline"
//                       href={`/planner?task=${(selectedEvent as any).relatedTaskId}`}
//                       onClick={(e) => {
//                         e.preventDefault();
//                         const url = `/planner?task=${(selectedEvent as any).relatedTaskId}`;
//                         (window as any).openTaskFromQuery = (selectedEvent as any).relatedTaskId;
//                         window.history.pushState(null, '', url);
//                         window.dispatchEvent(new Event('popstate'));
//                         setIsEventDetailOpen(false);
//                       }}
//                     >
//                       View Task #{(selectedEvent as any).relatedTaskId}
//                     </a>
//                   </div>
//                 )}
//                 <Button variant="outline" onClick={handleDuplicate}>
//                   <Copy className="w-4 h-4 mr-2" />
//                   Duplicate
//                 </Button>
//                 {isEditingEvent ? (
//                   <Button className="bg-[#1a2c47] text-white hover:bg-[#2a3c57]" onClick={handleSaveEdit}>
//                     Save Changes
//                   </Button>
//                 ) : (
//                   <Button variant="outline" onClick={() => setIsEditingEvent(true)}>
//                     <Edit className="w-4 h-4 mr-2" />
//                     Edit
//                   </Button>
//                 )}
//                 <Button variant="outline" className="text-red-600 border-red-300 hover:bg-red-50" onClick={handleDelete}>
//                   <Trash2 className="w-4 h-4 mr-2" />
//                   Delete
//                 </Button>
//               </div>
//             </div>
//           )}
//         </DialogContent>
//       </Dialog>

//       {/* Create Event Dialog */}
//       <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
//         <DialogContent className="max-w-[95vw] sm:max-w-lg bg-white mx-4">
//           <DialogHeader>
//             <DialogTitle>Create New Event</DialogTitle>
//             <DialogDescription>
//               Create a new marketing event and assign team members
//             </DialogDescription>
//           </DialogHeader>
//           <div className="space-y-4">
//             <div>
//               <Label htmlFor="title" className="text-sm text-gray-700 mb-2 block">Event Title</Label>
//               <Input
//                 id="title"
//                 placeholder="Enter event title"
//                 className="border-gray-300"
//               />
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <Label htmlFor="type" className="text-sm text-gray-700 mb-2 block">Type</Label>
//                 <Select>
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select type" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="campaign">Campaign</SelectItem>
//                     <SelectItem value="webinar">Webinar</SelectItem>
//                     <SelectItem value="workshop">Workshop</SelectItem>
//                     <SelectItem value="training">Training</SelectItem>
//                     <SelectItem value="meeting">Meeting</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div>
//                 <Label htmlFor="priority" className="text-sm text-gray-700 mb-2 block">Priority</Label>
//                 <Select>
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select priority" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="high">High</SelectItem>
//                     <SelectItem value="medium">Medium</SelectItem>
//                     <SelectItem value="low">Low</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <Label htmlFor="date" className="text-sm text-gray-700 mb-2 block">Date</Label>
//                 <Input
//                   id="date"
//                   type="date"
//                   className="border-gray-300"
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="time" className="text-sm text-gray-700 mb-2 block">Time</Label>
//                 <Input
//                   id="time"
//                   type="time"
//                   className="border-gray-300"
//                 />
//               </div>
//             </div>

//             <div>
//               <Label htmlFor="location" className="text-sm text-gray-700 mb-2 block">Location</Label>
//               <Input
//                 id="location"
//                 placeholder="Event location"
//                 className="border-gray-300"
//               />
//             </div>

//             <div>
//               <Label htmlFor="description" className="text-sm text-gray-700 mb-2 block">Description</Label>
//               <Textarea
//                 id="description"
//                 placeholder="Event description and objectives..."
//                 className="border-gray-300 resize-none"
//                 rows={3}
//               />
//             </div>

//             <div className="flex justify-end gap-3 pt-4 border-t">
//               <Button variant="outline" onClick={() => setIsEventDialogOpen(false)}>
//                 Cancel
//               </Button>
//               <Button
//                 className="bg-[#1a2c47] text-white hover:bg-[#2a3c57]"
//                 onClick={() => {
//                   import('sonner').then(({ toast }) => toast.success('Event created.'));
//                   setIsEventDialogOpen(false);
//                 }}
//               >
//                 Create Event
//               </Button>
//             </div>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };


const EventHubPage = () => {
  return (
    <div>
      Event Hub
    </div>
  )
}

export default EventHubPage
