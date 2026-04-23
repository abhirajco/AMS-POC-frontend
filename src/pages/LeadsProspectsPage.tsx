// import { Button } from "../components/ui/button";
// import { Input } from "../components/ui/input";
// import { Label } from "../components/ui/label";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
// import { Badge } from "../components/ui/badge";
// import { Avatar, AvatarFallback } from "../components/ui/avatar";
// import { Card, CardContent } from "../components/ui/card";
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { Plus, Search, Filter, Phone, Mail, MapPin, Star } from 'lucide-react';
// import { HeaderSection } from "../components/common/HeaderSection";
// import { handleSendMQL, handleSendSQL } from "../utils/helpers";
// import { mockLeads } from "../data/mockData";
// import { useState } from 'react';

// interface LeadsProspectsPageProps {
//   setIsSidebarOpen: (open: boolean) => void;
//   searchQuery: string;
//   setSearchQuery: (query: string) => void;
//   leadsView: string;
//   setLeadsView: (view: string) => void;
//   selectedLeadId: number | null;
//   setSelectedLeadId: (id: number | null) => void;
//   isLeadDialogOpen: boolean;
//   setIsLeadDialogOpen: (open: boolean) => void;
//   handleLeadClick: (id: number) => void;
// }

// export const LeadsProspectsPage = ({
//   setIsSidebarOpen,
//   searchQuery,
//   setSearchQuery,
//   leadsView,
//   setLeadsView,
//   selectedLeadId,

//   isLeadDialogOpen,
//   setIsLeadDialogOpen,
//   handleLeadClick
// }: LeadsProspectsPageProps) => {
//   // Local filter state
//   const [selectedType, setSelectedType] = useState<string>('all');
//   const [selectedStage, setSelectedStage] = useState<string>('all');
//   const [selectedSource, setSelectedSource] = useState<string>('all');
//   const [selectedSort, setSelectedSort] = useState<string>('none');
//   const [selectedDays, setSelectedDays] = useState<string>('30');
//   const [selectedQuarter, setSelectedQuarter] = useState<string>('all');
//   const [isCreateLeadOpen, setIsCreateLeadOpen] = useState<boolean>(false);
//   const [createLeadForm, setCreateLeadForm] = useState({
//     name: '',
//     company: '',
//     email: '',
//     phone: '',
//     position: '',
//     leadType: 'Lead',
//     stage: '',
//     source: '',
//     purchaseTimeline: '',
//   });
//   const handleCreateChange = (field: string, value: string) => {
//     setCreateLeadForm(prev => ({ ...prev, [field]: value }));
//   };

//   // Helper placed before filters to avoid TDZ issues when used inside filter callbacks
//   const parseQuarterForFilter = (timeline?: string): number => {
//     if (!timeline) return 0;
//     const match = String(timeline).match(/Q([1-4])/i);
//     return match ? Number(match[1]) : 0;
//   };

//   // Filter leads based on view and search
//   const filteredLeads = mockLeads.filter(lead => {
//     if (leadsView === 'mqls' && lead.leadType !== 'MQL') return false;
//     if (leadsView === 'sqls' && lead.leadType !== 'SQL') return false;

//     // Filters
//     if (selectedType !== 'all' && lead.leadType !== selectedType) return false;
//     if (selectedStage !== 'all' && (lead.stage || '').toLowerCase() !== selectedStage.toLowerCase()) return false;
//     if (selectedSource !== 'all' && (lead.source || '') !== selectedSource) return false;

//     // Days filter (mock implementation - you can adjust based on your data structure)
//     if (selectedDays !== 'all') {
//       // This is a placeholder - you'll need to implement based on your actual date field
//       // For now, we'll just pass through all leads
//     }

