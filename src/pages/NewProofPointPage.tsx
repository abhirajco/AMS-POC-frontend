// import { useState } from 'react';
// import { Button } from "../components/ui/button";
// import { Input } from "../components/ui/input";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
// import { Card, CardContent } from "../components/ui/card";
// import { Textarea } from "../components/ui/textarea";
// import { Label } from "../components/ui/label";
// import { Badge } from "../components/ui/badge";
// import { ArrowLeft, Save, Send, Plus, X, FileText, Award, TrendingUp, Target } from 'lucide-react';
// import { HeaderSection } from "../components/common/HeaderSection";

// interface NewProofPointPageProps {
//   setIsSidebarOpen: (open: boolean) => void;
//   setCurrentPage: (page: string) => void;
// }

// export const NewProofPointPage = ({
//   setIsSidebarOpen,
//   setCurrentPage
// }: NewProofPointPageProps) => {
//   // Form state
//   const [formData, setFormData] = useState({
//     title: '',
//     type: '',
//     client: '',
//     industry: '',
//     source: '',
//     content: '',
//     customer: '',
//     remarkedBy: '',
//     category: '',
//     clientRepresentative: '',
//     priority: '',
//     tags: '',
//     description: '',
//     attachments: '',
//     verificationStatus: 'pending'
//   });

//   const [currentTags, setCurrentTags] = useState<string[]>([]);
//   const [newTag, setNewTag] = useState('');

//   const handleInputChange = (field: string, value: string) => {
//     setFormData(prev => ({
//       ...prev,
//       [field]: value
//     }));
//   };

//   const handleAddTag = () => {
//     if (newTag.trim() && !currentTags.includes(newTag.trim())) {
//       setCurrentTags(prev => [...prev, newTag.trim()]);
//       setNewTag('');
//     }
//   };

//   const handleRemoveTag = (tagToRemove: string) => {
//     setCurrentTags(prev => prev.filter(tag => tag !== tagToRemove));
//   };

//   const handleSaveAsDraft = () => {
//     console.log('Saving proof point as draft:', { ...formData, tags: currentTags });
//     import('sonner').then(({ toast }) => toast.success('Proof point saved as draft.'));
//     setCurrentPage('proof-points');
//   };

//   const handleSubmitForApproval = () => {
//     console.log('Submitting proof point for approval:', { ...formData, tags: currentTags });
//     import('sonner').then(({ toast }) => toast.success('Submitted for approval.'));
//     setCurrentPage('proof-points');
//   };

//   const proofPointTypes = [
//     { value: 'testimonial', label: 'Testimonial', icon: FileText, description: 'Client feedback or quotes' },
//     { value: 'data', label: 'Data Point', icon: TrendingUp, description: 'Metrics and statistics' },
//     { value: 'certification', label: 'Certification', icon: Award, description: 'Awards and certifications' },
//     { value: 'case-study', label: 'Case Study', icon: Target, description: 'Success stories and outcomes' }
//   ];

//   return (
//     <div className="bg-neutral-50 flex flex-col h-full">
//       <HeaderSection setIsSidebarOpen={setIsSidebarOpen} />

//       <div className="px-4 sm:px-6 py-4 sm:py-6">
//         <div className="flex items-center gap-4 sm:gap-6 mb-4 sm:mb-6">
//           <Button
//             variant="ghost"
//             size="icon"
//             onClick={() => setCurrentPage('proof-points')}
//             className="hover:bg-gray-100 flex-shrink-0"
//           >
//             <ArrowLeft className="w-4 h-4" />
//           </Button>
//           <div>
//             <h1 className="text-[20px] sm:text-[24px] font-medium text-black">Create New Proof Point</h1>
//             <p className="text-[12px] sm:text-[14px] text-gray-600">Add a new proof point to showcase your success</p>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 max-w-7xl">
//           {/* Main Form */}
//           <div className="lg:col-span-2 space-y-4 sm:space-y-5">
//             {/* Basic Information */}
//             <Card className="bg-white border border-gray-300">
//               <CardContent className="p-3 sm:p-4">
//                 <h3 className="font-medium text-[13px] sm:text-[14px] text-black mb-3 sm:mb-4">Basic Information</h3>

