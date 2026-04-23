// import { useState } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
// import { Button } from "../components/ui/button";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
// import { Badge } from "../components/ui/badge";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
// import { TrendingUp, TrendingDown, Users, Eye, Clock, BarChart3, Download, Target, Heart, Share2, MessageSquare, Calendar, FileText, Zap, Star } from 'lucide-react';
// import { HeaderSection } from "../components/common/HeaderSection";
// import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// interface AnalyticsPageProps {
//   setIsSidebarOpen: (open: boolean) => void;
// }

// export const AnalyticsPage = ({
//   setIsSidebarOpen
// }: AnalyticsPageProps) => {
//   const [timeRange, setTimeRange] = useState("30days");
//   const [sourceTab, setSourceTab] = useState("linkedin");
//   const [linkedInSubTab, setLinkedInSubTab] = useState("page");
//   // Local per-section filters
//   const [liPageRange, setLiPageRange] = useState("30days");
//   const [liPostRange, setLiPostRange] = useState("30days");
//   const [liRegion, setLiRegion] = useState("all");
//   const [pardotRange, setPardotRange] = useState("30days");
//   const [pardotRegion, setPardotRegion] = useState("all");
//   const [gaRange, setGaRange] = useState("30days");
//   const [gaRegion, setGaRegion] = useState("all");
//   const [eventRange, setEventRange] = useState("30days");
//   const [eventRegion, setEventRegion] = useState("all");

//   // Mock analytics data
//   const analyticsData = {
//     overview: {
//       totalViews: "45,231",
//       viewsChange: "+12.5%",
//       uniqueVisitors: "12,450",
//       visitorsChange: "+8.3%",
//       engagementRate: "67.8%",
//       engagementChange: "+4.2%",
//       avgSessionTime: "3m 24s",
//       sessionChange: "-2.1%"
//     },
//     contentMetrics: {
//       totalContent: "156",
//       contentChange: "+23",
//       publishedThisMonth: "28",
//       publishedChange: "+15%",
//       avgTimeToPublish: "4.2 days",
//       timeChange: "-1.3 days",
//       conversionRate: "8.7%",
//       conversionChange: "+2.1%"
//     },
//     chartData: {
//       trafficTrend: [
//         { date: 'Jan', views: 3400, visitors: 1200, engagement: 65 },
//         { date: 'Feb', views: 3200, visitors: 1150, engagement: 59 },
//         { date: 'Mar', views: 3800, visitors: 1300, engagement: 72 },
//         { date: 'Apr', views: 4200, visitors: 1450, engagement: 68 },
//         { date: 'May', views: 3900, visitors: 1380, engagement: 75 },
//         { date: 'Jun', views: 4500, visitors: 1520, engagement: 78 },
//         { date: 'Jul', views: 4800, visitors: 1650, engagement: 82 }
//       ],
//       contentTypes: [
//         { name: 'Blog Posts', value: 45, color: '#3b82f6' },
//         { name: 'Case Studies', value: 30, color: '#10b981' },
//         { name: 'Whitepapers', value: 15, color: '#f59e0b' },
//         { name: 'Social Media', value: 10, color: '#ef4444' }
//       ],
//       topChannels: [
//         { channel: 'Organic Search', visitors: 4200, percentage: 35 },
//         { channel: 'Direct', visitors: 3100, percentage: 26 },
//         { channel: 'Social Media', visitors: 2400, percentage: 20 },
//         { channel: 'Email', visitors: 1500, percentage: 12 },
//         { channel: 'Referral', visitors: 800, percentage: 7 }
//       ]
//     },
//     contentPerformance: [
//       {
//         title: "Cost-Effectively Delivering a Mission-Critical Application",
//         type: "Case Study",
//         views: 3420,
//         engagement: "89%",
//         conversions: 45,
//         status: "trending-up",
//         publishDate: "2024-07-15",
//         author: "Maurvee Sharma"
//       },
//       {
//         title: "The Future of AI in Marketing: Trends for 2025",
//         type: "Blog",
//         views: 2850,
//         engagement: "76%",
//         conversions: 32,
//         status: "trending-up",
//         publishDate: "2024-07-12",
//         author: "Piyush Singh"
//       },
//       {
//         title: "Leveraging RPA For Document Filing",
//         type: "Social",
//         views: 1920,
//         engagement: "84%",
//         conversions: 18,
//         status: "stable",
//         publishDate: "2024-07-10",
//         author: "Sujith Kumar"
//       },
//       {
//         title: "Pardot: The GenNext AI driven B2B Marketing Tool",
//         type: "Whitepaper",
//         views: 1650,
//         engagement: "92%",
//         conversions: 67,
//         status: "trending-up",
//         publishDate: "2024-07-08",
//         author: "Maurvee Sharma"
//       }
//     ],
//     topPerformers: [
//       { metric: "Most Viewed", content: "AI Marketing Trends Blog", value: "3,420 views" },
//       { metric: "Highest Engagement", content: "B2B Marketing Whitepaper", value: "92% engagement" },
//       { metric: "Best Conversion", content: "Case Study - Insurance", value: "67 conversions" },
//       { metric: "Longest Session", content: "Product Demo Video", value: "5m 12s avg." }
//     ],
//     recentActivity: [
//       { time: "2 hours ago", action: "Blog published", content: "AI Marketing Trends", user: "Maurvee Sharma" },
//       { time: "4 hours ago", action: "Content approved", content: "Q3 Campaign Case Study", user: "Piyush Singh" },
//       { time: "6 hours ago", action: "Asset uploaded", content: "Brand Guidelines.pdf", user: "Sujith Kumar" },
//       { time: "1 day ago", action: "Proof point verified", content: "CMMI Level 5 Certification", user: "System" }
//     ],
//     aiInsights: [
//       {
//         type: "optimization",
//         title: "Content Gap Identified",
//         description: "Your audience shows high engagement with AI-related content. Consider creating more AI-focused materials.",
//         confidence: 87
//       },
//       {
//         type: "timing",
//         title: "Optimal Publishing Time",
//         description: "Tuesday mornings (9-11 AM) show 23% higher engagement rates for your content.",
//         confidence: 92
//       },
//       {
//         type: "performance",
//         title: "Case Studies Trending",
//         description: "Case studies have 40% higher conversion rates than other content types this month.",
//         confidence: 79
//       }
//     ]
//   };

