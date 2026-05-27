// import { BASE_URL } from "@/utils/BASE_URL";
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Calendar} from 'lucide-react';
// import { Card, CardContent } from "@/components/ui/card";
// import { getStatusBadge, normalizeStatus } from "@/utils/helpers";
// import { Badge } from "@/components/ui/badge";
// import { useContentStore } from "@/store/useContent";

// type props = {
//     status: string;
//     type: string;
//     quarter: string;
// };

// const AllContent = ({ status, type, quarter }: props) => {

//     type Content = {
//         content_id: string;
//         title: string;
//         status: string;
//         author_name: string;
//         created_at: number
//         content_type: string
//         internal_approval: boolean,
//         marketing_approval: boolean,
//         stakeholder_approval: boolean,
//     };


//     const { contents, isLoading, fetchContents,} = useContentStore();
//     const [allContentList, setAllContentList] = useState<Content[]>([]);
//     const [loading, setLoading] = useState(true);
//     const navigate = useNavigate();

//     const getApprovalText = (item:any) => {
//         if (item.status === "published") {
//             return "Published";
//         }

//         const approvedBy = [];

//         if (item.internal_approval) approvedBy.push("Internal");
//         if (item.marketing_approval) approvedBy.push("Marketing");
//         if (item.stakeholder_approval) approvedBy.push("Stakeholder");

//         if (approvedBy.length > 0) {
//             return `Approved by ${approvedBy.join(", ")}`;
//         }

//         return "No approval provided yet";
//     };

//     const getStatusBadge = (item: any) => {
//         const normalizedStatus = normalizeStatus(item?.status);
//         switch (normalizedStatus) {
//             case 'draft':
//                 return <Badge variant="secondary" className="bg-gray-100 text-black">Draft</Badge>;
//             case 'in_review':
//                 return <Badge className="bg-blue-600 text-white">In review</Badge>;
//             case 'published':
//                 return <Badge variant="secondary" className="bg-green-500 text-white">Published</Badge>;
//             case 'approved':
//                 return <Badge variant="secondary" className="bg-yellow-400 text-black">Approved</Badge>;
//             case 'rejected':
//                 return <Badge variant="secondary" className="bg-red-600 text-white">Rejected</Badge>;
//             default:
//                 return <Badge variant="outline">{item?.status}</Badge>;
//         }
//     };


//     // const fetchContents = async () => {
//     //     try {
//     //         const token = localStorage.getItem("accessToken");
//     //         setLoading(true);

//     //         const params = new URLSearchParams();

//     //         if (status !== "all") {
//     //             params.append("status", status);
//     //         }

//     //         if (type !== "all") {
//     //             params.append("content_type", type);
//     //         }

//     //         if (quarter) {
//     //             params.append("quarter", quarter);
//     //         }

//     //         const url = `${BASE_URL}/content/contents/filter/?${params.toString()}`;

//     //         const res = await fetch(url, {
//     //             headers: { Authorization: `Bearer ${token}` }
//     //         });

//     //         const data = await res.json();
//     //         console.log(data);
//     //         setAllContentList(data.items);

//     //     } catch (err) {
//     //         console.error(err);
//     //     } finally {
//     //         setLoading(false);
//     //     }
//     // };

//     useEffect(() => {
//         fetchContents();
//     }, [status, type, quarter])

//     if (loading)
//         return <p className="flex justify-center mt-8">Loading....</p>;

//     return (
//         <div className="mt-6">
//             <div className="space-y-2.5">
//                 {contents.map((items) => (
//                     <Card
//                         onClick={() => navigate(`/editor/${items.content_id}`)}
//                         key={items.content_id}
//                         className="bg-white border border-gray-300 hover:shadow-md transition-shadow cursor-pointer"
//                     >
//                         <CardContent className="p-3 sm:p-4">

//                             <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">

//                                 <div className="flex-1 min-w-0">
//                                     <h3 className="font-medium text-[13px] sm:text-[14px] text-black mb-1 sm:mb-2 leading-snug">
//                                         {items.title}
//                                     </h3>

//                                     <div className="flex flex-wrap items-center gap-1 sm:gap-1 text-[11px] sm:text-[12px] text-gray-600 mb-1 sm:mb-2">
//                                         <span className="mr-2">{items.content_type}</span>
//                                         <span className="mr-2">by {items.author_name}</span>

//                                         <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />

