
import HeaderSection from "@/components/common/HeaderSection";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "@/utils/BASE_URL";
import { useEffect } from "react";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from 'lucide-react';
import { getStatusBadge } from "@/utils/helpers";
import { getCsrfToken } from "@/utils/csrf";
const AdminContentPublishList = () => {

    type Content = {
        content_id: string;
        title: string;
        status: string;
        author_name: string;
        created_at: number
        content_type: string
        internal_approval: boolean,
        marketing_approval: boolean,
        stakeholder_approval: boolean,
    };

    const [approvedContent, setApprovedContent] = useState<Content[]>([]);
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

    //const getStatusBadge = (item: any) => {
    //     const normalizedStatus = normalizeStatus(item?.status);
    //     switch (normalizedStatus) {
    //         case 'draft':
    //             return <Badge variant="secondary" className="bg-gray-100 text-black">Draft</Badge>;
    //         case 'in_review':
    //             return <Badge className="bg-blue-600 text-white">In review</Badge>;
    //         case 'published':
    //             return <Badge variant="secondary" className="bg-green-500 text-white">Published</Badge>;
    //         case 'approved':
    //             return <Badge variant="secondary" className="bg-yellow-400 text-black">Approved</Badge>;
    //         case 'rejected':
    //             return <Badge variant="secondary" className="bg-red-600 text-white">Rejected</Badge>;
    //         default:
    //             return <Badge variant="outline">{item?.status}</Badge>;
    //     }
    // };


    const fetchContentToReview = async () => {
        try {
            const res = await fetch(
                `${BASE_URL}/content/contents/filter/?status=approved`,
                {
                    method: "GET",
                  credentials: "include",
                        headers: {
                          "Content-Type": "application/json",
                          "X-CSRFToken": getCsrfToken(),
                        },
                }
            );

            const data = await res.json();
            setApprovedContent(data.items);
            console.log(data.items);

            return data;
        } catch (err) {
            console.error(err);
        }
    };


    useEffect(() => {
        fetchContentToReview();
    }, [])


    return (
        <div>
            <div>
                <HeaderSection/>
                <div>
                    <h1 className="text-2xl text-center mt-5 mb-5">List Of Content To Be Published</h1>
                </div>
                <div className="mt-6">
                    <div className="space-y-2.5">
                        {approvedContent.map((items) => (
                            <Card
                                onClick={() => navigate(`/publish/${items.content_id}`)}
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
            </div>
        </div>
    )
}

export default AdminContentPublishList;