//   // helpers can be added when wiring real APIs

//   // Additional datasets for new analytics tabs (base, unfiltered)
//   const liPageTrendBase = [
//     { m: 'Jan', followers: 1200, views: 3400, unique: 1200 },
//     { m: 'Feb', followers: 1320, views: 3200, unique: 1150 },
//     { m: 'Mar', followers: 1490, views: 3800, unique: 1300 },
//     { m: 'Apr', followers: 1620, views: 4200, unique: 1450 },
//     { m: 'May', followers: 1790, views: 3900, unique: 1380 },
//     { m: 'Jun', followers: 1940, views: 4500, unique: 1520 },
//     { m: 'Jul', followers: 2100, views: 4800, unique: 1650 }
//   ];
//   const liDemographicsBase = [
//     { name: 'IT', value: 35, color: '#3b82f6' },
//     { name: 'Finance', value: 22, color: '#10b981' },
//     { name: 'Healthcare', value: 18, color: '#f59e0b' },
//     { name: 'Manufacturing', value: 15, color: '#ef4444' },
//     { name: 'Other', value: 10, color: '#8b5cf6' }
//   ];
//   const liPostMetricsBase = [
//     { post: 'Launch', impressions: 5400, reach: 4100, likes: 120, comments: 35, shares: 18, url: 'https://www.linkedin.com/feed/update/urn:li:activity:launch' },
//     { post: 'Webinar', impressions: 4300, reach: 3600, likes: 160, comments: 28, shares: 24, url: 'https://www.linkedin.com/feed/update/urn:li:activity:webinar' },
//     { post: 'Case Study', impressions: 6200, reach: 4700, likes: 210, comments: 40, shares: 32, url: 'https://www.linkedin.com/feed/update/urn:li:activity:casestudy' },
//   ];
//   const liCTRTable = [
//     { label: 'Company Page', ctr: 2.1, change: 0.4 },
//     { label: 'Ads', ctr: 1.6, change: -0.2 },
//     { label: 'Posts', ctr: 2.9, change: 0.6 }
//   ];

//   // Lightweight mock transformation for range and region filters
//   const rangeToCount: Record<string, number> = { '7days': 1, '30days': 3, '90days': 6, '1year': 7, 'custom': 7 };
//   const regionFactor: Record<string, number> = { all: 1, uk: 0.22, usa: 0.38, latam: 0.2, india: 0.2 };

//   const sliceByRange = (arr: any[], range: string) => {
//     const n = rangeToCount[range] ?? 7;
//     return arr.slice(-n);
//   };
//   const scaleNumber = (n: number, factor: number) => Math.round(n * factor);
//   const applyRegion = (arr: { [k: string]: any }[], keys: string[], factor: number) =>
//     arr.map((row) => {
//       const scaled: any = { ...row };
//       keys.forEach((k) => {
//         if (typeof row[k] === 'number') scaled[k] = scaleNumber(row[k], factor);
//       });
//       return scaled;
//     });