//     // Quarter filter (quarter-only, ignore year)
//     if (selectedQuarter !== 'all') {
//       const leadQuarterNumber = parseQuarterForFilter(lead.purchaseTimeline);
//       const selectedQuarterNumber = Number(String(selectedQuarter).replace(/[^1-4]/g, ''));
//       if (selectedQuarterNumber >= 1 && selectedQuarterNumber <= 4) {
//         if (leadQuarterNumber !== selectedQuarterNumber) return false;
//       }
//     }

//     // Search (name + company + email + position + source)
//     if (searchQuery) {
//       const q = searchQuery.toLowerCase();
//       const hay = `${lead.name} ${lead.company} ${lead.email || ''} ${lead.position || ''} ${lead.source || ''}`.toLowerCase();
//       if (!hay.includes(q)) return false;
//     }

//     return true;
//   });

//   const parseQuarter = (timeline?: string) => {
//     // Example: "Q3 2025"
//     if (!timeline) return { year: 0, quarter: 0 };
//     const match = String(timeline).match(/Q([1-4])\s*(\d{4})?/i);
//     const quarter = match ? Number(match[1]) : 0;
//     const year = match && match[2] ? Number(match[2]) : 0;
//     return { year, quarter };
//   };

//   const sortedLeads = [...filteredLeads].sort((a, b) => {
//     switch (selectedSort) {
//       case 'leadScore':
//         return (b.score || 0) - (a.score || 0);
//       case 'quarter': {
//         const pa = parseQuarter(a.purchaseTimeline);
//         const pb = parseQuarter(b.purchaseTimeline);
//         if (pb.year !== pa.year) return pb.year - pa.year;
//         return pb.quarter - pa.quarter;
//       }
//       default:
//         return 0;
//     }
//   });

//   // Calculate leads metrics
//   const leadsMetrics = {
//     total: mockLeads.filter(lead => ['Lead', 'MQL', 'SQL'].includes(lead.leadType)).length,
//     mqls: mockLeads.filter(lead => lead.leadType === 'MQL').length,
//     sqls: mockLeads.filter(lead => lead.leadType === 'SQL').length
//   };

//   return (
//     <div className="bg-neutral-50 flex flex-col h-full">
//       <HeaderSection setIsSidebarOpen={setIsSidebarOpen} />

//       {/* Page Header */}
//       <div className="px-4 sm:px-6 py-4 sm:py-6 bg-white">
//         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
//           <div>
//             <h1 className="text-[20px] sm:text-[24px] lg:text-[28px] font-medium text-black">Leads & Prospects</h1>
//             <p className="text-[12px] sm:text-[14px] text-gray-600 mt-1">Manage leads and prospects with Marketing Qualified Leads(MQLs)/Sales Qualified Leads(SQLs) classification and Pardot integration</p>
//           </div>
//           <div className="flex items-center gap-2">
//             <Button
//               variant="outline"
//               className="rounded-full border-gray-300 text-sm whitespace-nowrap"
//               onClick={() => import('sonner').then(({ toast }) => toast('Leads by AI is coming soon.'))}
//             >
//               <Star className="w-4 h-4 mr-2" />
//               Leads by AI
//             </Button>
//             <Button className="bg-[#1a2c47] text-white rounded-full px-4 py-2 hover:bg-[#2a3c57] text-sm sm:text-base whitespace-nowrap" onClick={() => setIsCreateLeadOpen(true)}>
//               <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
//               Add a Lead
//             </Button>
//           </div>
//         </div>
//       </div>

//       {/* Leads Metrics */}
//       <div className="px-4 sm:px-6 pb-4 sm:pb-6">
//         <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-4">
//           {[
//             { label: "Total Leads", value: leadsMetrics.total, color: "text-gray-900" },
//             { label: "Marketing Qualified Leads", value: leadsMetrics.mqls, color: "text-gray-900" },
//             { label: "Sales Qualified Leads", value: leadsMetrics.sqls, color: "text-gray-900" }
//           ].map((metric, index) => (
//             <Card key={index} className="bg-white border border-gray-200">
//               <CardContent className="p-4 sm:p-6">
//                 <h3 className="font-semibold text-[14px] sm:text-[16px] text-gray-800 mb-2 sm:mb-3">{metric.label}</h3>
//                 <p className={`text-[24px] sm:text-[32px] lg:text-[36px] font-semibold ${metric.color} tracking-tight`}>
//                   {metric.value}
//                 </p>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       </div>