//                 <div className="space-y-3 sm:space-y-4">
//                   <div>
//                     <Label className="text-[13px] sm:text-[14px] text-gray-600 font-normal mb-1 block">Proof Point Title *</Label>
//                     <Input
//                       placeholder="Enter a descriptive title for your proof point..."
//                       value={formData.title}
//                       onChange={(e) => handleInputChange('title', e.target.value)}
//                       className="border-gray-300 text-sm"
//                     />
//                   </div>

//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
//                     <div>
//                       <Label className="text-[13px] sm:text-[14px] text-gray-600 font-normal mb-1 block">Type *</Label>
//                       <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
//                         <SelectTrigger className="border-gray-300 text-sm">
//                           <SelectValue placeholder="Select proof point type" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           {proofPointTypes.map((type) => (
//                             <SelectItem key={type.value} value={type.value}>
//                               <div className="flex items-center gap-2">
//                                 <type.icon className="w-4 h-4" />
//                                 <span>{type.label}</span>
//                               </div>
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                     </div>
//                     <div>
//                       <Label className="text-[13px] sm:text-[14px] text-gray-600 font-normal mb-1 block">Priority</Label>
//                       <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
//                         <SelectTrigger className="border-gray-300 text-sm">
//                           <SelectValue placeholder="Select priority" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           <SelectItem value="high">High</SelectItem>
//                           <SelectItem value="medium">Medium</SelectItem>
//                           <SelectItem value="low">Low</SelectItem>
//                         </SelectContent>
//                       </Select>
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
//                     <div>
//                       <Label className="text-[13px] sm:text-[14px] text-gray-600 font-normal mb-1 block">Client/Company *</Label>
//                       <Input
//                         placeholder="Enter client or company name"
//                         value={formData.client}
//                         onChange={(e) => handleInputChange('client', e.target.value)}
//                         className="border-gray-300 text-sm"
//                       />
//                     </div>
//                     <div>
//                       <Label className="text-[13px] sm:text-[14px] text-gray-600 font-normal mb-1 block">Industry</Label>
//                       <Select value={formData.industry} onValueChange={(value) => handleInputChange('industry', value)}>
//                         <SelectTrigger className="border-gray-300 text-sm">
//                           <SelectValue placeholder="Select industry" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           <SelectItem value="technology">Technology</SelectItem>
//                           <SelectItem value="finance">Finance</SelectItem>
//                           <SelectItem value="healthcare">Healthcare</SelectItem>
//                           <SelectItem value="insurance">Insurance</SelectItem>
//                           <SelectItem value="manufacturing">Manufacturing</SelectItem>
//                           <SelectItem value="retail">Retail</SelectItem>
//                           <SelectItem value="education">Education</SelectItem>
//                           <SelectItem value="other">Other</SelectItem>
//                         </SelectContent>
//                       </Select>
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Content Details */}
//             <Card className="bg-white border border-gray-300">
//               <CardContent className="p-3 sm:p-4">
//                 <h3 className="font-medium text-[13px] sm:text-[14px] text-black mb-3 sm:mb-4">Content Details</h3>

//                 <div className="space-y-3 sm:space-y-4">
//                   <div>
//                     <Label className="text-[13px] sm:text-[14px] text-gray-600 font-normal mb-1 block">Proof Point Content *</Label>
//                     <Textarea
//                       placeholder="Enter the main content of your proof point. For testimonials, include the full quote. For data points, include the specific metrics and context..."
//                       value={formData.content}
//                       onChange={(e) => handleInputChange('content', e.target.value)}
//                       className="border-gray-300 text-sm min-h-[120px]"
//                     />
//                   </div>

//                   <div>
//                     <Label className="text-[13px] sm:text-[14px] text-gray-600 font-normal mb-1 block">Description/Context</Label>
//                     <Textarea
//                       placeholder="Provide additional context, background information, or explanation..."
//                       value={formData.description}
//                       onChange={(e) => handleInputChange('description', e.target.value)}
//                       className="border-gray-300 text-sm min-h-[80px]"
//                     />
//                   </div>