//   // Compute filtered datasets for LinkedIn Page Level
//   const liPageTrend = applyRegion(
//     sliceByRange(liPageTrendBase, liPageRange),
//     ['followers', 'views', 'unique'],
//     regionFactor[liRegion] ?? 1
//   );
//   const liDemographics = applyRegion(liDemographicsBase, ['value'], regionFactor[liRegion] ?? 1).map((d) => ({ ...d, value: Math.max(d.value, 1) }));
//   const liPostMetrics = applyRegion(sliceByRange(liPostMetricsBase, liPostRange), ['impressions', 'reach', 'likes', 'comments', 'shares'], regionFactor[liRegion] ?? 1);

//   // Pardot derived metrics/content based on filters
//   const rangeScale = (r: string) => (rangeToCount[r] ?? 7) / 7;
//   const applyCountScale = (nStr: string, r: string, reg: string) => {
//     const n = Number(String(nStr).replace(/[^0-9.]/g, '')) || 0;
//     const scaled = Math.max(1, Math.round(n * (regionFactor[reg] ?? 1) * rangeScale(r)));
//     return scaled.toLocaleString();
//   };
//   const pardotMetrics = {
//     totalContent: applyCountScale(analyticsData.contentMetrics.totalContent, pardotRange, pardotRegion),
//     publishedThisMonth: applyCountScale(analyticsData.contentMetrics.publishedThisMonth, pardotRange, pardotRegion),
//     // leave other deltas/percentages as-is for simplicity
//     contentChange: analyticsData.contentMetrics.contentChange,
//     publishedChange: analyticsData.contentMetrics.publishedChange,
//     avgTimeToPublish: analyticsData.contentMetrics.avgTimeToPublish,
//     timeChange: analyticsData.contentMetrics.timeChange,
//     conversionRate: analyticsData.contentMetrics.conversionRate,
//     conversionChange: analyticsData.contentMetrics.conversionChange
//   };
//   const pardotContentPerformance = applyRegion(
//     sliceByRange(analyticsData.contentPerformance, pardotRange),
//     ['views', 'conversions'],
//     regionFactor[pardotRegion] ?? 1
//   );

//   // Google Analytics derived dataset
//   const gaTrend = applyRegion(
//     sliceByRange(analyticsData.chartData.trafficTrend, gaRange),
//     ['engagement', 'views', 'visitors'],
//     regionFactor[gaRegion] ?? 1
//   );

//   // Event-based derived insights (scale confidence, slice by range)
//   const eventsInsights = applyRegion(
//     sliceByRange(analyticsData.aiInsights, eventRange),
//     ['confidence'],
//     Math.min(1, regionFactor[eventRegion] ?? 1)
//   ).map((x) => ({ ...x, confidence: Math.max(1, Math.min(100, x.confidence)) }));

//   return (
//     <div className="bg-neutral-50 flex flex-col h-full">
//       <HeaderSection setIsSidebarOpen={setIsSidebarOpen} />

//       {/* Page Header */}
//       <div className="px-4 sm:px-6 py-4 sm:py-6 bg-white border-b border-gray-200">
//         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
//           <div>
//             <h1 className="text-[20px] sm:text-[24px] lg:text-[28px] text-black">Analytics Dashboard</h1>
//             <p className="text-[12px] sm:text-[14px] text-gray-600 mt-1">Track performance and insights across all your marketing content</p>
//           </div>
//           <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
//             <Select value={timeRange} onValueChange={setTimeRange}>
//               <SelectTrigger className="w-36 rounded-full border-gray-300 text-sm">
//                 <SelectValue />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="7days">Last 7 Days</SelectItem>
//                 <SelectItem value="30days">Last 30 Days</SelectItem>
//                 <SelectItem value="90days">Last 90 Days</SelectItem>
//                 <SelectItem value="1year">Last Year</SelectItem>
//               </SelectContent>
//             </Select>
//             <Button className="bg-[#1a2c47] text-white rounded-full px-4 py-2 hover:bg-[#2a3c57] text-sm whitespace-nowrap" onClick={() => import('sonner').then(({ toast }) => toast.success('Selected Analytics has been downloaded'))}>
//               <Download className="w-4 h-4 mr-2" />
//               Export Report
//             </Button>
//           </div>
//         </div>
//       </div>

