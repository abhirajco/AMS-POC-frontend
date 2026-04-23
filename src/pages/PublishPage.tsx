import React from 'react'
import HeaderSection from "@/components/common/HeaderSection";
import { useParams } from "react-router-dom";
import { BASE_URL } from "@/utils/BASE_URL";
import { useState, useEffect } from "react";
import { Box, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Menu, MenuItem, } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Toaster, toast } from "sonner";
import ApprovalTextEditor from "@/components/ui/ApprovalTextEditor";
import CommentSection from "@/components/ui/CommentSection";
import { Card, CardContent } from "@/components/ui/card";
import { CheckSquare } from "lucide-react";

const PublishPage = () => {

    const { id } = useParams();
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [rejectOpen, setRejectOpen] = useState(false);
    const [reason, setReason] = useState("");
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState([]);

    const fetchContent = async () => {
        const token = localStorage.getItem("accessToken");

        const res = await fetch(`${BASE_URL}/content/contents/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        setTitle(data.title);
        setBody(data.body);
    };


    const publishContent = async () => {
        const token = localStorage.getItem("accessToken");
        try {
            const response = await fetch(
                `${BASE_URL}/content/contents/${id}/publish/`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        action: "publish",
                    }),
                }
            );

            let data;
            try {
                data = await response.json();
            } catch {
                data = null;
            }

            if (!response.ok) {
                const errorMessage =
                    data?.message ||
                    data?.detail ||
                    JSON.stringify(data) ||
                    "Failed to publish content";

                throw new Error(errorMessage);
            }

            const successMessage =
                data?.message || "Content published successfully";

            toast.success(successMessage);

            return data;
        } catch (error) {
            toast.error(error.message || "Something went wrong");
            throw error;
        }
    };

    useEffect(() => {
        if (id) {
            fetchContent();
        }
    }, [id]);

    return (
        <>
            <HeaderSection />
            <div className="flex gap-4 mt-3">
                {/* LEFT → Editor */}
                <div className="flex-1">
                    <Card className="bg-white border border-gray-300">
                        <CardContent className="p-3 sm:p-4">
                            <ApprovalTextEditor
                                contentTitle={title}
                                contentBody={body}
                                contentId={id}
                                onChange={(value) => setBody(value)}
                            />
                            <div className="mt-4 flex justify-between">
                                <button
                                    onClick={publishContent}
                                    className="flex items-center bg-[#1a2c47] text-white hover:bg-[#2a3c57] text-sm py-2 px-3 border rounded-sm"
                                >
                                    <CheckSquare className="w-4 h-4 mr-2" />
                                    Publish Content
                                </button>


                            </div>
                        </CardContent>
                    </Card>

                </div>

                {/* RIGHT → Comments */}
                <div className=" w-80 ">
                    <CommentSection id={id} />
                </div>
            </div>
        </>
    )
}

export default PublishPage;