//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
//                     <div>
//                       <Label className="text-[13px] sm:text-[14px] text-gray-600 font-normal mb-1 block">Source</Label>
//                       <Input
//                         placeholder="e.g., Q2 2025 Client Success Report"
//                         value={formData.source}
//                         onChange={(e) => handleInputChange('source', e.target.value)}
//                         className="border-gray-300 text-sm"
//                       />
//                     </div>
//                     <div>
//                       <Label className="text-[13px] sm:text-[14px] text-gray-600 font-normal mb-1 block">Category</Label>
//                       <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
//                         <SelectTrigger className="border-gray-300 text-sm">
//                           <SelectValue placeholder="Select category" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           <SelectItem value="quality-assurance">Quality Assurance</SelectItem>
//                           <SelectItem value="performance">Performance</SelectItem>
//                           <SelectItem value="cost-reduction">Cost Reduction</SelectItem>
//                           <SelectItem value="innovation">Innovation</SelectItem>
//                           <SelectItem value="customer-satisfaction">Customer Satisfaction</SelectItem>
//                           <SelectItem value="compliance">Compliance</SelectItem>
//                           <SelectItem value="partnership">Partnership</SelectItem>
//                         </SelectContent>
//                       </Select>
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Contact Information */}
//             <Card className="bg-white border border-gray-300">
//               <CardContent className="p-3 sm:p-4">
//                 <h3 className="font-medium text-[13px] sm:text-[14px] text-black mb-3 sm:mb-4">Contact Information</h3>

//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
//                   <div>
//                     <Label className="text-[13px] sm:text-[14px] text-gray-600 font-normal mb-1 block">Customer Contact</Label>
//                     <Input
//                       placeholder="Primary customer contact"
//                       value={formData.customer}
//                       onChange={(e) => handleInputChange('customer', e.target.value)}
//                       className="border-gray-300 text-sm"
//                     />
//                   </div>
//                   <div>
//                     <Label className="text-[13px] sm:text-[14px] text-gray-600 font-normal mb-1 block">Remarked By</Label>
//                     <Input
//                       placeholder="Person who provided the feedback"
//                       value={formData.remarkedBy}
//                       onChange={(e) => handleInputChange('remarkedBy', e.target.value)}
//                       className="border-gray-300 text-sm"
//                     />
//                   </div>
//                   <div>
//                     <Label className="text-[13px] sm:text-[14px] text-gray-600 font-normal mb-1 block">Client Representative</Label>
//                     <Input
//                       placeholder="Internal client representative"
//                       value={formData.clientRepresentative}
//                       onChange={(e) => handleInputChange('clientRepresentative', e.target.value)}
//                       className="border-gray-300 text-sm"
//                     />
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Tags and Attachments */}
//             <Card className="bg-white border border-gray-300">
//               <CardContent className="p-3 sm:p-4">
//                 <h3 className="font-medium text-[13px] sm:text-[14px] text-black mb-3 sm:mb-4">Tags and Attachments</h3>

//                 <div className="space-y-3 sm:space-y-4">
//                   <div>
//                     <Label className="text-[13px] sm:text-[14px] text-gray-600 font-normal mb-1 block">Tags</Label>
//                     <div className="flex gap-2 mb-2">
//                       <Input
//                         placeholder="Add a tag and press Enter"
//                         value={newTag}
//                         onChange={(e) => setNewTag(e.target.value)}
//                         onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
//                         className="border-gray-300 text-sm"
//                       />
//                       <Button
//                         type="button"
//                         onClick={handleAddTag}
//                         className="bg-[#1a2c47] text-white hover:bg-[#2a3c57] text-sm"
//                       >
//                         <Plus className="w-4 h-4" />
//                       </Button>
//                     </div>
//                     <div className="flex flex-wrap gap-1.5">
//                       {currentTags.map((tag, index) => (
//                         <Badge key={index} variant="outline" className="text-xs border-gray-400 pr-1">
//                           {tag}
//                           <Button
//                             type="button"
//                             variant="ghost"
//                             size="sm"
//                             className="h-auto p-0 ml-1 hover:bg-transparent"
//                             onClick={() => handleRemoveTag(tag)}
//                           >
//                             <X className="w-3 h-3" />
//                           </Button>
//                         </Badge>
//                       ))}
//                     </div>
//                   </div>