//       <div className="flex-1 overflow-auto">
//         <div className="px-4 sm:px-6 py-4 sm:py-6">
//           <Tabs value={sourceTab} onValueChange={setSourceTab} className="w-full">
//             <TabsList className="grid w-full grid-cols-4 mb-6">
//               <TabsTrigger value="linkedin">LinkedIn</TabsTrigger>
//               <TabsTrigger value="pardot">Pardot</TabsTrigger>
//               <TabsTrigger value="google">Google Analytics</TabsTrigger>
//               <TabsTrigger value="events">Event-Based</TabsTrigger>
//             </TabsList>

//             <TabsContent value="linkedin" className="space-y-6">
//               <Tabs value={linkedInSubTab} onValueChange={setLinkedInSubTab}>
//                 <TabsList className="grid grid-cols-2 w-full mb-4">
//                   <TabsTrigger value="page">Page-Level</TabsTrigger>
//                   <TabsTrigger value="post">Post-Level</TabsTrigger>
//                 </TabsList>
//                 <TabsContent value="page" className="space-y-6">
//                   <div className="flex items-center justify-end gap-2">
//                     <Select value={liPageRange} onValueChange={setLiPageRange}>
//                       <SelectTrigger className="w-36 rounded-full border-gray-300 text-sm"><SelectValue placeholder="Last 30 Days"/></SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="7days">Last 7 Days</SelectItem>
//                         <SelectItem value="30days">Last 30 Days</SelectItem>
//                         <SelectItem value="custom">Custom</SelectItem>
//                       </SelectContent>
//                     </Select>
//                     <Select value={liRegion} onValueChange={setLiRegion}>
//                       <SelectTrigger className="w-40 rounded-full border-gray-300 text-sm"><SelectValue placeholder="All Regions"/></SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="all">All Regions</SelectItem>
//                         <SelectItem value="uk">UK</SelectItem>
//                         <SelectItem value="usa">USA</SelectItem>
//                         <SelectItem value="latam">Latin America</SelectItem>
//                         <SelectItem value="india">India</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>
//               {/* Overview Metrics */}
//               <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
//                 <Card className="bg-white border border-gray-200">
//                   <CardContent className="p-4 sm:p-6">
//                     <div className="flex items-center justify-between mb-2">
//                       <h3 className="text-[14px] sm:text-[16px] text-gray-800">Total Followers</h3>
//                       <Users className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
//                     </div>
//                     <p className="text-[24px] sm:text-[32px] lg:text-[36px] text-gray-900 tracking-tight">
//                       {liPageTrend[liPageTrend.length-1].followers.toLocaleString()}
//                     </p>
//                     <div className="flex items-center gap-1 mt-2">
//                       <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
//                       <span className="text-[11px] sm:text-[12px] text-green-600">
//                         {analyticsData.overview.viewsChange}
//                       </span>
//                       <span className="text-[11px] sm:text-[12px] text-gray-600">vs last month</span>
//                     </div>
//                   </CardContent>
//                 </Card>

//                 <Card className="bg-white border border-gray-200">
//                   <CardContent className="p-4 sm:p-6">
//                     <div className="flex items-center justify-between mb-2">
//                       <h3 className="text-[14px] sm:text-[16px] text-gray-800">Page Views</h3>
//                       <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
//                     </div>
//                     <p className="text-[24px] sm:text-[32px] lg:text-[36px] text-gray-900 tracking-tight">
//                       {liPageTrend[liPageTrend.length-1].views.toLocaleString()}
//                     </p>
//                     <div className="flex items-center gap-1 mt-2">
//                       <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
//                       <span className="text-[11px] sm:text-[12px] text-green-600">
//                         {analyticsData.overview.visitorsChange}
//                       </span>
//                       <span className="text-[11px] sm:text-[12px] text-gray-600">vs last month</span>
//                     </div>
//                   </CardContent>
//                 </Card>

//                 <Card className="bg-white border border-gray-200">
//                   <CardContent className="p-4 sm:p-6">
//                     <div className="flex items-center justify-between mb-2">
//                       <h3 className="text-[14px] sm:text-[16px] text-gray-800">Unique Visitors</h3>
//                       <Users className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
//                     </div>
//                     <p className="text-[24px] sm:text-[32px] lg:text-[36px] text-gray-900 tracking-tight">
//                       {liPageTrend[liPageTrend.length-1].unique.toLocaleString()}
//                     </p>
//                     <div className="flex items-center gap-1 mt-2">
//                       <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
//                       <span className="text-[11px] sm:text-[12px] text-green-600">
//                         {analyticsData.overview.engagementChange}
//                       </span>
//                       <span className="text-[11px] sm:text-[12px] text-gray-600">vs last month</span>
//                     </div>
//                   </CardContent>
//                 </Card>