//                                         <span>
//                                             {new Date(items.created_at).toLocaleString("en-IN", {
//                                                 timeZone: "Asia/Kolkata",
//                                                 day: "2-digit",
//                                                 month: "2-digit",
//                                                 year: "numeric",
//                                                 hour: "2-digit",
//                                                 minute: "2-digit",
//                                                 hour12: true,
//                                             })}
//                                         </span>
//                                     </div>
//                                 </div>

//                             </div>

//                             <div className="flex items-center justify-between mt-1">


//                                 <div className="flex items-center gap-2 h-full">


//                                     <span className="text-[11px] sm:text-[12px] text-gray-500 ">
//                                         {getApprovalText(items)}
//                                     </span>
//                                 </div>


//                                 <div className="flex items-center gap-2 flex-shrink-0">

//                                     {getStatusBadge(items)}
//                                 </div>

//                             </div>

//                         </CardContent>
//                     </Card>
//                 ))}
//             </div>
//         </div>
//     );
// }

// export default AllContent


import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { getStatusBadge, normalizeStatus } from "@/utils/helpers";
import { Badge } from "@/components/ui/badge";
import { useContentStore } from "@/store/useContent";

type props = {
    status: string;
    type: string;
    quarter: string;
};

const AllContent = ({ status, type, quarter }: props) => {

    const { contents, isLoading, fetchContents, } = useContentStore();
    const navigate = useNavigate();

    const getApprovalText = (item: any) => {
        if (item.status === "published") {
            return "Published";
        }

        const approvedBy = [];

        if (item.internal_approval) approvedBy.push("Internal");
        if (item.marketing_approval) approvedBy.push("Marketing");
        if (item.stakeholder_approval) approvedBy.push("Stakeholder");

        if (approvedBy.length > 0) {
            return `Approved by ${approvedBy.join(", ")}`;
        }

        return "No approval provided yet";
    };

    const getStatusBadge = (item: any) => {
        const normalizedStatus = normalizeStatus(item?.status);
        switch (normalizedStatus) {
            case 'draft':
                return <Badge variant="secondary" className="bg-gray-100 text-black">Draft</Badge>;
            case 'in_review':
                return <Badge className="bg-blue-600 text-white">In Review</Badge>;
            case 'published':
                return <Badge variant="secondary" className="bg-green-500 text-white">Published</Badge>;
            case 'approved':
                return <Badge variant="secondary" className="bg-yellow-400 text-black">Approved</Badge>;
            case 'rejected':
                return <Badge variant="secondary" className="bg-red-600 text-white">Rejected</Badge>;
            default:
                return <Badge variant="outline">{item?.status}</Badge>;
        }
    };

    useEffect(() => {
        fetchContents({
            status: status !== "all" ? status : undefined,
            content_type: type !== "all" ? type : undefined,
            quarter: quarter ? Number(quarter) : undefined,
        });
    }, [status, type, quarter]);


    return (
        <div className="mt-6">
            <div className="space-y-2.5">
                {contents.map((items) => (
                    <Card
                        onClick={() => navigate(`/editor/${items.content_id}`)}
                        key={items.content_id}
                        className="bg-white border border-gray-300 hover:shadow-md transition-shadow cursor-pointer"
                    >
                        <CardContent className="p-3 sm:p-4">

                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">

                                <div className="flex-1 min-w-0">
                                    <h3 className="font-medium text-[13px] sm:text-[14px] text-black mb-1 sm:mb-2 leading-snug">
                                        {items.title}
                                    </h3>

                                    <div className="flex flex-wrap items-center gap-1 sm:gap-1 text-[11px] sm:text-[12px] text-gray-600 mb-1 sm:mb-2">
                                        <span className="mr-2">{items.content_type}</span>
                                        <span className="mr-2">by {items.author_name}</span>

                                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />

                                        <span>
                                            {new Date(items.created_at).toLocaleString("en-IN", {
                                                timeZone: "Asia/Kolkata",
                                                day: "2-digit",
                                                month: "2-digit",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                hour12: true,
                                            })}
                                        </span>
                                    </div>
                                </div>

                            </div>

                            <div className="flex items-center justify-between mt-1">


                                <div className="flex items-center gap-2 h-full">


                                    <span className="text-[11px] sm:text-[12px] text-gray-500 ">
                                        {getApprovalText(items)}
                                    </span>
                                </div>


                                <div className="flex items-center gap-2 flex-shrink-0">

                                    {getStatusBadge(items)}
                                </div>

                            </div>

                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

export default AllContent

