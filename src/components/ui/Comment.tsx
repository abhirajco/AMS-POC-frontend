import React, { useState, useEffect } from "react";
import {Box,Typography,IconButton,Menu,MenuItem,TextField,Button,Avatar,Dialog,DialogTitle,DialogActions,} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { MentionsInput, Mention } from "react-mentions";
import { BASE_URL } from "@/utils/BASE_URL";
import { getCsrfToken } from "@/utils/csrf";

// TYPES
interface CommentType {
    comment_id: string;
    user: string;
    text?: string;
    timestamp?: string;
}

interface Props {
    contentId: string;
    initialComments: CommentType[];
}

const CommentComponent: React.FC<Props> = ({ contentId, initialComments }) => {
    const [comments, setComments] = useState<CommentType[]>(initialComments || []);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [editMode, setEditMode] = useState<string | null>(null);
    const [editText, setEditText] = useState<string>("");
    const [newComment, setNewComment] = useState<string>("");
    const [openDelete, setOpenDelete] = useState<boolean>(false);

    const getInitials = (name: string): string => {
        if (!name) return "U";
        return name
            .split(" ")
            .map((n: string) => n[0])
            .join("")
            .toUpperCase();
    };

    const formatDate = (date?: string) => {
        if (!date) return "";
        return new Date(date).toLocaleString();
    };

    const fetchComments = async () => {
        try {
            const res = await fetch(
                `${BASE_URL}/content/contents/${contentId}/comments/history/`,
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
            setComments(data.comments || []);
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddComment = async () => {
        try {
            await fetch(`${BASE_URL}/content/contents/${contentId}/comment/`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": getCsrfToken(),
                },
                body: JSON.stringify({ comment_text: newComment || "" }),
            });
            setNewComment("");
            fetchComments();
        } catch (err) {
            console.error(err);
        }
    };

    const handleEditSave = async (id: string) => {
        try {
            await fetch(`${BASE_URL}/content/comments/edit/${id}/`, {
                method: "PATCH",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": getCsrfToken(),
                },
                body: JSON.stringify({ comment_text: editText }),
            });
            setEditMode(null);
            fetchComments();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async () => {
        if (!selectedId) return;
        try {
            await fetch(`${BASE_URL}/content/comments/edit/${selectedId}/`, {
                method: "DELETE",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": getCsrfToken(),
                },
            });
            setOpenDelete(false);
            fetchComments();
        } catch (err) {
            console.error(err);
        }
    };

    const handleUserSearch = async (
        query: string,
        callback: (data: { id: string; display: string }[]) => void
    ) => {
        try {
            const res = await fetch(
                `${BASE_URL}/accounts/users/search/?q=${query}`,
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

            const formatted = data.map((u: any) => ({
                id: u.id,
                display: u.full_name,
            }));

            callback(formatted);
        } catch (err) {
            console.error(err);
        }
    };


    useEffect(() => {
        fetchComments();
    }, [])
    return (
        <Box className="w-72 ml-6 border rounded-md flex flex-col h-[500px]">
            <Typography className="text-center border-b p-2 font-semibold">
                Comments
            </Typography>

            {/* LIST */}
            <Box className="flex-1 overflow-y-auto p-2">
                {comments.map((c) => (
                    <Box key={c.comment_id} className="flex items-start gap-2 mb-3">
                        <Avatar sx={{ width: 25, height: 25, fontSize: 12 }}>
                            {getInitials(c.user)}
                        </Avatar>

                        <Box className="flex-1">
                            <Typography variant="caption" className="font-semibold">
                                {c.user}
                            </Typography>

                            <Typography variant="caption" className="block text-gray-500">
                                {formatDate(c.timestamp
                                )}
                            </Typography>

                            {editMode === c.comment_id ? (
                                <>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        value={editText}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                            setEditText(e.target.value)
                                        }
                                    />
                                    <Button
                                        size="small"
                                        onClick={() => handleEditSave(c.comment_id)}
                                    >
                                        Save
                                    </Button>
                                </>
                            ) : (
                                <Typography
                                    dangerouslySetInnerHTML={{
                                        __html: (c.text || "").replace(
                                            /@\[(.*?)\]\((.*?)\)/g,
                                            '<span style="color:blue">@$1</span>'
                                        ),
                                    }}
                                />
                            )}
                        </Box>

                        <IconButton
                            onClick={(e: React.MouseEvent<HTMLElement>) => {
                                setAnchorEl(e.currentTarget);
                                setSelectedId(c.comment_id);
                            }}
                        >
                            <MoreVertIcon />
                        </IconButton>
                    </Box>
                ))}
            </Box>

            <Box className="p-2 border-t flex items-center gap-2">
                <Box className="flex-1">
                    <MentionsInput
                        value={newComment}
                        onChange={(e: any) => setNewComment(e.target.value)}
                        className="w-full border p-2 rounded"
                    >
                        <Mention
                            trigger="@"
                            data={handleUserSearch}
                            markup="@[__display__](__id__)"
                        />
                    </MentionsInput>
                </Box>

                <Button
                    variant="contained"
                    size="small"
                    onClick={handleAddComment}
                    sx={{
                        backgroundColor: "#9e9e9e", // grey
                        color: "",
                        minWidth: "40px",
                        height: "36px",
                        "&:hover": {
                            backgroundColor: "#7a7a7a",
                        },
                    }}
                >
                    Comment
                </Button>
            </Box>


            {/* MENU */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
            >
                <MenuItem
                    onClick={() => {
                        const c = comments.find((x) => x.comment_id === selectedId);
                        setEditMode(selectedId);
                        setEditText(c?.text || "");
                        setAnchorEl(null);
                    }}
                >
                    <EditIcon fontSize="small" /> Edit
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        setOpenDelete(true);
                        setAnchorEl(null);
                    }}
                >
                    <DeleteIcon fontSize="small" color="error" /> Delete
                </MenuItem>
            </Menu>

            {/* DELETE DIALOG */}
            <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
                <DialogTitle>Are you sure you want to delete?</DialogTitle>
                <DialogActions>
                    <Button onClick={() => setOpenDelete(false)}>Cancel</Button>
                    <Button color="error" onClick={handleDelete}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default CommentComponent;