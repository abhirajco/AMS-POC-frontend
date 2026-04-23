// import { useCallback, useMemo, useState } from 'react';
// import { Button } from "../components/ui/button";
// import { Input } from "../components/ui/input";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
// import { Badge } from "../components/ui/badge";
// import { Card, CardContent } from "../components/ui/card";
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../components/ui/dialog";
// import { Label } from "../components/ui/label";
// import { Textarea } from "../components/ui/textarea";
// import {
//   Plus, Search, Filter, Calendar as CalendarIcon, ArrowUpRight,
//   ArrowLeft, ArrowRight, Upload, Paperclip, Star
// } from 'lucide-react';
// import { HeaderSection } from "../components/common/HeaderSection";
// import { mockAssets as dataAssets } from "../data/mockData";

// interface AssetsManagementPageProps {
//   setIsSidebarOpen: (open: boolean) => void;
//   searchQuery: string;
//   setSearchQuery: (query: string) => void;
//   assetsView: string;
//   setAssetsView: (view: string) => void;
//   assetViewMode: string;
//   setAssetViewMode: (mode: string) => void;
//   selectedAssetId: number | null;
//   setSelectedAssetId: (id: number | null) => void;
//   isAssetDialogOpen: boolean;
//   setIsAssetDialogOpen: (open: boolean) => void;
//   isUploadDialogOpen: boolean;
//   setIsUploadDialogOpen: (open: boolean) => void;
//   handleAssetClick: (id: number) => void;
// }

// export const AssetsManagementPage = ({
//   setIsSidebarOpen,
//   searchQuery,
//   setSearchQuery,

//   selectedAssetId,

//   isAssetDialogOpen,
//   setIsAssetDialogOpen,
//   isUploadDialogOpen,
//   setIsUploadDialogOpen,
//   handleAssetClick
// }: AssetsManagementPageProps) => {

//   // Form state for upload dialog
//   const [uploadForm, setUploadForm] = useState({
//     title: '',
//     assetType: '',
//     category: '',
//     url: '',
//     description: '',
//     tags: '',
//     attachments: [] as File[]
//   });

//   // Local UI state
//   const [selectedType, setSelectedType] = useState<string>('all');
//   const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
//   const [selectedDate, setSelectedDate] = useState<Date>(new Date());
//   const [selectedUploader, setSelectedUploader] = useState<string>('all');

//   // Helpers
//   interface Asset {
//     id: number;
//     title?: string;
//     name?: string;
//     type?: string;
//     fileExtension?: string;
//     format?: string;
//     uploadDate?: string;
//     date?: string;
//     description?: string;
//     uploadedBy?: string;
//     tags?: string[];
//     duration?: string;
//     url?: string;
//     category?: string;
//     fileSize?: string;
//     size?: string;
//   }

//   const allAssets: Asset[] = (dataAssets as unknown as Asset[]);

//   const getAssetLabel = useCallback((asset: Asset): string => asset.title ?? asset.name ?? 'Untitled', []);
//   const getAssetUploadDate = useCallback((asset: Asset): string => asset.uploadDate ?? asset.date ?? '', []);
//   const getAssetTypeKey = useCallback((asset: Asset): string => {
//     const type = String(asset.type ?? '').toLowerCase();
//     const ext = String(asset.fileExtension ?? '').toLowerCase();
//     const hasUrl = Boolean(asset.url);
//     if (type.includes('video')) return 'video';
//     if (type.includes('image')) return 'image';
//     if (type.includes('audio')) return 'audio';
//     if (type === 'pdf' || ext === 'pdf') return 'pdf';
//     if (type === 'ppt' || ext === 'ppt' || ext === 'pptx') return 'ppt';
//     if (type === 'excel' || ext === 'xls' || ext === 'xlsx') return 'excel';
//     if (type === 'link' || hasUrl && !ext) return 'link';
//     return type || 'other';
//   }, []);