//                 <Card className="bg-white border border-gray-200">
//                   <CardContent className="p-4 sm:p-6">
//                     <div className="flex items-center justify-between mb-2">
//                       <h3 className="text-[14px] sm:text-[16px] text-gray-800">Avg. Session Time</h3>
//                       <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
//                     </div>
//                     <p className="text-[24px] sm:text-[32px] lg:text-[36px] text-gray-900 tracking-tight">
//                       2.4%
//                     </p>
//                     <div className="flex items-center gap-1 mt-2">
//                       <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4 text-red-600" />
//                       <span className="text-[11px] sm:text-[12px] text-red-600">
//                         {analyticsData.overview.sessionChange}
//                       </span>
//                       <span className="text-[11px] sm:text-[12px] text-gray-600">vs last month</span>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </div>

//               {/* Followers / Views / Visitors */}
//               <Card className="bg-white border border-gray-200">
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2">
//                     <BarChart3 className="w-5 h-5" />
//                     Followers, Views & Visitors
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <ResponsiveContainer width="100%" height={300}>
//                     <LineChart data={liPageTrend}>
//                       <CartesianGrid strokeDasharray="3 3" />
//                       <XAxis dataKey="m" />
//                       <YAxis />
//                       <Tooltip />
//                       <Legend />
//                       <Line type="monotone" dataKey="followers" stroke="#3b82f6" />
//                       <Line type="monotone" dataKey="views" stroke="#10b981" />
//                       <Line type="monotone" dataKey="unique" stroke="#f59e0b" />
//                     </LineChart>
//                   </ResponsiveContainer>
//                 </CardContent>
//               </Card>

//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                 {/* Content Types Distribution */}
//                 <Card className="bg-white border border-gray-200">
//                   <CardHeader>
//                     <CardTitle>Visitor Demographics</CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <ResponsiveContainer width="100%" height={250}>
//                       <PieChart>
//                         <Pie data={liDemographics} cx="50%" cy="50%" outerRadius={80} dataKey="value">
//                           {liDemographics.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
//                         </Pie>
//                         <Tooltip />
//                         <Legend />
//                       </PieChart>
//                     </ResponsiveContainer>
//                   </CardContent>
//                 </Card>

//                 {/* Top Traffic Channels */}
//                 <Card className="bg-white border border-gray-200">
//                   <CardHeader>
//                     <CardTitle>Click-through Rate</CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="space-y-4">
//                       {liCTRTable.map((row, index) => (
//                         <div key={index} className="flex items-center justify-between">
//                           <span className="text-sm text-gray-900">{row.label}</span>
//                           <div className="flex items-center gap-2">
//                             <span className="text-sm text-gray-900">{row.ctr}%</span>
//                             <span className={`text-xs ${row.change>=0 ? 'text-green-600' : 'text-red-600'}`}>{row.change>=0?'+':''}{row.change}%</span>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </CardContent>
//                 </Card>
//               </div>
//                 </TabsContent>
//                 <TabsContent value="post" className="space-y-6">
//                   <div className="flex items-center justify-end gap-2">
//                     <Select value={liPostRange} onValueChange={setLiPostRange}>
//                       <SelectTrigger className="w-36 rounded-full border-gray-300 text-sm"><SelectValue placeholder="Last 30 Days"/></SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="7days">Last 7 Days</SelectItem>
//                         <SelectItem value="30days">Last 30 Days</SelectItem>
//                         <SelectItem value="custom">Custom</SelectItem>
//                       </SelectContent>
//                     </Select>
//                     <Select value={liRegion} onValueChange={setLiRegion}>
//                       <SelectTrigger className="w-40 rounded-full border-gray-300 text-sm"><SelectValue placeholder="All Regions"/></SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="all">All Regions</SelectItem>
//                         <SelectItem value="uk">UK</SelectItem>
//                         <SelectItem value="usa">USA</SelectItem>
//                         <SelectItem value="latam">Latin America</SelectItem>
//                         <SelectItem value="india">India</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>
//                   <Card className="bg-white border border-gray-200"><CardHeader><CardTitle>Impressions & Reach per Post</CardTitle></CardHeader><CardContent>
//                     <ResponsiveContainer width="100%" height={300}><BarChart data={liPostMetrics}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="post"/><YAxis/><Tooltip/><Legend/><Bar dataKey="impressions" fill="#3b82f6"/><Bar dataKey="reach" fill="#10b981"/></BarChart></ResponsiveContainer>
//                   </CardContent></Card>
//                   <Card className="bg-white border border-gray-200"><CardHeader><CardTitle>Posts & Links</CardTitle></CardHeader><CardContent>
//                     <div className="grid grid-cols-4 text-sm font-medium text-gray-700 mb-2"><div>Post</div><div>Impressions</div><div>Reach</div><div>Link</div></div>
//                     <div className="space-y-1">{liPostMetrics.map((p,i)=>(
//                       <div key={i} className="grid grid-cols-4 items-center text-sm p-2 bg-gray-50 rounded"><div>{p.post}</div><div>{p.impressions}</div><div>{p.reach}</div><div><a href={p.url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">View on LinkedIn</a></div></div>
//                     ))}</div>
//                   </CardContent></Card>
//                 </TabsContent>
//               </Tabs>
//             </TabsContent>