//       {/* Search and Filters */}
//       <div className="px-4 sm:px-6 pb-4">
//         <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
//           <div className="relative flex-1 min-w-[280px]">
//             <Input
//               placeholder="Search leads"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="pl-10 rounded-full border-gray-300 text-sm"
//             />
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
//           </div>

//           <div className="flex flex-wrap gap-2 sm:gap-3 items-center w-full justify-end">
//             {/* Last Days filter */}
//             <Select value={selectedDays} onValueChange={setSelectedDays}>
//               <SelectTrigger className="w-full sm:w-auto min-w-[140px] rounded-full border-gray-300 text-sm">
//                 <SelectValue placeholder="Last 30 Days" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="7">Last 7 Days</SelectItem>
//                 <SelectItem value="30">Last 30 Days</SelectItem>
//                 <SelectItem value="90">Last 90 Days</SelectItem>
//                 <SelectItem value="365">Last 1 Year</SelectItem>
//               </SelectContent>
//             </Select>

//             {/* Quarter filter */}
//             <Select value={selectedQuarter} onValueChange={setSelectedQuarter}>
//               <SelectTrigger className="w-full sm:w-auto min-w-[120px] rounded-full border-gray-300 text-sm">
//                 <SelectValue placeholder="Quarter" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">All Quarters</SelectItem>
//                 <SelectItem value="Q1">Q1 2025</SelectItem>
//                 <SelectItem value="Q2">Q2 2025</SelectItem>
//                 <SelectItem value="Q3">Q3 2025</SelectItem>
//                 <SelectItem value="Q4">Q4 2025</SelectItem>
//               </SelectContent>
//             </Select>

//             {/* All Types filter */}
//             <Select value={selectedType} onValueChange={setSelectedType}>
//               <SelectTrigger className="w-full sm:w-auto min-w-[120px] rounded-full border-gray-300 text-sm">
//                 <SelectValue placeholder="All Types" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">All Types</SelectItem>
//                 <SelectItem value="Lead">Lead</SelectItem>
//                 <SelectItem value="MQL">Marketing Qualified Lead</SelectItem>
//                 <SelectItem value="SQL">Sales Qualified Lead</SelectItem>
//               </SelectContent>
//             </Select>

//             {/* All Stage filter */}
//             {(() => {
//               const stageOptions = Array.from(new Set((mockLeads || []).map(l => l.stage).filter(Boolean))) as string[];
//               return (
//                 <Select value={selectedStage} onValueChange={setSelectedStage}>
//                   <SelectTrigger className="w-full sm:w-auto min-w-[120px] rounded-full border-gray-300 text-sm">
//                     <SelectValue placeholder="All Stage" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">All Stage</SelectItem>
//                     {stageOptions.map(s => (
//                       <SelectItem key={s} value={String(s).toLowerCase()}>{s}</SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               );
//             })()}

//             {/* All Sources filter */}
//             {(() => {
//               const sourceOptions = Array.from(new Set((mockLeads || []).map(l => l.source).filter(Boolean))) as string[];
//               return (
//                 <Select value={selectedSource} onValueChange={setSelectedSource}>
//                   <SelectTrigger className="w-full sm:w-auto min-w-[140px] rounded-full border-gray-300 text-sm">
//                     <SelectValue placeholder="All Sources" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">All Sources</SelectItem>
//                     {sourceOptions.map(s => (
//                       <SelectItem key={s} value={s}>{s}</SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               );
//             })()}