//   // Derived filtered assets
//   const filteredAssets: Asset[] = useMemo(() => {
//     const q = (searchQuery || '').toLowerCase().trim();
//     return (allAssets || []).filter((asset: Asset) => {
//       if (selectedType !== 'all' && getAssetTypeKey(asset) !== selectedType) return false;
//       if (selectedUploader !== 'all' && (asset.uploadedBy || '').toLowerCase() !== selectedUploader.toLowerCase()) return false;
//       if (q) {
//         const hay = [
//           getAssetLabel(asset),
//           asset.description ?? '',
//           asset.uploadedBy ?? '',
//           (asset.tags ?? []).join(' ')
//         ].join(' ').toLowerCase();
//         if (!hay.includes(q)) return false;
//       }
//       return true;
//     });
//   }, [selectedType, selectedUploader, searchQuery, allAssets, getAssetLabel, getAssetTypeKey]);

//   // Calendar
//   const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
//   type Day = { day: number; date: Date; assets: Asset[]; isToday: boolean };
//   const generateCalendarDays = (): Array<Day | null> => {
//     const year = selectedDate.getFullYear();
//     const month = selectedDate.getMonth();
//     const firstDay = new Date(year, month, 1);
//     const lastDay = new Date(year, month + 1, 0);
//     const daysInMonth = lastDay.getDate();
//     const startingDay = firstDay.getDay();
//     const days: Array<Day | null> = [];
//     for (let i = 0; i < startingDay; i++) days.push(null);
//     for (let d = 1; d <= daysInMonth; d++) {
//       const date = new Date(year, month, d);
//       const assetsForDay = filteredAssets.filter((a: Asset) => {
//         const up = getAssetUploadDate(a as Asset);
//         if (!up) return false;
//         const ad = new Date(up);
//         return ad.toDateString() === date.toDateString();
//       });
//       days.push({ day: d, date, assets: assetsForDay, isToday: date.toDateString() === new Date().toDateString() });
//     }
//     return days;
//   };
//   const calendarDays = generateCalendarDays();
//   const navigateMonth = (dir: 'prev'|'next') => {
//     const nd = new Date(selectedDate);
//     nd.setMonth(nd.getMonth() + (dir === 'next' ? 1 : -1));
//     setSelectedDate(nd);
//   };

//   const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const files = Array.from(event.target.files || []);
//     setUploadForm(prev => ({
//       ...prev,
//       attachments: [...prev.attachments, ...files]
//     }));
//   };

//   const removeAttachment = (index: number) => {
//     setUploadForm(prev => ({
//       ...prev,
//       attachments: prev.attachments.filter((_, i) => i !== index)
//     }));
//   };

//   const handleUploadSubmit = () => {
//     console.log('Uploading asset:', uploadForm);
//     import('sonner').then(({ toast }) => toast.success('Asset uploaded.'));
//     setIsUploadDialogOpen(false);
//     // Reset form
//     setUploadForm({
//       title: '',
//       assetType: '',
//       category: 'Innovation',
//       url: '',
//       description: '',
//       tags: '',
//       attachments: []
//     });
//   };

//   return (
//     <div className="bg-neutral-50 flex flex-col h-full">
//       <HeaderSection setIsSidebarOpen={setIsSidebarOpen} />

//       {/* Page Header */}
//       <div className="px-6 py-6 bg-white">
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-[28px] font-medium text-black leading-[36px] mb-1">
//               Assets Management
//             </h1>
//             <p className="text-[14px] text-[#4f4f4f] leading-[20px]">
//               Manage all your relevant assets at one place
//             </p>
//           </div>
//           <div className="flex items-center gap-2">
//             <Button
//               variant="outline"
//               className="rounded-[44px] border-gray-300 text-sm whitespace-nowrap"
//               onClick={() => import('sonner').then(({ toast }) => toast('Assets by AI is coming soon.'))}
//             >
//               <Star className="w-5 h-5 mr-2" />
//               Assets by AI
//             </Button>
//             <Button
//               className="bg-[#1a2c47] text-white rounded-[44px] px-4 py-2 hover:bg-[#2a3c57] flex items-center gap-2"
//               onClick={() => setIsUploadDialogOpen(true)}
//             >
//               <Plus className="w-5 h-5" />
//               Add Asset
//             </Button>
//           </div>
//         </div>
//       </div>

