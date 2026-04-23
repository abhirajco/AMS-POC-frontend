// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Badge } from "@/components/ui/badge";
// import { Card, CardContent } from "@/components/ui/card";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
// import { Plus, Search, Calendar, ArrowUpRight, Check, Copy, Share, Edit, Star } from 'lucide-react';
// import { HeaderSection } from "@/components/common/HeaderSection";
// import { getProofPointStatusBadge, handleApproveProofPoint, handleRejectProofPoint, handleDisapproveProofPoint } from "@/utils/helpers";
// import { mockProofPoints } from "@/data/mockData";
// import { useState, useEffect } from 'react';

// interface ProofPointsPageProps {
//   setIsSidebarOpen: (open: boolean) => void;
//   setCurrentPage: (page: string) => void;
//   searchQuery: string;
//   setSearchQuery: (query: string) => void;
//   userRole: string;
//   proofPointsView: string;
//   setProofPointsView: (view: string) => void;
//   selectedProofPointId: number | null;
//   setSelectedProofPointId?: (id: number | null) => void;
//   isProofPointDialogOpen: boolean;
//   setIsProofPointDialogOpen: (open: boolean) => void;
//   handleProofPointClick: (id: number) => void;
// }

// export const ProofPointsPage = ({
//   setIsSidebarOpen,
//   setCurrentPage,
//   searchQuery,
//   setSearchQuery,
//   proofPointsView,
//   setProofPointsView,
//   selectedProofPointId,
//   isProofPointDialogOpen,
//   setIsProofPointDialogOpen,
//   handleProofPointClick
// }: ProofPointsPageProps) => {
//   // Local filter state for the Status dropdown
//   const [selectedStatus, setSelectedStatus] = useState<string>('pending');

//   // Keep the left tab semantics in sync with the status filter
//   useEffect(() => {
//     if (proofPointsView === 'pending' && selectedStatus === 'all') {
//       setProofPointsView('all');
//     } else if (proofPointsView === 'all' && selectedStatus !== 'all') {
//       setProofPointsView('pending');
//     }
//   }, [selectedStatus]);

//   // Filter proof points based on current view (tabs), status filter and search query
//   const filteredProofPoints = mockProofPoints.filter(point => {
//     // Tabs: Pending Approval / Approved
//     if (proofPointsView === 'pending' && point.status !== 'pending') return false;
//     if (proofPointsView === 'approved' && point.status !== 'approved') return false;
//     if (proofPointsView === 'rejected' && point.status !== 'rejected') return false;
//     // 'all' shows everything

//     // "All Status" dropdown filter (ignored on Approved tab)
//     if (proofPointsView !== 'approved') {
//       if (selectedStatus !== 'all' && point.status !== selectedStatus) return false;
//     }

//     // Search across multiple fields
//     if (searchQuery) {
//       const haystack = (
//         [
//           point.title,
//           point.client,
//           point.industry,
//           point.type,
//           point.source,
//           point.content,
//           Array.isArray(point.tags) ? point.tags.join(' ') : ''
//         ]
//           .join(' ')
//           .toLowerCase()
//       );
//       if (!haystack.includes(searchQuery.toLowerCase())) return false;
//     }

//     return true;
//   });

//   // Determine the oldest proof point by dateAdded (ascending)
//   const oldestProofPointId = (() => {
//     try {
//       const toDate = (d: string) => {
//         // supports formats like DD-MM-YYYY
//         const parts = String(d || '').split('-').map(Number);
//         if (parts.length === 3) return new Date(parts[2], parts[1] - 1, parts[0]).getTime();
//         const t = Date.parse(d as string);
//         return isNaN(t) ? Number.POSITIVE_INFINITY : t;
//       };
//       const all = [...mockProofPoints];
//       all.sort((a, b) => toDate(a.dateAdded) - toDate(b.dateAdded));
//       return all[0]?.id ?? null;
//     } catch {
//       return null;
//     }
//   })();