//             <Button variant="outline" className="rounded-full border-gray-300 text-sm whitespace-nowrap">
//               <Filter className="w-4 h-4 mr-2" />
//               More filters
//             </Button>

//             {/* Sort control aligned to right */}
//             <div className="ml-auto">
//               <Select value={selectedSort} onValueChange={setSelectedSort}>
//                 <SelectTrigger className="w-full sm:w-auto min-w-[160px] rounded-full border-gray-300 text-sm">
//                   <SelectValue placeholder="Sort" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="none">Sort</SelectItem>
//                   <SelectItem value="leadScore">Lead Score (High to Low)</SelectItem>
//                   <SelectItem value="quarter">Quarter (Newest First)</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Lead Type Tabs */}
//       <div className="px-4 sm:px-6 pb-4">
//         <div className="bg-gray-200 bg-opacity-40 rounded-full p-1 inline-flex w-full sm:w-auto overflow-x-auto">
//           <Button
//             variant={leadsView === 'all' ? 'default' : 'ghost'}
//             className={`rounded-full px-3 sm:px-4 py-1 text-xs sm:text-sm font-semibold whitespace-nowrap ${
//               leadsView === 'all'
//                 ? 'bg-white text-black shadow-sm'
//                 : 'text-black hover:bg-gray-100'
//             }`}
//             onClick={() => setLeadsView('all')}
//           >
//             All Leads ({mockLeads.length})
//           </Button>
//           <Button
//             variant={leadsView === 'mqls' ? 'default' : 'ghost'}
//             className={`rounded-full px-3 sm:px-4 py-1 text-xs sm:text-sm font-semibold whitespace-nowrap ${
//               leadsView === 'mqls'
//                 ? 'bg-white text-black shadow-sm'
//                 : 'text-black hover:bg-gray-100'
//             }`}
//             onClick={() => setLeadsView('mqls')}
//           >
//             Marketing Qualified Leads ({mockLeads.filter(lead => lead.leadType === 'MQL').length})
//           </Button>
//           <Button
//             variant={leadsView === 'sqls' ? 'default' : 'ghost'}
//             className={`rounded-full px-3 sm:px-4 py-1 text-xs sm:text-sm font-semibold whitespace-nowrap ${
//               leadsView === 'sqls'
//                 ? 'bg-white text-black shadow-sm'
//                 : 'text-black hover:bg-gray-100'
//             }`}
//             onClick={() => setLeadsView('sqls')}
//           >
//             Sales Qualified Leads ({mockLeads.filter(lead => lead.leadType === 'SQL').length})
//           </Button>
//           {/* Hot Leads tab removed as per requirements */}
//         </div>
//       </div>

//       {/* Leads List */}
//       <div className="flex-1 px-4 sm:px-6 pb-12 overflow-auto">
//         <div className="space-y-2.5">
//           {sortedLeads.map((lead) => (
//             <Card
//               key={lead.id}
//               className="bg-white border border-gray-300 hover:shadow-md transition-shadow cursor-pointer"
//               onClick={() => handleLeadClick(lead.id)}
//             >
//               <CardContent className="p-3 sm:p-4">
//                 <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
//                   <div className="flex items-center gap-3 flex-1">
//                     <Avatar className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0">
//                       <AvatarFallback className="bg-gray-200 text-black text-xs sm:text-sm">
//                         {lead.avatar}
//                       </AvatarFallback>
//                     </Avatar>
//                     <div className="min-w-0 flex-1">
//                       <h3 className="font-medium text-[13px] sm:text-[14px] text-black mb-1 truncate">
//                         {lead.name}
//                       </h3>
//                       <p className="text-[11px] sm:text-[12px] text-gray-600 mb-1 truncate">
//                         {lead.position} at {lead.company}
//                       </p>
//                       <div className="flex flex-wrap items-center gap-2 text-[10px] sm:text-[11px] text-gray-600">
//                         <div className="flex items-center gap-1">
//                           <Mail className="w-3 h-3" />
//                           <span className="truncate">{lead.email}</span>
//                         </div>
//                         <div className="flex items-center gap-1">
//                           <Phone className="w-3 h-3" />
//                           <span>{lead.phone}</span>
//                         </div>
//                         <div className="flex items-center gap-1">
//                           <MapPin className="w-3 h-3" />
//                           <span className="truncate">{lead.location}</span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 lg:gap-4">
//                     <div className="flex items-center gap-2">
//                       <Badge variant="outline" className="border-gray-400 text-xs">
//                         {lead.leadType === 'MQL' ? 'Marketing Qualified Lead' : lead.leadType === 'SQL' ? 'Sales Qualified Lead' : lead.leadType}
//                       </Badge>
//                     </div>