//       {/* Metrics Cards */}
//       <div className="px-6 pb-6">
//         <div className="grid grid-cols-3 gap-4">
//           <Card className="bg-white border border-[#e9eaeb] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] rounded-lg">
//             <CardContent className="p-6">
//               <h3 className="text-[16px] font-semibold text-[#181d27] leading-[24px] mb-3">
//                 Total Assets
//               </h3>
//               <p className="text-[36px] font-semibold text-[#181d27] leading-[44px] tracking-[-0.72px]">
//                 2,420
//               </p>
//             </CardContent>
//           </Card>

//           <Card className="bg-white border border-[#e9eaeb] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] rounded-lg">
//             <CardContent className="p-6">
//               <h3 className="text-[16px] font-semibold text-[#181d27] leading-[24px] mb-3">
//                 AI Generated
//               </h3>
//               <p className="text-[36px] font-semibold text-[#181d27] leading-[44px] tracking-[-0.72px]">
//                 1,762
//               </p>
//             </CardContent>
//           </Card>

//           <Card className="bg-white border border-[#e9eaeb] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] rounded-lg">
//             <CardContent className="p-6">
//               <h3 className="text-[16px] font-semibold text-[#181d27] leading-[24px] mb-3">
//                 Manually Added
//               </h3>
//               <p className="text-[36px] font-semibold text-[#181d27] leading-[44px] tracking-[-0.72px]">
//                 658
//               </p>
//             </CardContent>
//           </Card>
//         </div>
//       </div>

//       {/* Search and Filters */}
//       <div className="px-6 pb-4">
//         <div className="flex items-center gap-4">
//           <div className="relative flex-1 max-w-80">
//             <Input
//               placeholder="Search Content"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="pl-10 rounded-[58px] border-[#d5d7da] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]"
//             />
//             <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-[#717680] w-5 h-5" />
//           </div>

//           <Select value={selectedType} onValueChange={setSelectedType}>
//             <SelectTrigger className="w-full sm:w-auto min-w-[160px] rounded-[38px] border-[#d5d7da] text-sm">
//               <SelectValue placeholder="All Types" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="all">All Types</SelectItem>
//               <SelectItem value="video">Video</SelectItem>
//               <SelectItem value="image">Images</SelectItem>
//               <SelectItem value="audio">Audio</SelectItem>
//               <SelectItem value="pdf">PDF Files</SelectItem>
//               <SelectItem value="ppt">PPT</SelectItem>
//               <SelectItem value="excel">Excel Sheets</SelectItem>
//               <SelectItem value="link">Links</SelectItem>
//             </SelectContent>
//           </Select>

//           {/* Uploaded By filter */}
//           <Select value={selectedUploader} onValueChange={setSelectedUploader}>
//             <SelectTrigger className="w-full sm:w-auto min-w-[180px] rounded-[38px] border-[#d5d7da] text-sm">
//               <SelectValue placeholder="Uploaded By" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="all">Uploaded By</SelectItem>
//               <SelectItem value="Sujith Kumar">Sujith Kumar</SelectItem>
//               <SelectItem value="Maurvee Sharma">Maurvee Sharma</SelectItem>
//               <SelectItem value="Sweta Awasthi">Sweta Awasthi</SelectItem>
//               <SelectItem value="Matt Pesce">Matt Pesce</SelectItem>
//               <SelectItem value="Lionel Alva">Lionel Alva</SelectItem>
//               <SelectItem value="Richard Jefferies">Richard Jefferies</SelectItem>
//             </SelectContent>
//           </Select>

//           <Button variant="outline" className="rounded-[38px] border-[#d5d7da] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] bg-neutral-50 flex items-center gap-2">
//             <Filter className="w-5 h-5 text-[#414651]" />
//             <span className="text-[14px] text-[#414651]">More filters</span>
//           </Button>
//         </div>
//       </div>