//   // Calculate proof point metrics
//   const approvedCount = mockProofPoints.filter(point => point.status === 'approved').length;
//   const pendingCount = mockProofPoints.filter(point => point.status === 'pending').length;
//   const rejectedCount = mockProofPoints.filter(point => point.status === 'rejected').length;
//   const proofPointMetrics = {
//     total: approvedCount + pendingCount + rejectedCount,
//     approved: approvedCount,
//     pending: pendingCount,
//     rejected: rejectedCount
//   };

//   return (
//     <div className="bg-neutral-50 flex flex-col h-full">
//       <HeaderSection setIsSidebarOpen={setIsSidebarOpen} />

//       {/* Page Header */}
//       <div className="px-4 sm:px-6 py-4 sm:py-6 bg-white">
//         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
//           <div>
//             <h1 className="text-[20px] sm:text-[24px] lg:text-[28px] font-medium text-black">Proof Points</h1>
//             <p className="text-[12px] sm:text-[14px] text-gray-600 mt-1">Manage all your proof points at one place</p>
//           </div>
//           <div className="flex items-center gap-2">
//             <Button
//               variant="outline"
//               className="rounded-full border-gray-300 text-sm whitespace-nowrap"
//               onClick={() => import('sonner').then(({ toast }) => toast('Proof Points by AI is coming soon.'))}
//             >
//               <Star className="w-4 h-4 mr-2" />
//               Proof Points by AI
//             </Button>
//             <Button
//               className="bg-[#1a2c47] text-white rounded-full px-4 py-2 hover:bg-[#2a3c57] text-sm sm:text-base whitespace-nowrap"
//               onClick={() => setCurrentPage('new-proof-point')}
//             >
//               <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
//               New Proof Point
//             </Button>
//           </div>
//         </div>
//       </div>

//       {/* Proof Point Metrics */}
//       <div className="px-4 sm:px-6 pb-4 sm:pb-6">
//         <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
//           {[
//             { label: "Total Points", value: proofPointMetrics.total, color: "text-gray-900" },
//             { label: "Approved", value: proofPointMetrics.approved, color: "text-gray-900" },
//             { label: "Pending", value: proofPointMetrics.pending, color: "text-gray-900" },
//             { label: "Rejected", value: proofPointMetrics.rejected, color: "text-gray-900" }
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
//           <div className="relative flex-1 max-w-full sm:max-w-80">
//             <Input
//               placeholder="Search proof"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="pl-10 rounded-full border-gray-300 text-sm"
//             />
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
//           </div>

//           <Select value={selectedStatus} onValueChange={setSelectedStatus}>
//             <SelectTrigger className="w-full sm:w-auto min-w-[120px] rounded-full border-gray-300 text-sm">
//               <SelectValue placeholder="All Status" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="all">All Status</SelectItem>
//               <SelectItem value="pending">Pending</SelectItem>
//               <SelectItem value="rejected">Rejected</SelectItem>
//             </SelectContent>
//           </Select>

//           {/* Extracted by AI button moved to page header */}
//         </div>
//       </div>

//       {/* View Toggle Tabs */}
//       <div className="px-4 sm:px-6 pb-4">
//         <div className="bg-gray-200 bg-opacity-40 rounded-full p-1 inline-flex w-full sm:w-auto overflow-x-auto">
//           {(() => {
//             const leftTabIsAll = selectedStatus === 'all';
//             const leftLabel = leftTabIsAll ? 'All Proof Points' : 'Pending Approval';
//             const leftCount = leftTabIsAll ? proofPointMetrics.total : proofPointMetrics.pending;
//             const leftView = leftTabIsAll ? 'all' : 'pending';
//             return (
//               <Button
//                 variant={proofPointsView === leftView ? 'default' : 'ghost'}
//                 className={`rounded-full px-3 sm:px-4 py-1 text-xs sm:text-sm font-semibold whitespace-nowrap ${
//                   proofPointsView === leftView
//                     ? 'bg-white text-black shadow-sm'
//                     : 'text-black hover:bg-gray-100'
//                 }`}
//                 onClick={() => setProofPointsView(leftView)}
//               >
//                 {leftLabel} ({leftCount})
//               </Button>
//             );
//           })()}