//                     <div className="text-right">
//                       <div className="text-[10px] sm:text-[11px] text-gray-600">
//                         Score: {lead.score}
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="mt-3 flex flex-wrap gap-1.5">
//                   {lead.tags && lead.tags.map((tag, tagIndex) => (
//                     <Badge key={tagIndex} variant="outline" className="text-[10px] sm:text-xs border-gray-400">
//                       {tag === 'MQL' ? 'Marketing Qualified Lead' : tag === 'SQL' ? 'Sales Qualified Lead' : tag}
//                     </Badge>
//                   ))}
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       </div>

//       {/* Lead Detail Dialog */}
//       <Dialog open={isLeadDialogOpen} onOpenChange={setIsLeadDialogOpen}>
//         <DialogContent className="max-w-[95vw] sm:max-w-2xl bg-white mx-4 max-h-[90vh] overflow-y-auto">
//           {selectedLeadId && (() => {
//             const lead = mockLeads.find(l => l.id === selectedLeadId);
//             if (!lead) return null;

//             return (
//               <div className="space-y-4">
//                 {/* Header */}
//                 <DialogHeader>
//                   <div className="flex items-center justify-between">
//                     <DialogTitle className="text-[14px] sm:text-[16px] font-medium">Lead Details</DialogTitle>
//                   </div>
//                 </DialogHeader>

//                 {/* Lead Profile */}
//                 <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
//                   <Avatar className="w-12 h-12 sm:w-16 sm:h-16">
//                     <AvatarFallback className="bg-gray-200 text-black text-lg">
//                       {lead.avatar}
//                     </AvatarFallback>
//                   </Avatar>
//                   <div className="flex-1 min-w-0">
//                     <h3 className="font-medium text-[14px] sm:text-[16px] text-black mb-1">
//                       {lead.name}
//                     </h3>
//                     <p className="text-[12px] sm:text-[13px] text-gray-600 mb-2">
//                       {lead.position} at {lead.company}
//                     </p>
//                     <div className="flex flex-wrap items-center gap-3 text-[11px] sm:text-[12px] text-gray-600">
//                       <div className="flex items-center gap-1">
//                         <Mail className="w-3 h-3 sm:w-4 sm:h-4" />
//                         <span>{lead.email}</span>
//                       </div>
//                       <div className="flex items-center gap-1">
//                         <Phone className="w-3 h-3 sm:w-4 sm:h-4" />
//                         <span>{lead.phone}</span>
//                       </div>
//                       <div className="flex items-center gap-1">
//                         <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
//                         <span>{lead.location}</span>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="flex flex-col items-end gap-2">
//                     <div className="flex items-center gap-2">
//                       <Badge variant="outline" className="border-gray-400 text-xs">
//                         {lead.leadType === 'MQL' ? 'Marketing Qualified Lead' : lead.leadType === 'SQL' ? 'Sales Qualified Lead' : lead.leadType}
//                       </Badge>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Deal Information */}
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   <div className="space-y-3">
//                     <h4 className="font-medium text-[13px] sm:text-[14px] text-black">Deal Information</h4>
//                     <div className="space-y-2 text-[11px] sm:text-[12px]">