//       {/* Date and View Controls */}
//       <div className="px-6 pb-5">
//         <div className="flex items-center gap-5">
//           <div className="flex items-center gap-2">
//             <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')} className="rounded-full border-[#d5d7da]">
//               <ArrowLeft className="w-4 h-4" />
//             </Button>
//             <div className="flex items-center gap-2 px-3 py-1 border border-gray-300 rounded-full">
//             <CalendarIcon className="w-5 h-5 text-[#414651]" />
//               <span className="text-[14px] text-[#414651]">
//                 {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}
//               </span>
//             </div>
//             <Button variant="outline" size="sm" onClick={() => navigateMonth('next')} className="rounded-full border-[#d5d7da]">
//               <ArrowRight className="w-4 h-4" />
//           </Button>
//           </div>

//           <Button
//             variant={viewMode === 'calendar' ? 'default' : 'outline'}
//             className={`${viewMode === 'calendar' ? 'bg-[#1a2c47] text-white border-[#1a2c47]' : ''} rounded-[38px] border-[#d5d7da] flex items-center gap-2`}
//             onClick={() => setViewMode(viewMode === 'calendar' ? 'list' : 'calendar')}
//           >
//             <CalendarIcon className="w-5 h-5" />
//             <span className="text-[14px]">{viewMode === 'calendar' ? 'List View' : 'Calendar View'}</span>
//           </Button>
//         </div>
//       </div>

//       {/* Assets List / Calendar */}
//       {viewMode === 'list' ? (
//       <div className="flex-1 px-6 pb-12 overflow-auto">
//         <div className="space-y-2.5">
//             {filteredAssets.map((asset: Asset) => (
//               <Card key={asset.id as number} className="bg-white border border-[#cac4d0] rounded-xl cursor-pointer" onClick={() => handleAssetClick(asset.id)}>
//               <CardContent className="px-4 py-3">
//                 <div className="flex items-center justify-between gap-2">
//                   <div className="flex-1">
//                     {/* Title and Tags */}
//                     <div className="flex items-center gap-2 mb-2">
//                         <h3 className="text-[14px] font-medium text-black leading-[19.5px] tracking-[-0.075px]">
//                           {getAssetLabel(asset)}
//                       </h3>
//                         <Badge variant="outline" className="text-[10px] sm:text-xs border-gray-400">
//                           {asset.type as string}
//                         </Badge>
//                         {(asset.tags ?? []).map((tag: string, index: number) => (
//                           <Badge key={index} variant="outline" className="text-[10px] sm:text-xs border-gray-400">
//                             {tag}
//                         </Badge>
//                       ))}
//                     </div>

//                     {/* Description */}
//                       {asset.description && (
//                         <p className="text-[12px] text-[#4a4459] leading-[16.9px] tracking-[-0.065px] font-medium mb-3">
//                       {asset.description}
//                     </p>
//                       )}

//                     {/* Upload Info */}
//                       <div className="flex items-center gap-4 text-[12px] text-[#4a4459] leading-[16.9px] tracking-[-0.065px] font-medium">
//                         {asset.uploadedBy && <span>Upload by {asset.uploadedBy}</span>}
//                       <div className="w-0.5 h-0.5 bg-[#4a4459] rounded-full"></div>
//                       <div className="flex items-center gap-1 px-2">
//                         <CalendarIcon className="w-4 h-4 text-[#767685]" />
//                           <span className="text-[#61617a]">Upload : {getAssetUploadDate(asset)}</span>
//                       </div>
//                       {asset.duration && (
//                         <>
//                           <div className="w-0.5 h-0.5 bg-[#4a4459] rounded-full"></div>
//                           <span>Duration : {asset.duration}</span>
//                         </>
//                       )}
//                     </div>
//                   </div>