//           <Button
//             variant={proofPointsView === 'approved' ? 'default' : 'ghost'}
//             className={`rounded-full px-3 sm:px-4 py-1 text-xs sm:text-sm font-semibold whitespace-nowrap ${
//               proofPointsView === 'approved'
//                 ? 'bg-white text-black shadow-sm'
//                 : 'text-black hover:bg-gray-100'
//             }`}
//             onClick={() => setProofPointsView('approved')}
//           >
//             Approved ({proofPointMetrics.approved})
//           </Button>
//           <Button
//             variant={proofPointsView === 'rejected' ? 'default' : 'ghost'}
//             className={`rounded-full px-3 sm:px-4 py-1 text-xs sm:text-sm font-semibold whitespace-nowrap ${
//               proofPointsView === 'rejected'
//                 ? 'bg-white text-black shadow-sm'
//                 : 'text-black hover:bg-gray-100'
//             }`}
//             onClick={() => setProofPointsView('rejected')}
//           >
//             Rejected ({proofPointMetrics.rejected})
//           </Button>
//         </div>
//       </div>

//       {/* Proof Points List */}
//       <div className="flex-1 px-4 sm:px-6 pb-12 overflow-auto">
//         <div className="space-y-2.5">
//           {filteredProofPoints.map((point) => (
//             <Card
//               key={point.id}
//               className="bg-white border border-gray-300 hover:shadow-md transition-shadow cursor-pointer"
//               onClick={() => handleProofPointClick(point.id)}
//             >
//               <CardContent className="p-3 sm:p-4">
//                 <div className="space-y-3">
//                   {/* Title and Status */}
//                   <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
//                     <div className="flex-1 min-w-0">
//                       <h3 className="font-medium text-[13px] sm:text-[14px] text-black mb-1 sm:mb-2 leading-snug">
//                         {point.title}
//                       </h3>
//                     </div>
//                     <div className="flex items-center gap-2 flex-shrink-0">
//                       {getProofPointStatusBadge(point.status)}
//                       <Badge variant="outline" className="border-gray-400 text-xs">
//                         {point.type}
//                       </Badge>
//                     </div>
//                   </div>

//                   {/* Metadata */}
//                   <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-[11px] sm:text-[12px] text-gray-600">
//                     <span>{point.dateAdded}</span>
//                     <div className="w-0.5 h-0.5 bg-gray-600 rounded-full hidden sm:block" />
//                     <span>Client : {point.client?.trim() ? point.client : 'N/A'}</span>
//                     {point.industry?.trim() && (
//                       <>
//                         <div className="w-0.5 h-0.5 bg-gray-600 rounded-full hidden sm:block" />
//                         <span>Industry : {point.industry}</span>
//                       </>
//                     )}
//                     <>
//                       <div className="w-0.5 h-0.5 bg-gray-600 rounded-full hidden sm:block" />
//                       <span>Customer Consent : {point.customerConsentDate || 'N/A'}</span>
//                     </>
//                     {point.comments?.trim() && (
//                       <>
//                         <div className="w-0.5 h-0.5 bg-gray-600 rounded-full hidden sm:block" />
//                         <span>{point.comments}</span>
//                       </>
//                     )}
//                   </div>

//                   {/* Source and Tags */}
//                   <div className="flex flex-col sm:flex-row items-start gap-2 sm:gap-3">
//                     <div className="flex items-center gap-1 text-[11px] sm:text-[12px] text-gray-600">
//                       <span>Source : {point.source}</span>
//                       <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4" />
//                     </div>
//                     <div className="flex flex-wrap gap-1.5 sm:gap-2">
//                       {point.tags.map((tag, tagIndex) => (
//                         <Badge key={tagIndex} variant="outline" className="text-[10px] sm:text-xs border-gray-400">
//                           {tag}
//                         </Badge>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       </div>

//       {/* Proof Point Detail Dialog */}
//       <Dialog open={isProofPointDialogOpen} onOpenChange={setIsProofPointDialogOpen}>
//         <DialogContent className="max-w-[95vw] sm:max-w-md bg-white mx-4 max-h-[90vh] overflow-y-auto">
//           {selectedProofPointId && (() => {
//             const proofPoint = mockProofPoints.find(p => p.id === selectedProofPointId);
//             if (!proofPoint) return null;