//             <TabsContent value="pardot" className="space-y-6">
//               <div className="flex items-center justify-end gap-2">
//                 <Select value={pardotRange} onValueChange={setPardotRange}><SelectTrigger className="w-36 rounded-full border-gray-300 text-sm"><SelectValue placeholder="Last 30 Days"/></SelectTrigger><SelectContent><SelectItem value="7days">Last 7 Days</SelectItem><SelectItem value="30days">Last 30 Days</SelectItem><SelectItem value="custom">Custom</SelectItem></SelectContent></Select>
//                 <Select value={pardotRegion} onValueChange={setPardotRegion}><SelectTrigger className="w-40 rounded-full border-gray-300 text-sm"><SelectValue placeholder="All Regions"/></SelectTrigger><SelectContent><SelectItem value="all">All Regions</SelectItem><SelectItem value="uk">UK</SelectItem><SelectItem value="usa">USA</SelectItem><SelectItem value="latam">Latin America</SelectItem><SelectItem value="india">India</SelectItem></SelectContent></Select>
//               </div>
//               {/* Content Metrics */}
//               <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
//                 <Card className="bg-white border border-gray-200">
//                   <CardContent className="p-4 sm:p-6">
//                     <div className="flex items-center justify-between mb-2">
//                       <h3 className="text-[14px] sm:text-[16px] text-gray-800">Total Content</h3>
//                       <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
//                     </div>
//                     <p className="text-[24px] sm:text-[32px] lg:text-[36px] text-gray-900 tracking-tight">
//                       {pardotMetrics.totalContent}
//                     </p>
//                     <div className="flex items-center gap-1 mt-2">
//                       <span className="text-[11px] sm:text-[12px] text-green-600">
//                         {pardotMetrics.contentChange} this month
//                       </span>
//                     </div>
//                   </CardContent>
//                 </Card>

//                 <Card className="bg-white border border-gray-200">
//                   <CardContent className="p-4 sm:p-6">
//                     <div className="flex items-center justify-between mb-2">
//                       <h3 className="text-[14px] sm:text-[16px] text-gray-800">Published</h3>
//                       <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
//                     </div>
//                     <p className="text-[24px] sm:text-[32px] lg:text-[36px] text-gray-900 tracking-tight">
//                       {pardotMetrics.publishedThisMonth}
//                     </p>
//                     <div className="flex items-center gap-1 mt-2">
//                       <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
//                       <span className="text-[11px] sm:text-[12px] text-green-600">
//                         {pardotMetrics.publishedChange}
//                       </span>
//                       <span className="text-[11px] sm:text-[12px] text-gray-600">vs last month</span>
//                     </div>
//                   </CardContent>
//                 </Card>

//                 <Card className="bg-white border border-gray-200">
//                   <CardContent className="p-4 sm:p-6">
//                     <div className="flex items-center justify-between mb-2">
//                       <h3 className="text-[14px] sm:text-[16px] text-gray-800">Avg. Publish Time</h3>
//                       <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
//                     </div>
//                     <p className="text-[24px] sm:text-[32px] lg:text-[36px] text-gray-900 tracking-tight">
//                       {pardotMetrics.avgTimeToPublish}
//                     </p>
//                     <div className="flex items-center gap-1 mt-2">
//                       <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
//                       <span className="text-[11px] sm:text-[12px] text-green-600">
//                         {pardotMetrics.timeChange}
//                       </span>
//                       <span className="text-[11px] sm:text-[12px] text-gray-600">improvement</span>
//                     </div>
//                   </CardContent>
//                 </Card>

//                 <Card className="bg-white border border-gray-200">
//                   <CardContent className="p-4 sm:p-6">
//                     <div className="flex items-center justify-between mb-2">
//                       <h3 className="text-[14px] sm:text-[16px] text-gray-800">Conversion Rate</h3>
//                       <Target className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
//                     </div>
//                     <p className="text-[24px] sm:text-[32px] lg:text-[36px] text-gray-900 tracking-tight">
//                       {pardotMetrics.conversionRate}
//                     </p>
//                     <div className="flex items-center gap-1 mt-2">
//                       <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
//                       <span className="text-[11px] sm:text-[12px] text-green-600">
//                         {pardotMetrics.conversionChange}
//                       </span>
//                       <span className="text-[11px] sm:text-[12px] text-gray-600">vs last month</span>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </div>