//                   {/* View Button */}
//                   <Button
//                     variant="outline"
//                       className="rounded-[38px] border-[#d5d7da] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] bg-neutral-50 flex items-center gap-2 px-4 py-2.5"
//                       onClick={(e) => { e.stopPropagation(); handleAssetClick(asset.id); }}
//                   >
//                     <span className="text-[14px] text-[#414651] font-semibold">View</span>
//                     <ArrowUpRight className="w-4 h-4 text-[#1e1e1e]" />
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       </div>
//       ) : (
//         <div className="flex-1 px-6 pb-12 overflow-auto">
//           <Card className="bg-white border border-gray-200">
//             <CardContent className="p-6">
//               <div className="grid grid-cols-7 gap-2 mb-4">
//                 {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((d) => (
//                   <div key={d} className="text-center p-3 bg-white rounded-lg">
//                     <span className="text-sm text-gray-900">{d}</span>
//                   </div>
//                 ))}
//               </div>
//               <div className="grid grid-cols-7 gap-2">
//                 {calendarDays.map((day: { day: number; date: Date; assets: Asset[]; isToday: boolean } | null, idx: number) => (
//                   <div key={idx} className={`min-h-[80px] p-2 rounded-lg border ${day ? 'bg-white border-gray-200' : 'bg-transparent'}`}>
//                     {day && (
//                       <>
//                         <div className={`text-center mb-2 ${day.isToday ? 'font-semibold text-blue-600' : 'text-gray-900'}`}>{day.day}</div>
//                         <div className="space-y-1">
//                           {day.assets.slice(0,3).map((a: Asset) => (
//                             <div key={a.id as number} className="flex items-center gap-1 cursor-pointer" onClick={() => handleAssetClick(a.id)}>
//                               <div className={`w-2 h-2 rounded-full ${
//                                 getAssetTypeKey(a) === 'video' ? 'bg-red-600' :
//                                 getAssetTypeKey(a) === 'image' ? 'bg-green-600' :
//                                 getAssetTypeKey(a) === 'pdf' ? 'bg-blue-600' :
//                                 getAssetTypeKey(a) === 'ppt' ? 'bg-purple-600' :
//                                 getAssetTypeKey(a) === 'excel' ? 'bg-emerald-600' :
//                                 getAssetTypeKey(a) === 'audio' ? 'bg-yellow-500' : 'bg-gray-500'
//                               }`} />
//                               <span className="text-xs text-gray-700 truncate">{getAssetLabel(a)}</span>
//                             </div>
//                           ))}
//                           {day.assets.length > 3 && (
//                             <div className="text-xs text-gray-500">+{day.assets.length - 3} more</div>
//                           )}
//                         </div>
//                       </>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       )}

//       {/* Upload Asset Dialog */}
//       <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
//         <DialogContent className="max-w-[95vw] sm:max-w-lg bg-white mx-4 max-h-[90vh] overflow-y-auto border border-[#cac4d0] rounded-xl">
//           <DialogHeader>
//             <DialogTitle className="text-[14px] sm:text-base font-medium text-black">
//               Upload New Asset
//             </DialogTitle>
//             <DialogDescription>
//               Fill out the form below to upload a new asset to your library.
//             </DialogDescription>
//           </DialogHeader>
//           <div className="px-4 py-3">
//             <div className="space-y-3">

//               {/* Asset Title */}
//               <div className="space-y-0.5">
//                 <Label className="text-sm text-gray-700 mb-1">
//                   Asset Title
//                 </Label>
//                 <Input
//                   placeholder="Enter title"
//                   value={uploadForm.title}
//                   onChange={(e) => setUploadForm(prev => ({ ...prev, title: e.target.value }))}
//                   className="border-gray-300"
//                 />
//               </div>