//                       <div className="flex justify-between">
//                         <span className="text-gray-600">Stage:</span>
//                         <span className="text-black capitalize">{lead.stage}</span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-gray-600">Lead Score:</span>
//                         <span className="text-black">{lead.score}</span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-gray-600">Purchase Timeline:</span>
//                         <span className="text-black">{lead.purchaseTimeline}</span>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="space-y-3">
//                     <h4 className="font-medium text-[13px] sm:text-[14px] text-black">Source Information</h4>
//                     <div className="space-y-2 text-[11px] sm:text-[12px]">
//                       <div className="flex justify-between">
//                         <span className="text-gray-600">Source:</span>
//                         <span className="text-black">{lead.source}</span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-gray-600">Pardot ID:</span>
//                         <span className="text-black">{lead.pardotId}</span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-gray-600">Assigned To:</span>
//                         <span className="text-black">{lead.assignedTo}</span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-gray-600">Last Activity:</span>
//                         <span className="text-black">{lead.lastActivity}</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Tags */}
//                 <div>
//                   <h4 className="font-medium text-[13px] sm:text-[14px] text-black mb-2">Tags</h4>
//                   <div className="flex flex-wrap gap-1.5">
//                     {lead.tags && lead.tags.map((tag, index) => (
//                       <Badge key={index} variant="outline" className="text-[10px] sm:text-xs border-gray-400">
//                         {tag}
//                       </Badge>
//                     ))}
//                     {lead.verificationTags && lead.verificationTags.map((tag, index) => (
//                       <Badge key={`verification-${index}`} className="bg-green-100 text-green-800 text-[10px] sm:text-xs">
//                         {tag}
//                       </Badge>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Recent Activities */}
//                 <div>
//                   <h4 className="font-medium text-[13px] sm:text-[14px] text-black mb-3">Recent Activities</h4>
//                   <div className="space-y-2">
//                     {lead.recentActivities && lead.recentActivities.map((activity, index) => (
//                       <div key={index} className="flex items-start gap-3 p-2 bg-gray-50 rounded">
//                         <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
//                         <div className="flex-1 min-w-0">
//                           <p className="text-[11px] sm:text-[12px] text-black font-medium">
//                             {activity.description}
//                           </p>
//                           <p className="text-[10px] sm:text-[11px] text-gray-600">
//                             Assigned by {activity.assignedBy} • {activity.campaign}
//                           </p>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Action Buttons */}
//                 <div className="grid grid-cols-2 gap-3 pt-4">
//                   <Button
//                     className="bg-[#1a2c47] text-white hover:bg-[#2a3c57] text-sm"
//                     onClick={() => handleSendMQL(lead.id, setIsLeadDialogOpen)}
//                   >
//                     Send to Marketing (MQL)
//                   </Button>
//                   <Button
//                     className="bg-green-600 text-white hover:bg-green-700 text-sm"
//                     onClick={() => handleSendSQL(lead.id, setIsLeadDialogOpen)}
//                   >
//                     Send to Sales (SQL)
//                   </Button>
//                 </div>
//               </div>
//             );
//           })()}
//         </DialogContent>
//       </Dialog>