//               {/* Content Performance Table */}
//               <Card className="bg-white border border-gray-200">
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2">
//                     <BarChart3 className="w-5 h-5" />
//                     Content Performance
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-4">
//                     {pardotContentPerformance.map((content, index) => (
//                       <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
//                         <div className="flex-1 min-w-0">
//                           <h4 className="text-[13px] sm:text-[14px] text-black mb-2 line-clamp-1">
//                             {content.title}
//                           </h4>
//                           <div className="flex items-center gap-4 text-[11px] sm:text-[12px] text-gray-600">
//                             <Badge variant="outline" className="text-[10px] sm:text-xs border-gray-400">
//                               {content.type}
//                             </Badge>
//                             <span>{content.views.toLocaleString()} views</span>
//                             <span>{content.engagement} engagement</span>
//                             <span>by {content.author}</span>
//                           </div>
//                         </div>
//                         <div className="flex items-center gap-4 ml-4">
//                           <div className="text-right">
//                             <div className="text-[12px] sm:text-[13px] text-black">
//                               {content.conversions} conversions
//                             </div>
//                             <div className="text-[10px] sm:text-[11px] text-gray-500">
//                               {content.publishDate}
//                             </div>
//                           </div>
//                           {content.status === 'trending-up' ? (
//                             <TrendingUp className="w-4 h-4 text-green-600" />
//                           ) : (
//                             <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
//                           )}
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </CardContent>
//               </Card>
//             </TabsContent>

//             <TabsContent value="google" className="space-y-6">
//               <div className="flex items-center justify-end gap-2">
//                 <Select value={gaRange} onValueChange={setGaRange}><SelectTrigger className="w-36 rounded-full border-gray-300 text-sm"><SelectValue placeholder="Last 30 Days"/></SelectTrigger><SelectContent><SelectItem value="7days">Last 7 Days</SelectItem><SelectItem value="30days">Last 30 Days</SelectItem><SelectItem value="custom">Custom</SelectItem></SelectContent></Select>
//                 <Select value={gaRegion} onValueChange={setGaRegion}><SelectTrigger className="w-40 rounded-full border-gray-300 text-sm"><SelectValue placeholder="All Regions"/></SelectTrigger><SelectContent><SelectItem value="all">All Regions</SelectItem><SelectItem value="uk">UK</SelectItem><SelectItem value="usa">USA</SelectItem><SelectItem value="latam">Latin America</SelectItem><SelectItem value="india">India</SelectItem></SelectContent></Select>
//               </div>
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                 {/* Engagement Metrics */}
//                 <Card className="bg-white border border-gray-200">
//                   <CardHeader>
//                     <CardTitle>Engagement Breakdown</CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <ResponsiveContainer width="100%" height={300}>
//                       <BarChart data={gaTrend}>
//                         <CartesianGrid strokeDasharray="3 3" />
//                         <XAxis dataKey="date" />
//                         <YAxis />
//                         <Tooltip />
//                         <Bar dataKey="engagement" fill="#3b82f6" />
//                       </BarChart>
//                     </ResponsiveContainer>
//                   </CardContent>
//                 </Card>

//                 {/* Top Performers */}
//                 <Card className="bg-white border border-gray-200">
//                   <CardHeader>
//                     <CardTitle>Top Performers</CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="space-y-4">
//                       {analyticsData.topPerformers.map((performer, index) => (
//                         <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
//                           <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
//                             <Star className="w-4 h-4 text-blue-600" />
//                           </div>
//                           <div className="flex-1">
//                             <div className="text-[11px] sm:text-[12px] text-gray-600">
//                               {performer.metric}
//                             </div>
//                             <div className="text-[12px] sm:text-[13px] text-black line-clamp-1">
//                               {performer.content}
//                             </div>
//                             <div className="text-[11px] sm:text-[12px] text-blue-600">
//                               {performer.value}
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </CardContent>
//                 </Card>
//               </div>