//               {/* Asset Type and Category */}
//               <div className="flex gap-4">
//                 <div className="flex-1 space-y-0.5">
//                   <Label htmlFor="asset-type" className="block text-sm text-gray-700 mb-1">
//                     Asset Type
//                   </Label>
//                   <Select value={uploadForm.assetType} onValueChange={(value) => setUploadForm(prev => ({ ...prev, assetType: value }))}>
//                     <SelectTrigger id="asset-type" className="border-gray-300">
//                       <SelectValue placeholder="Type" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="video">Video</SelectItem>
//                       <SelectItem value="document">Document</SelectItem>
//                       <SelectItem value="image">Image</SelectItem>
//                       <SelectItem value="presentation">Presentation</SelectItem>
//                       <SelectItem value="magazine">Magazine</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <div className="flex-1 space-y-0.5">
//                   <Label htmlFor="asset-category" className="block text-sm text-gray-700 mb-1">
//                     Category
//                   </Label>
//                   <Select value={uploadForm.category} onValueChange={(value) => setUploadForm(prev => ({ ...prev, category: value }))}>
//                     <SelectTrigger id="asset-category" className="border-gray-300">
//                       <SelectValue placeholder="Category" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="Brand Assets">Brand Assets</SelectItem>
//                       <SelectItem value="Marketing Assets">Marketing Assets</SelectItem>
//                       <SelectItem value="Case Studies">Case Studies</SelectItem>
//                       <SelectItem value="Presentations">Presentations</SelectItem>
//                       <SelectItem value="Training">Training</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>

//               {/* Asset URL */}
//               <div className="space-y-0.5">
//                 <Label className="text-sm text-gray-700 mb-1">
//                   Asset URL (Optional)
//                 </Label>
//                 <Input
//                   placeholder="Enter URL"
//                   value={uploadForm.url}
//                   onChange={(e) => setUploadForm(prev => ({ ...prev, url: e.target.value }))}
//                   className="border-gray-300"
//                 />
//               </div>

//               {/* Description */}
//               <div className="space-y-0.5">
//                 <Label className="text-sm text-gray-700 mb-1">
//                   Description
//                 </Label>
//                 <Textarea
//                   placeholder="Enter description"
//                   value={uploadForm.description}
//                   onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
//                   className="border-gray-300 resize-none"
//                 />
//               </div>

//               {/* Upload Attachment */}
//               <div className="space-y-0.5">
//                 <Label className="text-sm text-gray-700 mb-1">
//                   Upload Attachment
//                 </Label>
//                 <div className="bg-[#f9f9f9] border border-[#cfd3d4] rounded-lg p-4">
//                   <div className="flex items-center gap-6">
//                     <Paperclip className="w-6 h-6 text-black" />
//                     <div className="flex-1">
//                       <span className="text-sm text-gray-700">Related Attachments</span>
//                     </div>
//                     <div className="bg-[#898989] rounded-[130px] overflow-hidden">
//                       <label className="flex items-center gap-2 px-4 py-2.5 cursor-pointer">
//                         <Upload className="w-5 h-5 text-white" />
//                         <span className="text-sm font-semibold text-white">Upload</span>
//                         <input
//                           type="file"
//                           multiple
//                           onChange={handleFileUpload}
//                           className="hidden"
//                           accept="image/*,video/*,.pdf,.doc,.docx,.ppt,.pptx"
//                         />
//                       </label>
//                     </div>
//                   </div>

//                   {/* Show uploaded files */}
//                   {uploadForm.attachments.length > 0 && (
//                     <div className="mt-3 space-y-2">
//                       {uploadForm.attachments.map((file, index) => (
//                         <div key={index} className="flex items-center justify-between bg-white p-2 rounded">
//                           <span className="text-sm text-gray-700">{file.name}</span>
//                           <Button
//                             variant="ghost"
//                             size="sm"
//                             onClick={() => removeAttachment(index)}
//                             className="text-red-600 hover:text-red-800"
//                           >
//                             Remove
//                           </Button>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Tags */}
//               <div className="space-y-0.5">
//                 <Label className="text-sm text-gray-700 mb-1">
//                   Tags (Comma separated)
//                 </Label>
//                 <Input
//                   placeholder="eg, town hall, product launch"
//                   value={uploadForm.tags}
//                   onChange={(e) => setUploadForm(prev => ({ ...prev, tags: e.target.value }))}
//                   className="border-gray-300"
//                 />
//               </div>

//               {/* Action Buttons */}
//               <div className="flex justify-end gap-3 pt-2">
//                 <Button
//                   variant="outline"
//                   onClick={() => setIsUploadDialogOpen(false)}
//                   className="rounded-[44px] border-[#bdbdbd] border-[0.8px] px-4 py-2"
//                 >
//                   Cancel
//                 </Button>
//                 <Button
//                   onClick={handleUploadSubmit}
//                   className="bg-[#1a2c47] text-white rounded-[44px] px-4 py-2 hover:bg-[#2a3c57]"
//                 >
//                   Upload
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </DialogContent>
//       </Dialog>