//                   <div>
//                     <Label className="text-[13px] sm:text-[14px] text-gray-600 font-normal mb-1 block">Supporting Documents/Links</Label>
//                     <Textarea
//                       placeholder="Add links to supporting documents, reports, or other relevant materials..."
//                       value={formData.attachments}
//                       onChange={(e) => handleInputChange('attachments', e.target.value)}
//                       className="border-gray-300 text-sm min-h-[60px]"
//                     />
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Action Buttons */}
//             <div className="flex flex-col sm:flex-row gap-2 pt-4">
//               <Button
//                 variant="outline"
//                 className="border-gray-300 text-sm"
//                 onClick={handleSaveAsDraft}
//               >
//                 <Save className="w-4 h-4 mr-1 sm:mr-2" />
//                 Save as Draft
//               </Button>
//               <Button
//                 className="bg-[#1a2c47] text-white hover:bg-[#2a3c57] text-sm"
//                 onClick={handleSubmitForApproval}
//                 disabled={!formData.title || !formData.type || !formData.client || !formData.content}
//               >
//                 <Send className="w-4 h-4 mr-1 sm:mr-2" />
//                 Submit for Approval
//               </Button>
//             </div>
//           </div>

//           {/* Sidebar with Guidelines and Tips */}
//           <div className="space-y-4 sm:space-y-5">
//             {/* Proof Point Types Guide */}
//             <Card className="bg-white border border-gray-300">
//               <CardContent className="p-3 sm:p-4">
//                 <h3 className="font-medium text-[13px] sm:text-[14px] text-black mb-3 sm:mb-4">Proof Point Types</h3>
//                 <div className="space-y-3">
//                   {proofPointTypes.map((type) => (
//                     <div
//                       key={type.value}
//                       className={`p-2 sm:p-3 border rounded cursor-pointer transition-colors ${
//                         formData.type === type.value
//                           ? 'border-[#1a2c47] bg-blue-50'
//                           : 'border-gray-200 hover:bg-gray-50'
//                       }`}
//                       onClick={() => handleInputChange('type', type.value)}
//                     >
//                       <div className="flex items-center gap-2 mb-1">
//                         <type.icon className="w-4 h-4 text-[#1a2c47]" />
//                         <span className="font-medium text-[11px] sm:text-[12px] text-black">{type.label}</span>
//                       </div>
//                       <p className="text-[10px] sm:text-[11px] text-gray-600">{type.description}</p>
//                     </div>
//                   ))}
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Guidelines */}
//             <Card className="bg-white border border-gray-300">
//               <CardContent className="p-3 sm:p-4">
//                 <h3 className="font-medium text-[13px] sm:text-[14px] text-black mb-3 sm:mb-4">Best Practices</h3>
//                 <div className="space-y-2 sm:space-y-3">
//                   <div className="text-[11px] sm:text-[12px] text-gray-600">
//                     <strong className="text-black">Testimonials:</strong> Include exact quotes with proper attribution
//                   </div>
//                   <div className="text-[11px] sm:text-[12px] text-gray-600">
//                     <strong className="text-black">Data Points:</strong> Provide specific metrics with context and timeframes
//                   </div>
//                   <div className="text-[11px] sm:text-[12px] text-gray-600">
//                     <strong className="text-black">Certifications:</strong> Include certification body and validity period
//                   </div>
//                   <div className="text-[11px] sm:text-[12px] text-gray-600">
//                     <strong className="text-black">Verification:</strong> Ensure all information can be verified with supporting documentation
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Recent Proof Points */}
//             <Card className="bg-white border border-gray-300">
//               <CardContent className="p-3 sm:p-4">
//                 <h3 className="font-medium text-[13px] sm:text-[14px] text-black mb-3 sm:mb-4">Recent Proof Points</h3>
//                 <div className="space-y-2 sm:space-y-3">
//                   {[
//                     { title: "CMMI Level 5 Achievement", type: "Certification", status: "Approved" },
//                     { title: "80% Performance Improvement", type: "Data", status: "Pending" },
//                     { title: "Client Partnership Success", type: "Testimonial", status: "Approved" }
//                   ].map((item, index) => (
//                     <div key={index} className="space-y-1">
//                       <div className="text-[11px] sm:text-[12px] font-medium text-black line-clamp-1">
//                         {item.title}
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <Badge variant="outline" className="text-[9px] sm:text-[10px] border-gray-400">
//                           {item.type}
//                         </Badge>
//                         <span className="text-[9px] sm:text-[10px] text-gray-600">{item.status}</span>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

const NewProofPointPage = () => {
  return (
    <div>
      new proof
    </div>
  )
}

export default NewProofPointPage