//               {/* Recent Activity */}
//               <Card className="bg-white border border-gray-200">
//                 <CardHeader>
//                   <CardTitle>Recent Activity</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-4">
//                     {analyticsData.recentActivity.map((activity, index) => (
//                       <div key={index} className="flex items-start gap-3 p-3 border-l-4 border-blue-500 bg-blue-50">
//                         <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
//                         <div className="flex-1">
//                           <div className="flex justify-between items-start">
//                             <div>
//                               <div className="text-[12px] sm:text-[13px] text-black">
//                                 {activity.action}
//                               </div>
//                               <div className="text-[11px] sm:text-[12px] text-gray-600 line-clamp-1">
//                                 {activity.content}
//                               </div>
//                             </div>
//                             <div className="text-[10px] sm:text-[11px] text-gray-500">
//                               {activity.time}
//                             </div>
//                           </div>
//                           <div className="text-[10px] sm:text-[11px] text-blue-600 mt-1">
//                             by {activity.user}
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </CardContent>
//               </Card>
//             </TabsContent>

//             <TabsContent value="events" className="space-y-6">
//               <div className="flex items-center justify-end gap-2">
//                 <Select value={eventRange} onValueChange={setEventRange}><SelectTrigger className="w-36 rounded-full border-gray-300 text-sm"><SelectValue placeholder="Last 30 Days"/></SelectTrigger><SelectContent><SelectItem value="7days">Last 7 Days</SelectItem><SelectItem value="30days">Last 30 Days</SelectItem><SelectItem value="custom">Custom</SelectItem></SelectContent></Select>
//                 <Select value={eventRegion} onValueChange={setEventRegion}><SelectTrigger className="w-40 rounded-full border-gray-300 text-sm"><SelectValue placeholder="All Regions"/></SelectTrigger><SelectContent><SelectItem value="all">All Regions</SelectItem><SelectItem value="uk">UK</SelectItem><SelectItem value="usa">USA</SelectItem><SelectItem value="latam">Latin America</SelectItem><SelectItem value="india">India</SelectItem></SelectContent></Select>
//               </div>
//               {/* AI Insights */}
//               <div className="grid grid-cols-1 gap-6">
//                 <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
//                   <CardHeader>
//                     <CardTitle className="flex items-center gap-2">
//                       <Zap className="w-5 h-5 text-blue-600" />
//                       AI-Powered Insights
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                       {eventsInsights.map((insight, index) => (
//                         <div key={index} className="bg-white p-4 rounded-lg border border-blue-100">
//                           <div className="flex items-center gap-2 mb-3">
//                             {insight.type === 'optimization' && <Target className="w-4 h-4 text-green-600" />}
//                             {insight.type === 'timing' && <Clock className="w-4 h-4 text-blue-600" />}
//                             {insight.type === 'performance' && <TrendingUp className="w-4 h-4 text-orange-600" />}
//                             <h4 className="text-sm text-gray-900">{insight.title}</h4>
//                           </div>
//                           <p className="text-xs text-gray-600 mb-3">{insight.description}</p>
//                           <div className="flex items-center gap-2">
//                             <div className="flex-1 bg-gray-200 rounded-full h-1.5">
//                               <div
//                                 className="bg-blue-600 h-1.5 rounded-full"
//                                 style={{ width: `${insight.confidence}%` }}
//                               ></div>
//                             </div>
//                             <span className="text-xs text-gray-500">{insight.confidence}% confidence</span>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </CardContent>
//                 </Card>

//                 {/* Recommendations */}
//                 <Card className="bg-white border border-gray-200">
//                   <CardHeader>
//                     <CardTitle>Content Recommendations</CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="space-y-4">
//                       <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
//                         <Heart className="w-5 h-5 text-green-600 mt-0.5" />
//                         <div>
//                           <h4 className="text-sm text-green-800 mb-1">Create More Case Studies</h4>
//                           <p className="text-xs text-green-700">Case studies show 40% higher conversion rates. Consider creating 2-3 more this month.</p>
//                         </div>
//                       </div>
//                       <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
//                         <Share2 className="w-5 h-5 text-blue-600 mt-0.5" />
//                         <div>
//                           <h4 className="text-sm text-blue-800 mb-1">Optimize Social Media Content</h4>
//                           <p className="text-xs text-blue-700">Your social media posts have high engagement but low reach. Consider using trending hashtags.</p>
//                         </div>
//                       </div>
//                       <div className="flex items-start gap-3 p-4 bg-orange-50 border border-orange-200 rounded-lg">
//                         <MessageSquare className="w-5 h-5 text-orange-600 mt-0.5" />
//                         <div>
//                           <h4 className="text-sm text-orange-800 mb-1">Improve Content Depth</h4>
//                           <p className="text-xs text-orange-700">Longer form content (2000+ words) shows better SEO performance and engagement.</p>
//                         </div>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </div>
//             </TabsContent>
//           </Tabs>
//         </div>
//       </div>
//     </div>
//   );
// };
const AnalyticsPage = () => {
  return (
    <div>
       Analytics
    </div>
  )
}

export default AnalyticsPage