//       {/* Asset Detail Dialog */}
//       <Dialog open={isAssetDialogOpen} onOpenChange={setIsAssetDialogOpen}>
//         <DialogContent className="max-w-[95vw] sm:max-w-2xl bg-white mx-4 max-h-[90vh] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle>{selectedAssetId ? getAssetLabel((allAssets.find((a: Asset) => a.id === selectedAssetId) as Asset)) : 'Asset'}</DialogTitle>
//             <DialogDescription>
//               View and manage asset information
//             </DialogDescription>
//           </DialogHeader>

//           {selectedAssetId && (() => {
//             const asset = allAssets.find((a: Asset) => a.id === selectedAssetId);
//             if (!asset) return null;

//             return (
//               <div className="space-y-6">
//                 <div className="flex items-start gap-4">
//                   <div className="flex-1">
//                     <h3 className="text-lg font-semibold text-black mb-2">{asset.title}</h3>
//                     <p className="text-sm text-gray-600 mb-4">{asset.description}</p>

//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
//                       <div>
//                         <span className="text-[12px] font-medium text-gray-700">Type:</span>
//                         <span className="ml-2 text-[12px]">{asset.type}</span>
//                       </div>
//                       <div>
//                         <span className="text-[12px] font-medium text-gray-700">Category:</span>
//                         <span className="ml-2 text-[12px]">{asset.category}</span>
//                       </div>
//                       <div>
//                         <span className="text-[12px] font-medium text-gray-700">Uploaded by:</span>
//                         <span className="ml-2 text-[12px]">{asset.uploadedBy}</span>
//                       </div>
//                       <div>
//                         <span className="text-[12px] font-medium text-gray-700">Upload date:</span>
//                         <span className="ml-2 text-[12px]">{asset.uploadDate}</span>
//                       </div>
//                       {asset.duration && (
//                         <div>
//                           <span className="text-[12px] font-medium text-gray-700">Duration:</span>
//                           <span className="ml-2 text-[12px]">{asset.duration}</span>
//                         </div>
//                       )}
//                       <div>
//                         <span className="text-[12px] font-medium text-gray-700">File size:</span>
//                         <span className="ml-2 text-[12px]">{asset.fileSize ?? asset.size ?? 'N/A'}</span>
//                       </div>
//                     </div>

//                     {asset.url && (
//                       <div className="mt-4">
//                         <span className="text-[12px] font-medium text-gray-700">URL:</span>
//                         <a href={asset.url} target="_blank" rel="noopener noreferrer" className="ml-2 text-[12px] text-blue-600 hover:underline">
//                           {asset.url}
//                         </a>
//                       </div>
//                     )}

//                     {!!(asset.tags && asset.tags.length > 0) && (
//                       <div className="mt-4">
//                         <span className="text-[12px] font-medium text-gray-700">Tags:</span>
//                         <div className="flex flex-wrap gap-1.5 mt-1">
//                           {(asset.tags || []).map((tag: string, index: number) => (
//                             <Badge key={index} variant="outline" className="text-[10px] sm:text-xs border-gray-400">
//                               {tag}
//                             </Badge>
//                           ))}
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 <div className="flex justify-end gap-2 pt-4 border-t">
//                   <Button variant="outline" onClick={() => setIsAssetDialogOpen(false)}>
//                     Close
//                   </Button>
//                   <Button className="bg-[#1a2c47] text-white hover:bg-[#2a3c57]" onClick={() => import('sonner').then(({ toast }) => toast.success(`${getAssetLabel(asset)} downloaded.`))}>
//                     Download
//                   </Button>
//                 </div>
//               </div>
//             );
//           })()}
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

const AssetsManagementPage = () => {
  return (
    <div>
      Asset management
    </div>
  )
}

export default AssetsManagementPage