//       {/* Create Lead Dialog */}
//       <Dialog open={isCreateLeadOpen} onOpenChange={setIsCreateLeadOpen}>
//         <DialogContent className="max-w-[95vw] sm:max-w-2xl bg-white mx-4">
//           <DialogHeader>
//             <DialogTitle>Create New Lead</DialogTitle>
//           </DialogHeader>
//           <div className="space-y-4">
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <div>
//                 <Label className="block text-sm text-gray-700 mb-1">Name</Label>
//                 <Input value={createLeadForm.name} onChange={(e) => handleCreateChange('name', e.target.value)} className="border-gray-300" placeholder="Full name" />
//               </div>
//               <div>
//                 <Label className="block text-sm text-gray-700 mb-1">Company</Label>
//                 <Input value={createLeadForm.company} onChange={(e) => handleCreateChange('company', e.target.value)} className="border-gray-300" placeholder="Company name" />
//               </div>
//               <div>
//                 <Label className="block text-sm text-gray-700 mb-1">Email</Label>
//                 <Input type="email" value={createLeadForm.email} onChange={(e) => handleCreateChange('email', e.target.value)} className="border-gray-300" placeholder="name@company.com" />
//               </div>
//               <div>
//                 <Label className="block text-sm text-gray-700 mb-1">Phone</Label>
//                 <Input value={createLeadForm.phone} onChange={(e) => handleCreateChange('phone', e.target.value)} className="border-gray-300" placeholder="+1 (555) 000-0000" />
//               </div>
//               <div>
//                 <Label className="block text-sm text-gray-700 mb-1">Position</Label>
//                 <Input value={createLeadForm.position} onChange={(e) => handleCreateChange('position', e.target.value)} className="border-gray-300" placeholder="e.g., VP of Technology" />
//               </div>
//               <div>
//                 <Label className="block text-sm text-gray-700 mb-1">Lead Type</Label>
//                 <Select value={createLeadForm.leadType} onValueChange={(v) => handleCreateChange('leadType', v)}>
//                   <SelectTrigger className="border-gray-300">
//                     <SelectValue placeholder="Select type" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="Lead">Lead</SelectItem>
//                     <SelectItem value="MQL">Marketing Qualified Lead</SelectItem>
//                     <SelectItem value="SQL">Sales Qualified Lead</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div>
//                 <Label className="block text-sm text-gray-700 mb-1">Stage</Label>
//                 <Select value={createLeadForm.stage} onValueChange={(v) => handleCreateChange('stage', v)}>
//                   <SelectTrigger className="border-gray-300">
//                     <SelectValue placeholder="Select stage" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="discovery">Discovery</SelectItem>
//                     <SelectItem value="proposal">Proposal</SelectItem>
//                     <SelectItem value="awareness">Awareness</SelectItem>
//                     <SelectItem value="evaluation">Evaluation</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div>
//                 <Label className="block text-sm text-gray-700 mb-1">Source</Label>
//                 <Select value={createLeadForm.source} onValueChange={(v) => handleCreateChange('source', v)}>
//                   <SelectTrigger className="border-gray-300">
//                     <SelectValue placeholder="Select source" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="Website">Website</SelectItem>
//                     <SelectItem value="LinkedIn">LinkedIn</SelectItem>
//                     <SelectItem value="Event">Event</SelectItem>
//                     <SelectItem value="Referral">Referral</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div>
//                 <Label className="block text-sm text-gray-700 mb-1">Purchase Timeline</Label>
//                 <Select value={createLeadForm.purchaseTimeline} onValueChange={(v) => handleCreateChange('purchaseTimeline', v)}>
//                   <SelectTrigger className="border-gray-300">
//                     <SelectValue placeholder="Select quarter" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="Q1 2025">Q1 2025</SelectItem>
//                     <SelectItem value="Q2 2025">Q2 2025</SelectItem>
//                     <SelectItem value="Q3 2025">Q3 2025</SelectItem>
//                     <SelectItem value="Q4 2025">Q4 2025</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>

//             <div className="flex justify-end gap-2 pt-2">
//               <Button variant="outline" onClick={() => setIsCreateLeadOpen(false)}>Cancel</Button>
//               <Button className="bg-[#1a2c47] text-white hover:bg-[#2a3c57]" onClick={() => { import('sonner').then(({ toast }) => toast.success('Lead sent for approval.')); setIsCreateLeadOpen(false); }}>Send for Approval</Button>
//             </div>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

const LeadsProspectsPage = () => {
  return (
    <div>
        lead-pro
    </div>
  )
}

export default LeadsProspectsPage