//             return (
//               <div className="space-y-4">
//                 {/* Header */}
//                 <DialogHeader>
//                   <div className="flex items-center justify-between">
//                     <DialogTitle className="text-[13px] sm:text-[14px] font-medium">Proof Point</DialogTitle>
//                   </div>
//                   <DialogDescription>
//                     View and manage proof point details and approval status.
//                   </DialogDescription>
//                 </DialogHeader>

//                 {/* Title and Verification */}
//                 <div className="space-y-2">
//                   <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
//                     <h3 className="text-[13px] sm:text-[14px] font-medium text-black leading-snug">
//                       {proofPoint.title}
//                     </h3>
//                     {proofPoint.verified && (
//                       <div className="flex items-center gap-1 text-green-600 flex-shrink-0">
//                         <Check className="w-3 h-3 sm:w-4 sm:h-4" />
//                         <span className="text-[11px] sm:text-[12px] font-medium">Verified</span>
//                       </div>
//                     )}
//                   </div>

//                   {/* Content */}
//                   <div className="bg-gray-50 border border-gray-200 rounded p-3 min-h-[150px] sm:min-h-[200px]">
//                     <div className="text-[10px] sm:text-[11px] text-black leading-relaxed whitespace-pre-line">
//                       {proofPoint.content}
//                     </div>
//                   </div>
//                 </div>

//                 {/* Details Grid */}
//                 <div className="space-y-4">
//                   {/* Customer and Remarked By */}
//                   <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//                     <div>
//                       <div className="text-[11px] sm:text-[12px] font-semibold text-gray-600 mb-2">Customer</div>
//                       <div className="text-[11px] sm:text-[12px] text-gray-600">{proofPoint.customer?.trim() ? proofPoint.customer : 'N/A'}</div>
//                     </div>
//                     <div>
//                       <div className="text-[11px] sm:text-[12px] font-semibold text-gray-600 mb-2">Remarked By</div>
//                       <div className="text-[11px] sm:text-[12px] text-gray-600">{proofPoint.remarkedBy?.trim() ? proofPoint.remarkedBy : 'N/A'}</div>
//                     </div>
//                     <div>
//                       <div className="text-[11px] sm:text-[12px] font-semibold text-gray-600 mb-2">Category</div>
//                       <div className="text-[11px] sm:text-[12px] text-gray-600">{proofPoint.category?.trim() ? proofPoint.category : 'N/A'}</div>
//                     </div>
//                   </div>

//                   {/* Tags */}
//                   <div>
//                     <div className="text-[11px] sm:text-[12px] font-semibold text-gray-600 mb-2">Tags</div>
//                     <div className="flex flex-wrap gap-1.5 sm:gap-2">
//                       {(proofPoint.tags || []).map((tag, index) => (
//                         <Badge key={index} variant="outline" className="text-[10px] sm:text-xs border-gray-400">
//                           {tag}
//                         </Badge>
//                       ))}
//                     </div>
//                   </div>

//                   {/* Dates */}
//                   <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//                     <div>
//                       <div className="text-[11px] sm:text-[12px] font-semibold text-gray-600 mb-2">Date Added</div>
//                       <div className="flex items-center gap-1 text-[11px] sm:text-[12px] text-gray-600">
//                         <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
//                         <span>{proofPoint.dateAdded}</span>
//                       </div>
//                     </div>
//                     <div>
//                       <div className="text-[11px] sm:text-[12px] font-semibold text-gray-600 mb-2">Date Updated</div>
//                       <div className="flex items-center gap-1 text-[11px] sm:text-[12px] text-gray-600">
//                         <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
//                         <span>{proofPoint.dateUpdated}</span>
//                       </div>
//                     </div>
//                     <div>
//                       <div className="text-[11px] sm:text-[12px] font-semibold text-gray-600 mb-2">Customer Consent Date</div>
//                       <div className="flex items-center gap-1 text-[11px] sm:text-[12px] text-gray-600">
//                         <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
//                         <span>{proofPoint.customerConsentDate || 'N/A'}</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Action Buttons */}
//                 <div className="space-y-3 pt-4">
//                   {/* Copy, Share, Edit buttons */}
//                   <div className="grid grid-cols-3 gap-2">
//                     <Button
//                       variant="outline"
//                       className="rounded-full border-gray-300 text-xs sm:text-sm"
//                       onClick={() => import('sonner').then(({ toast }) => toast('Copy functionality coming soon.'))}
//                     >
//                       <Copy className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
//                       Copy
//                     </Button>
//                     <Button
//                       variant="outline"
//                       className="rounded-full border-gray-300 text-xs sm:text-sm"
//                       onClick={() => import('sonner').then(({ toast }) => toast('Share functionality coming soon.'))}
//                     >
//                       <Share className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
//                       Share
//                     </Button>
//                     <Button
//                       variant="outline"
//                       className="rounded-full border-gray-300 text-xs sm:text-sm"
//                       onClick={() => import('sonner').then(({ toast }) => toast('Edit functionality coming soon.'))}
//                     >
//                       <Edit className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
//                       Edit
//                     </Button>
//                   </div>

//                   {/* Approve/Reject or Disapprove CTAs */}
//                   {proofPoint.status === 'approved' ? (
//                     <div className="grid grid-cols-2 gap-2">
//                       <Button
//                         className="bg-[#6b7280] text-white hover:bg-[#6b7280] cursor-not-allowed rounded-full text-xs sm:text-sm"
//                         disabled
//                       >
//                         Approve
//                       </Button>
//                       <Button
//                         className="bg-[#c33142] text-white hover:bg-red-700 rounded-full text-xs sm:text-sm"
//                         onClick={() => handleDisapproveProofPoint(proofPoint.id, setIsProofPointDialogOpen)}
//                       >
//                         Disapprove
//                       </Button>
//                     </div>
//                   ) : proofPoint.status === 'rejected' ? (
//                     <div className="grid grid-cols-2 gap-2">
//                       <Button
//                         className={`rounded-full text-xs sm:text-sm ${proofPoint.id === oldestProofPointId ? 'bg-[#9aa4b2] text-white cursor-not-allowed hover:bg-[#9aa4b2]' : 'bg-[#1a2c47] text-white hover:bg-[#2a3c57]'}`}
//                         onClick={() => proofPoint.id !== oldestProofPointId && handleApproveProofPoint(proofPoint.id, setIsProofPointDialogOpen)}
//                         disabled={proofPoint.id === oldestProofPointId}
//                       >
//                         Approve
//                       </Button>
//                       <Button
//                         className="bg-[#6b7280] text-white hover:bg-[#6b7280] cursor-not-allowed rounded-full text-xs sm:text-sm"
//                         disabled
//                       >
//                         Disapprove
//                       </Button>
//                     </div>
//                   ) : (
//                     <div className="grid grid-cols-2 gap-2">
//                       <Button
//                         className={`rounded-full text-xs sm:text-sm ${proofPoint.id === oldestProofPointId ? 'bg-[#9aa4b2] text-white cursor-not-allowed hover:bg-[#9aa4b2]' : 'bg-[#1a2c47] text-white hover:bg-[#2a3c57]'}`}
//                         onClick={() => proofPoint.id !== oldestProofPointId && handleApproveProofPoint(proofPoint.id, setIsProofPointDialogOpen)}
//                         disabled={proofPoint.id === oldestProofPointId}
//                       >
//                         Approve
//                       </Button>
//                       <Button
//                         className="bg-[#c33142] text-white hover:bg-red-700 rounded-full text-xs sm:text-sm"
//                         onClick={() => handleRejectProofPoint(proofPoint.id, setIsProofPointDialogOpen)}
//                       >
//                         Reject
//                       </Button>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             );
//           })()}
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

const ProofPointsPage = () => {
  return (
    <div>
      Proof Point
    </div>
  )
}

export default ProofPointsPage
