// import { BASE_URL } from '@/utils/BASE_URL'
// import { useState, useEffect } from 'react';
// import { Card, CardContent } from "@/components/ui/card";
// import { MessageSquare } from 'lucide-react';
// import { Badge } from "@/components/ui/badge";
// import { Textarea } from "@/components/ui/textarea";
// import { Label } from "@/components/ui/label";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import { toast } from 'sonner';

// const CommentSection = ({ id }: any) => {

//   type Comment = {
//     comment_id: string;
//     comment_text: string;
//     text: string;
//     user: string;
//     role: string;
//     //author_email: string;
//     timestamp: string;
//     selected_text: string;
//     reply_to: string;
//   };

//   type User = {
//     user_id: string;
//     full_name: string;
//     email: string;
//   };

//   const [comments, setComments] = useState<Comment[]>([]);
//   const [mentionUsers, setMentionUsers] = useState<User[]>([]);
//   const [ContentId, setContentId] = useState(id);
//   const [newComment, setNewComment] = useState("");
//   const [mentionMap, setMentionMap] = useState({});
//   const [mentionQuery, setMentionQuery] = useState("");
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [commentId, setComment] = useState("");

//   const deleteComment = async (commentId: any) => {
//     const token = localStorage.getItem("accessToken");

//     try {
//       const res = await fetch(
//         `${BASE_URL}/content/comments/edit/${commentId}/`,
//         {
//           method: "DELETE",
//           headers: {
//             "Authorization": `Bearer ${token}`,
//           },
//         }
//       );

//       if (!res.ok) {
//         let errorMessage = "Failed to delete comment";

//         try {
//           const errorData = await res.json();
//           errorMessage = errorData?.message || errorMessage;
//         } catch {

//         }

//         if (res.status === 403) {
//           toast.error("You do not have permission to delete this comment");
//         } else if (res.status === 404) {
//           toast.error("Comment not found");
//         } else {
//           toast.error(errorMessage);
//         }

//         throw new Error(errorMessage);
//       }

//       toast.success("Comment deleted successfully");
//       return true;
//       fetchCommentHistory(id);

//     } catch (error) {
//       console.error("Delete comment error:", error);
//       toast.error("Something went wrong while deleting comment");
//       return false;
//     }
//   };

//   const editComment = async ({commentId, updatedText}:any) => {

//     const token = localStorage.getItem("accessToken");

//     if (!commentId) {
//       console.error("No commentId provided");
//       toast.error("Invalid comment ID");
//       return;
//     }

//     if (!updatedText?.trim()) {
//       toast.error("Comment cannot be empty");
//       return;
//     }

//     if (!token) {
//       console.error("No auth token found");
//       toast.error("You are not authenticated");
//       return;
//     }

//     try {
//       const res = await fetch(
//         `${BASE_URL}/content/comments/edit/${commentId}/`,
//         {
//           method: "PATCH",
//           headers: {
//             "Authorization": `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             comment_text: updatedText,
//           }),
//         }
//       );

//       if (!res.ok) {
//         let errorMessage = "Failed to update comment";

//         try {
//           const errorData = await res.json();
//           errorMessage = errorData?.message || errorMessage;
//         } catch {
//           // ignore JSON parse error
//         }

//         if (res.status === 403) {
//           toast.error("You do not have permission to edit this comment");
//         } else if (res.status === 404) {
//           toast.error("Comment not found");
//         } else {
//           toast.error(errorMessage);
//         }

//         throw new Error(errorMessage);
//       }

//       const data = await res.json();
//       toast.success("Comment updated successfully");
//       fetchCommentHistory(id);
//       return data;

//     } catch (error) {
//       console.error("Edit comment error:", error);
//       toast.error("Something went wrong while updating comment");
//       return null;
//     }
//   };

//   const renderCommentText = (text: string) => {
//     const regex = /@\[(.*?)\]\((.*?)\)/g;

//     const parts = [];
//     let lastIndex = 0;
//     let match;

//     while ((match = regex.exec(text)) !== null) {
//       const [fullMatch, name, id] = match;

//       // normal text
//       parts.push(text.slice(lastIndex, match.index));

//       // mention styled
//       parts.push(
//         <span key={id} className="text-blue-600 font-medium">
//           @{name}
//         </span>
//       );

//       lastIndex = match.index + fullMatch.length;
//     }

//     parts.push(text.slice(lastIndex));

//     return parts;
//   };

//   const handleCommentChange = async (e: any) => {
//     const value = e.target.value;
//     setNewComment(value);

//     // detect @word
//     const match = value.match(/@(\w*)$/);

//     if (match && match[1].length > 0) {
//       const query = match[1]; // e.g. "A"

//       setMentionQuery(query);
//       setShowDropdown(true);

//       // call API
//       fetchUsers(query);
//     } else {
//       setShowDropdown(false);
//     }
//   };

//   const formatDateTime = (dateString: string) => {
//     const date = new Date(dateString);
//     return date.toLocaleString("en-IN", {
//       timeZone: "Asia/Kolkata",
//       dateStyle: "medium",
//       timeStyle: "short",
//     });
//   };


//   const fetchUsers = async (query: any) => {
//     const token = localStorage.getItem("accessToken");

//     try {
//       const res = await fetch(
//         `${BASE_URL}/accounts/users/search/?q=${query}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       const data = await res.json();
//       setMentionUsers(data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleSelectUser = (user: any) => {

//     const displayText = `@${user.full_name}`;
//     const backendText = `@[${user.full_name}](${user.user_id})`;

//     // store mapping
//     setMentionMap((prev) => ({
//       ...prev,
//       [displayText]: backendText
//     }));

//     const newText = newComment.replace(/@\w*$/, displayText + " ");

//     setNewComment(newText);
//     setShowDropdown(false);
//   };


//   const fetchCommentHistory = async (id: string) => {
//     const token = localStorage.getItem("accessToken");

//     if (!id) {
//       console.error("No contentId provided");
//       return null;
//     }

//     try {
//       const response = await fetch(
//         `${BASE_URL}/content/contents/${id}/comments/history/`,
//         {
//           method: "GET",
//           headers: {
//             "Authorization": `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (!response.ok) {
//         throw new Error("Failed to fetch comment history");
//       }

//       const data = await response.json();
//       setComments(data.comments);
//       return data;

//     } catch (error) {
//       console.error("Error fetching comment history:", error);
//       return null;
//     }
//   };

//   const addComments = async ({ comment }: any) => {
//     const token = localStorage.getItem("accessToken");

//     if (!ContentId) {
//       console.error("No contentId provided");
//       return;
//     }

//     try {
//       const res = await fetch(
//         `${BASE_URL}/content/contents/${ContentId}/comment/`,
//         {
//           method: "POST",
//           headers: {
//             "Authorization": `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             comment_text: comment,
//           }),
//         }
//       );

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data?.message || "Failed to add comment");
//       }
//       fetchCommentHistory(id);
//       return data;
//     } catch (error) {
//       console.error("Add Comment Error:", error.message);
//       throw error;
//     }
//   };

//   const handleAddCommentClick = async () => {
//     if (!newComment.trim()) return;
//     let finalComment = newComment;

//     Object.entries(mentionMap).forEach(([key, value]) => {
//       finalComment = finalComment.replace(key, value);
//     });

//     await addComments({ comment: finalComment });
//     //await addComments({ comment: addComment });

//     setNewComment(""); // clear input
//   };

//   const getInitials = (name: any) => {
//     return name
//       ?.split(" ")
//       .map((w: any) => w[0])
//       .join("")
//       .slice(0, 2)
//       .toUpperCase();
//   };

//   useEffect(() => {
//     if (ContentId) {
//       fetchCommentHistory(ContentId);
//     }
//   }, [])


//   return (
//     <div>
//       <div className="flex-1 lg:max-w-md">
//         <Card className="bg-white border border-gray-300 h-[480px] overflow-y-auto">
//           <CardContent className="p-3 sm:p-4 flex flex-col h-full">
//             {/* Add Comment */}
//             <div className="mb-4 sm:mb-6">
//               <Label className="text-[11px] sm:text-[12px] font-semibold text-gray-600 mb-2 block">Add Comment</Label>
//               <div>
//                 <Textarea
//                   placeholder="Leave feedback or suggestions..."
//                   value={newComment}
//                   onChange={handleCommentChange}
//                   className="border-gray-300 mb-2 text-sm min-h-[80px]"
//                 />
//                 {showDropdown && mentionUsers.length > 0 && (
//                   <div className="border bg-white shadow-md rounded mt-1 max-h-40 overflow-y-auto">
//                     {mentionUsers.map((user) => (
//                       <div
//                         key={user.user_id}
//                         onClick={() => handleSelectUser(user)}
//                         className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
//                       >
//                         {user.full_name}
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               <div className="flex justify-end">
//                 <Button
//                   onClick={handleAddCommentClick}
//                   className="bg-[#1a2c47] text-white hover:bg-[#2a3c57] text-sm"
//                   disabled={!newComment.trim()}
//                 >
//                   <MessageSquare className="w-4 h-4 mr-1 sm:mr-2" />
//                   Add Comment
//                 </Button>
//               </div>
//             </div>

//             <h3 className="font-medium text-[13px] sm:text-[14px] text-black mb-4 sm:mb-6">
//               Comments
//             </h3>

//             {/* Comments List */}
//             <div className="space-y-2">
//               {comments.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).map((comment) => (
//                 <div key={comment.comment_id}>
//                   <div className="space-y-1 sm:space-y-1 ">
//                     <div className="flex items-center gap-2">
//                       <Avatar className="w-6 h-6 sm:w-7 sm:h-7">
//                         <AvatarFallback className="bg-gray-200 text-black text-[10px] sm:text-[11px]">
//                           {getInitials(comment.user)}
//                         </AvatarFallback>
//                       </Avatar>
//                       <div className="flex-1 min-w-0">
//                         <div className="flex items-center gap-2">
//                           <span className="font-semibold text-[11px] sm:text-[12px] text-black">
//                             {comment.user}
//                           </span>
//                           <Badge variant="outline" className="border-gray-400 px-1 py-0 rounded text-[9px] sm:text-[10px]">
//                             {comment.role}
//                           </Badge>
//                         </div>
//                         <div className="text-[10px] sm:text-[11px] text-gray-600"> {formatDateTime(comment.timestamp)}</div>
//                       </div>
//                     </div>
//                     <p className="text-[11px] sm:text-[12px] text-gray-700 leading-relaxed pl-8 sm:pl-9">
//                       {renderCommentText(comment.text)}
//                     </p>
//                     <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pl-8 sm:pl-9">
//                       <div className="flex items-center gap-2">

//                       </div>
//                     </div>
//                   </div>

//                 </div>
//               ))}
//             </div>

//             {/* Content Metadata */}

//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   )
// }

// export default CommentSection




// import { BASE_URL } from '@/utils/BASE_URL'
// import { useState, useEffect, useRef } from 'react';
// import { Card, CardContent } from "@/components/ui/card";
// import { MessageSquare, MoreVertical, Pencil, Trash2, CornerDownRight } from 'lucide-react';
// import { Badge } from "@/components/ui/badge";
// import { Textarea } from "@/components/ui/textarea";
// import { Label } from "@/components/ui/label";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import { toast } from 'sonner';

// const CommentSection = ({ id }: any) => {

//   type Comment = {
//     comment_id: string;
//     comment_text: string;
//     text: string;
//     user: string;
//     role: string;
//     timestamp: string;
//     selected_text: string;
//     reply_to: string | null;
//   };

//   type User = {
//     user_id: string;
//     full_name: string;
//     email: string;
//   };

//   const [comments, setComments] = useState<Comment[]>([]);
//   const [mentionUsers, setMentionUsers] = useState<User[]>([]);
//   const [ContentId] = useState(id);
//   const [newComment, setNewComment] = useState("");
//   const [mentionMap, setMentionMap] = useState<Record<string, string>>({});
//   const [showDropdown, setShowDropdown] = useState(false);

//   // Three-dot menu state
//   const [openMenuId, setOpenMenuId] = useState<string | null>(null);
//   const menuRef = useRef<HTMLDivElement | null>(null);

//   // Edit state
//   const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
//   const [editText, setEditText] = useState("");

//   // Reply state
//   const [replyToCommentId, setReplyToCommentId] = useState<string | null>(null);
//   const [replyText, setReplyText] = useState("");
//   const [replyMentionMap, setReplyMentionMap] = useState<Record<string, string>>({});
//   const [replyMentionUsers, setReplyMentionUsers] = useState<User[]>([]);
//   const [showReplyDropdown, setShowReplyDropdown] = useState(false);

//   // Close menu when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (e: MouseEvent) => {
//       if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
//         setOpenMenuId(null);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   const deleteComment = async (commentId: string) => {
//     const token = localStorage.getItem("accessToken");
//     try {
//       const res = await fetch(`${BASE_URL}/content/comments/edit/${commentId}/`, {
//         method: "DELETE",
//         headers: { "Authorization": `Bearer ${token}` },
//       });
//       if (!res.ok) {
//         if (res.status === 403) toast.error("You do not have permission to delete this comment");
//         else if (res.status === 404) toast.error("Comment not found");
//         else toast.error("Failed to delete comment");
//         return false;
//       }
//       toast.success("Comment deleted successfully");
//       fetchCommentHistory(ContentId);
//       return true;
//     } catch (error) {
//       console.error("Delete comment error:", error);
//       toast.error("Something went wrong while deleting comment");
//       return false;
//     }
//   };

//   const editComment = async ({ commentId, updatedText }: { commentId: string; updatedText: string }) => {
//     const token = localStorage.getItem("accessToken");
//     if (!commentId) { toast.error("Invalid comment ID"); return; }
//     if (!updatedText?.trim()) { toast.error("Comment cannot be empty"); return; }
//     if (!token) { toast.error("You are not authenticated"); return; }
//     try {
//       const res = await fetch(`${BASE_URL}/content/comments/edit/${commentId}/`, {
//         method: "PATCH",
//         headers: {
//           "Authorization": `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ comment_text: updatedText }),
//       });
//       if (!res.ok) {
//         if (res.status === 403) toast.error("You do not have permission to edit this comment");
//         else if (res.status === 404) toast.error("Comment not found");
//         else toast.error("Failed to update comment");
//         return null;
//       }
//       const data = await res.json();
//       toast.success("Comment updated successfully");
//       fetchCommentHistory(ContentId);
//       return data;
//     } catch (error) {
//       console.error("Edit comment error:", error);
//       toast.error("Something went wrong while updating comment");
//       return null;
//     }
//   };

//   const renderCommentText = (text: string) => {
//     const regex = /@\[(.*?)\]\((.*?)\)/g;
//     const parts: (string | JSX.Element)[] = [];
//     let lastIndex = 0;
//     let match;
//     while ((match = regex.exec(text)) !== null) {
//       const [fullMatch, name, uid] = match;
//       parts.push(text.slice(lastIndex, match.index));
//       parts.push(<span key={uid + match.index} className="text-blue-600 font-medium">@{name}</span>);
//       lastIndex = match.index + fullMatch.length;
//     }
//     parts.push(text.slice(lastIndex));
//     return parts;
//   };

//   const handleCommentChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
//     const value = e.target.value;
//     setNewComment(value);
//     const match = value.match(/@(\w*)$/);
//     if (match && match[1].length > 0) {
//       setShowDropdown(true);
//       fetchUsers(match[1], setMentionUsers);
//     } else {
//       setShowDropdown(false);
//     }
//   };

//   const handleReplyChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
//     const value = e.target.value;
//     setReplyText(value);
//     const match = value.match(/@(\w*)$/);
//     if (match && match[1].length > 0) {
//       setShowReplyDropdown(true);
//       fetchUsers(match[1], setReplyMentionUsers);
//     } else {
//       setShowReplyDropdown(false);
//     }
//   };

//   // IST format — parse timestamp as UTC if no timezone info present
//   const formatDateTime = (dateString: string) => {
//     // Backend sends "2026-04-20 13:50:37" (no Z / no offset) — treat as UTC
//     const normalized = dateString.includes('T') || dateString.endsWith('Z')
//       ? dateString
//       : dateString.replace(' ', 'T') + 'Z';
//     const date = new Date(normalized);
//     return date.toLocaleString("en-IN", {
//       timeZone: "Asia/Kolkata",
//       dateStyle: "medium",
//       timeStyle: "short",
//     });
//   };

//   const fetchUsers = async (query: string, setter: (users: User[]) => void) => {
//     const token = localStorage.getItem("accessToken");
//     try {
//       const res = await fetch(`${BASE_URL}/accounts/users/search/?q=${query}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await res.json();
//       setter(data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleSelectUser = (user: User) => {
//     const displayText = `@${user.full_name}`;
//     const backendText = `@[${user.full_name}](${user.user_id})`;
//     setMentionMap(prev => ({ ...prev, [displayText]: backendText }));
//     setNewComment(prev => prev.replace(/@\w*$/, displayText + " "));
//     setShowDropdown(false);
//   };

//   const handleSelectReplyUser = (user: User) => {
//     const displayText = `@${user.full_name}`;
//     const backendText = `@[${user.full_name}](${user.user_id})`;
//     setReplyMentionMap(prev => ({ ...prev, [displayText]: backendText }));
//     setReplyText(prev => prev.replace(/@\w*$/, displayText + " "));
//     setShowReplyDropdown(false);
//   };

//   const fetchCommentHistory = async (contentId: string) => {
//     const token = localStorage.getItem("accessToken");
//     if (!contentId) return null;
//     try {
//       const response = await fetch(`${BASE_URL}/content/contents/${contentId}/comments/history/`, {
//         method: "GET",
//         headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
//       });
//       if (!response.ok) throw new Error("Failed to fetch comment history");
//       const data = await response.json();
//       setComments(data.comments);
//       return data;
//     } catch (error) {
//       console.error("Error fetching comment history:", error);
//       return null;
//     }
//   };

//   const addComments = async ({ comment, replyTo }: { comment: string; replyTo?: string | null }) => {
//     const token = localStorage.getItem("accessToken");
//     if (!ContentId) { console.error("No contentId provided"); return; }
//     try {
//       const body: Record<string, string> = { comment_text: comment };
//       if (replyTo) body.reply_to = replyTo;

//       const res = await fetch(`${BASE_URL}/content/contents/${ContentId}/comment/`, {
//         method: "POST",
//         headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
//         body: JSON.stringify(body),
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data?.message || "Failed to add comment");
//       fetchCommentHistory(id);
//       return data;
//     } catch (error: any) {
//       console.error("Add Comment Error:", error.message);
//       throw error;
//     }
//   };

//   const handleAddCommentClick = async () => {
//     if (!newComment.trim()) return;
//     let finalComment = newComment;
//     Object.entries(mentionMap).forEach(([key, value]) => {
//       finalComment = finalComment.replace(key, value);
//     });
//     await addComments({ comment: finalComment });
//     setNewComment("");
//     setMentionMap({});
//   };

//   const handleSaveEdit = async (commentId: string) => {
//     if (!editText.trim()) return;
//     await editComment({ commentId, updatedText: editText });
//     setEditingCommentId(null);
//     setEditText("");
//   };

//   const handleCancelEdit = () => {
//     setEditingCommentId(null);
//     setEditText("");
//   };

//   const handleReplySubmit = async (parentCommentId: string) => {
//     if (!replyText.trim()) return;
//     let finalReply = replyText;
//     Object.entries(replyMentionMap).forEach(([key, value]) => {
//       finalReply = finalReply.replace(key, value);
//     });
//     await addComments({ comment: finalReply, replyTo: parentCommentId });
//     setReplyToCommentId(null);
//     setReplyText("");
//     setReplyMentionMap({});
//   };

//   const getInitials = (name: any) => {
//     return name?.split(" ").map((w: any) => w[0]).join("").slice(0, 2).toUpperCase();
//   };

//   // Separate top-level comments and replies
//   const topLevelComments = comments
//     .filter(c => !c.reply_to)
//     .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

//   const getReplies = (commentId: string) =>
//     comments
//       .filter(c => c.reply_to === commentId)
//       .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

//   useEffect(() => {
//     if (ContentId) fetchCommentHistory(ContentId);
//   }, []);

//   const CommentItem = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => {
//     const replies = getReplies(comment.comment_id);
//     const isEditing = editingCommentId === comment.comment_id;
//     const isReplying = replyToCommentId === comment.comment_id;
//     const menuOpen = openMenuId === comment.comment_id;

//     return (
//       <div className={isReply ? "ml-8 border-l-2 border-gray-200 pl-3" : ""}>
//         <div className="space-y-1">
//           {/* Header row */}
//           <div className="flex items-center justify-between gap-2">
//             <div className="flex items-center gap-2">
//               <Avatar className="w-6 h-6 sm:w-7 sm:h-7">
//                 <AvatarFallback className="bg-gray-200 text-black text-[10px] sm:text-[11px]">
//                   {getInitials(comment.user)}
//                 </AvatarFallback>
//               </Avatar>
//               <div className="flex-1 min-w-0">
//                 <div className="flex items-center gap-2">
//                   <span className="font-semibold text-[11px] sm:text-[12px] text-black">{comment.user}</span>
//                   <Badge variant="outline" className="border-gray-400 px-1 py-0 rounded text-[9px] sm:text-[10px]">
//                     {comment.role}
//                   </Badge>
//                 </div>
//                 <div className="text-[10px] sm:text-[11px] text-gray-600">{formatDateTime(comment.timestamp)}</div>
//               </div>
//             </div>

//             {/* Three-dot menu */}
//             <div className="relative" ref={menuOpen ? menuRef : null}>
//               <button
//                 onClick={() => setOpenMenuId(menuOpen ? null : comment.comment_id)}
//                 className="p-1 rounded hover:bg-gray-100 text-gray-500"
//               >
//                 <MoreVertical className="w-4 h-4" />
//               </button>

//               {menuOpen && (
//                 <div
//                   ref={menuRef}
//                   className="absolute right-0 top-7 z-50 bg-white border border-gray-200 rounded-md shadow-md w-32 text-sm overflow-hidden"
//                 >
//                   {/* Edit */}
//                   <button
//                     className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-50 text-gray-700"
//                     onClick={() => {
//                       setEditingCommentId(comment.comment_id);
//                       setEditText(comment.text);
//                       setOpenMenuId(null);
//                     }}
//                   >
//                     <Pencil className="w-3.5 h-3.5" /> Edit
//                   </button>

//                   {/* Reply (only for top-level) */}
//                   {!isReply && (
//                     <button
//                       className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-50 text-gray-700"
//                       onClick={() => {
//                         setReplyToCommentId(comment.comment_id);
//                         setOpenMenuId(null);
//                       }}
//                     >
//                       <CornerDownRight className="w-3.5 h-3.5" /> Reply
//                     </button>
//                   )}

//                   {/* Delete */}
//                   <button
//                     className="flex items-center gap-2 w-full px-3 py-2 hover:bg-red-50 text-red-600"
//                     onClick={async () => {
//                       setOpenMenuId(null);
//                       await deleteComment(comment.comment_id);
//                     }}
//                   >
//                     <Trash2 className="w-3.5 h-3.5" /> Delete
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Comment body or edit mode */}
//           {isEditing ? (
//             <div className="pl-8 sm:pl-9 space-y-2">
//               <Textarea
//                 value={editText}
//                 onChange={e => setEditText(e.target.value)}
//                 className="border-gray-300 text-sm min-h-[60px]"
//                 autoFocus
//               />
//               <div className="flex gap-2">
//                 <Button
//                   size="sm"
//                   className="bg-[#1a2c47] text-white hover:bg-[#2a3c57] text-xs h-7"
//                   onClick={() => handleSaveEdit(comment.comment_id)}
//                   disabled={!editText.trim()}
//                 >
//                   Save
//                 </Button>
//                 <Button
//                   size="sm"
//                   variant="outline"
//                   className="text-xs h-7"
//                   onClick={handleCancelEdit}
//                 >
//                   Cancel
//                 </Button>
//               </div>
//             </div>
//           ) : (
//             <p className="text-[11px] sm:text-[12px] text-gray-700 leading-relaxed pl-8 sm:pl-9">
//               {renderCommentText(comment.text)}
//             </p>
//           )}

//           {/* Reply input box */}
//           {isReplying && (
//             <div className="pl-8 sm:pl-9 mt-2 space-y-2">
//               <Textarea
//                 placeholder={`Replying to ${comment.user}...`}
//                 value={replyText}
//                 onChange={handleReplyChange}
//                 className="border-gray-300 text-sm min-h-[60px]"
//                 autoFocus
//               />
//               {showReplyDropdown && replyMentionUsers.length > 0 && (
//                 <div className="border bg-white shadow-md rounded mt-1 max-h-40 overflow-y-auto">
//                   {replyMentionUsers.map(user => (
//                     <div
//                       key={user.user_id}
//                       onClick={() => handleSelectReplyUser(user)}
//                       className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
//                     >
//                       {user.full_name}
//                     </div>
//                   ))}
//                 </div>
//               )}
//               <div className="flex gap-2">
//                 <Button
//                   size="sm"
//                   className="bg-[#1a2c47] text-white hover:bg-[#2a3c57] text-xs h-7"
//                   onClick={() => handleReplySubmit(comment.comment_id)}
//                   disabled={!replyText.trim()}
//                 >
//                   <CornerDownRight className="w-3 h-3 mr-1" /> Reply
//                 </Button>
//                 <Button
//                   size="sm"
//                   variant="outline"
//                   className="text-xs h-7"
//                   onClick={() => { setReplyToCommentId(null); setReplyText(""); }}
//                 >
//                   Cancel
//                 </Button>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Nested replies */}
//         {replies.length > 0 && (
//           <div className="mt-2 space-y-2">
//             {replies.map(reply => (
//               <CommentItem key={reply.comment_id} comment={reply} isReply={true} />
//             ))}
//           </div>
//         )}
//       </div>
//     );
//   };

//   return (
//     <div>
//       <div className="flex-1 lg:max-w-md">
//         <Card className="bg-white border border-gray-300 h-[480px] overflow-y-auto">
//           <CardContent className="p-3 sm:p-4 flex flex-col h-full">
//             {/* Add Comment */}
//             <div className="mb-4 sm:mb-6">
//               <Label className="text-[11px] sm:text-[12px] font-semibold text-gray-600 mb-2 block">Add Comment</Label>
//               <div>
//                 <Textarea
//                   placeholder="Leave feedback or suggestions..."
//                   value={newComment}
//                   onChange={handleCommentChange}
//                   className="border-gray-300 mb-2 text-sm min-h-[80px]"
//                 />
//                 {showDropdown && mentionUsers.length > 0 && (
//                   <div className="border bg-white shadow-md rounded mt-1 max-h-40 overflow-y-auto">
//                     {mentionUsers.map(user => (
//                       <div
//                         key={user.user_id}
//                         onClick={() => handleSelectUser(user)}
//                         className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
//                       >
//                         {user.full_name}
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//               <div className="flex justify-end">
//                 <Button
//                   onClick={handleAddCommentClick}
//                   className="bg-[#1a2c47] text-white hover:bg-[#2a3c57] text-sm"
//                   disabled={!newComment.trim()}
//                 >
//                   <MessageSquare className="w-4 h-4 mr-1 sm:mr-2" />
//                   Add Comment
//                 </Button>
//               </div>
//             </div>

//             <h3 className="font-medium text-[13px] sm:text-[14px] text-black mb-4 sm:mb-6">Comments</h3>

//             {/* Comments List */}
//             <div className="space-y-4">
//               {topLevelComments.map(comment => (
//                 <CommentItem key={comment.comment_id} comment={comment} />
//               ))}
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default CommentSection;


import { BASE_URL } from '@/utils/BASE_URL'
import { useState, useEffect, useRef, memo } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, MoreVertical, Pencil, Trash2, CornerDownRight, CheckSquare } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';

type Comment = {
  comment_id: string;
  comment_text: string;
  text: string;
  user: string;
  role: string;
  timestamp: string;
  selected_text: string;
  reply_to: string | null;
  resolved: boolean;
};

type User = {
  user_id: string;
  full_name: string;
  email: string;
};

const renderCommentText = (text: string) => {
  const regex = /@\[(.*?)\]\((.*?)\)/g;
  const parts: (string | React.JSX.Element)[] = [];
  let lastIndex = 0;
  let match;
  while ((match = regex.exec(text)) !== null) {
    const [fullMatch, name, uid] = match;
    parts.push(text.slice(lastIndex, match.index));
    parts.push(
      <span key={uid + match.index} className="text-blue-600 font-medium">
        @{name}
      </span>
    );
    lastIndex = match.index + fullMatch.length;
  }
  parts.push(text.slice(lastIndex));
  return parts;
};

const formatDateTime = (dateString: string) => {
  const normalized =
    dateString.includes('T') || dateString.endsWith('Z')
      ? dateString
      : dateString.replace(' ', 'T') + 'Z';
  return new Date(normalized).toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'medium',
    timeStyle: 'short',
  });
};

const getInitials = (name: string) =>
  name?.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

interface CommentItemProps {
  comment: Comment;
  isReply?: boolean;
  replies: Comment[];
  openMenuId: string | null;
  editingCommentId: string | null;
  editText: string;
  replyToCommentId: string | null;
  replyText: string;
  replyMentionUsers: User[];
  showReplyDropdown: boolean;
  onMenuToggle: (id: string | null) => void;
  onEditStart: (id: string, text: string) => void;
  onEditTextChange: (text: string) => void;
  onEditSave: (id: string) => void;
  onEditCancel: () => void;
  onDelete: (id: string) => void;
  onReplyStart: (id: string) => void;
  onReplyTextChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onReplySelectUser: (user: User) => void;
  onReplySubmit: (parentId: string) => void;
  onReplyCancel: () => void;
  getRepliesFor: (id: string) => Comment[];
  onResolve: (id: string) => void;
}

const CommentItem = memo(({
  comment,
  isReply = false,
  openMenuId,
  editingCommentId,
  editText,
  replyToCommentId,
  replyText,
  replyMentionUsers,
  showReplyDropdown,
  onMenuToggle,
  onEditStart,
  onEditTextChange,
  onEditSave,
  onEditCancel,
  onDelete,
  onReplyStart,
  onReplyTextChange,
  onReplySelectUser,
  onReplySubmit,
  onReplyCancel,
  getRepliesFor,
  onResolve,
}: CommentItemProps) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const replies = getRepliesFor(comment.comment_id);
  const isEditing = editingCommentId === comment.comment_id;
  const isReplying = replyToCommentId === comment.comment_id;
  const menuOpen = openMenuId === comment.comment_id;

  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onMenuToggle(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [menuOpen, onMenuToggle]);

  return (
    <div className={isReply ? 'ml-8 border-l-2 border-gray-200 pl-3' : ''}>
      <div className="space-y-1">
        {/* Header */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Avatar className="w-6 h-6 sm:w-7 sm:h-7">
              <AvatarFallback className="bg-gray-200 text-black text-[10px] sm:text-[11px]">
                {getInitials(comment.user)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[11px] sm:text-[12px] text-black">
                  {comment.user}
                </span>
                <Badge variant="outline" className="border-gray-400 px-1 py-0 rounded text-[9px] sm:text-[10px]">
                  {comment.role}
                </Badge>
              </div>
              <div className="text-[10px] sm:text-[11px] text-gray-600">
                {formatDateTime(comment.timestamp)}
              </div>
            </div>
          </div>

          {/* Three-dot menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => onMenuToggle(menuOpen ? null : comment.comment_id)}
              className="p-1 rounded hover:bg-gray-100 text-gray-500"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-7 z-50 bg-white border border-gray-200 rounded-md shadow-md w-32 text-sm overflow-hidden">
                <button
                  className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-50 text-gray-700"
                  onClick={() => { onEditStart(comment.comment_id, comment.text); onMenuToggle(null); }}
                >
                  <Pencil className="w-3.5 h-3.5" /> Edit
                </button>

                {!isReply && (
                  <button
                    className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-50 text-gray-700"
                    onClick={() => { onReplyStart(comment.comment_id); onMenuToggle(null); }}
                  >
                    <CornerDownRight className="w-3.5 h-3.5" /> Reply
                  </button>
                )}

                <button
                  className="flex items-center gap-2 w-full px-3 py-2 hover:bg-red-50 text-red-600"
                  onClick={() => { onMenuToggle(null); onDelete(comment.comment_id); }}
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Body / edit */}
        {isEditing ? (
          <div className="pl-8 sm:pl-9 space-y-2">
            <Textarea
              value={editText}
              onChange={(e) => onEditTextChange(e.target.value)}
              className="border-gray-300 text-sm min-h-[60px]"
              autoFocus
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                className="bg-[#1a2c47] text-white hover:bg-[#2a3c57] text-xs h-7"
                onClick={() => onEditSave(comment.comment_id)}
                disabled={!editText.trim()}
              >
                Save
              </Button>
              <Button size="sm" variant="outline" className="text-xs h-7" onClick={onEditCancel}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <>
            <p className="text-[11px] sm:text-[12px] text-gray-700 leading-relaxed pl-8 sm:pl-9">
              {renderCommentText(comment.text)}
            </p>
            <div className="pl-8 sm:pl-9 mt-1">
              {comment.resolved ? (
                <Button className="text-[10px] sm:text-[11px] font-semibold text-blue-950 p-0 h-auto"
                  variant="ghost"
                  size="sm">
                  <CheckSquare className="w-3 h-3 mr-1" />
                  Comment resolved
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[10px] sm:text-[11px] font-semibold text-green-600 hover:text-green-800 p-0 h-auto"
                  onClick={() => onResolve(comment.comment_id)}
                >

                  Mark as resolved
                </Button>
              )}
            </div>
          </>


        )}

        {/* Reply input */}
        {isReplying && (
          <div className="pl-8 sm:pl-9 mt-2 space-y-2">
            <Textarea
              placeholder={`Replying to ${comment.user}...`}
              value={replyText}
              onChange={onReplyTextChange}
              className="border-gray-300 text-sm min-h-[60px]"
              autoFocus
            />
            {showReplyDropdown && replyMentionUsers.length > 0 && (
              <div className="border bg-white shadow-md rounded mt-1 max-h-40 overflow-y-auto">
                {replyMentionUsers.map((user) => (
                  <div
                    key={user.user_id}
                    onClick={() => onReplySelectUser(user)}
                    className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
                  >
                    {user.full_name}
                  </div>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <Button
                size="sm"
                className="bg-[#1a2c47] text-white hover:bg-[#2a3c57] text-xs h-7"
                onClick={() => onReplySubmit(comment.comment_id)}
                disabled={!replyText.trim()}
              >
                <CornerDownRight className="w-3 h-3 mr-1" /> Reply
              </Button>
              <Button size="sm" variant="outline" className="text-xs h-7" onClick={onReplyCancel}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Nested replies */}
      {replies.length > 0 && (
        <div className="mt-2 space-y-2">
          {replies.map((reply) => (
            <CommentItem
              key={reply.comment_id}
              comment={reply}
              isReply={true}
              replies={[]}
              openMenuId={openMenuId}
              editingCommentId={editingCommentId}
              editText={editText}
              replyToCommentId={replyToCommentId}
              replyText={replyText}
              replyMentionUsers={replyMentionUsers}
              showReplyDropdown={showReplyDropdown}
              onMenuToggle={onMenuToggle}
              onEditStart={onEditStart}
              onEditTextChange={onEditTextChange}
              onEditSave={onEditSave}
              onEditCancel={onEditCancel}
              onDelete={onDelete}
              onReplyStart={onReplyStart}
              onReplyTextChange={onReplyTextChange}
              onReplySelectUser={onReplySelectUser}
              onReplySubmit={onReplySubmit}
              onReplyCancel={onReplyCancel}
              getRepliesFor={getRepliesFor}
              onResolve={onResolve}
            />
          ))}
        </div>
      )}
    </div>
  );
});

CommentItem.displayName = 'CommentItem';

const CommentSection = ({ id }: { id: string }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [mentionUsers, setMentionUsers] = useState<User[]>([]);
  const [newComment, setNewComment] = useState('');
  const [mentionMap, setMentionMap] = useState<Record<string, string>>({});
  const [showDropdown, setShowDropdown] = useState(false);

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [replyToCommentId, setReplyToCommentId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [replyMentionMap, setReplyMentionMap] = useState<Record<string, string>>({});
  const [replyMentionUsers, setReplyMentionUsers] = useState<User[]>([]);
  const [showReplyDropdown, setShowReplyDropdown] = useState(false);

  const convertBackendToDisplay = (text: string) => {
    return text.replace(/@\[(.*?)\]\((.*?)\)/g, '@$1');
  };

  const fetchCommentHistory = async (contentId: string) => {
    const token = localStorage.getItem('accessToken');
    if (!contentId) return;
    try {
      const res = await fetch(
        `${BASE_URL}/content/contents/${contentId}/comments/history/`,
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
      );
      if (!res.ok) throw new Error('Failed to fetch comment history');
      const data = await res.json();
      console.log(data);
      setComments(data.comments);
    } catch (err) {
      console.error(err);
    }
  };

  const resolveComment = async (commentId: string) => {
    const token = localStorage.getItem("accessToken");

    try {
      const res = await fetch(
        `${BASE_URL}/content/comments/resolve/${commentId}/`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      let data: any = null;

      try {
        data = await res.json();
      } catch {
        data = null;
      }


      if (!res.ok) {
        let errorMessage = "Something went wrong";


        if (data) {
          if (typeof data === "string") {
            errorMessage = data;
          } else if (data.detail) {
            errorMessage = data.detail;
          } else if (data.message) {
            errorMessage = data.message;
          } else if (data.error) {
            errorMessage = data.error;
          } else {
            // Handle validation errors
            const messages: string[] = [];
            Object.values(data).forEach((val: any) => {
              if (Array.isArray(val)) messages.push(...val);
              else if (typeof val === "string") messages.push(val);
            });

            if (messages.length > 0) {
              errorMessage = messages.join(", ");
            }
          }
        }
        if (res.status === 403) {
          errorMessage =
            data?.detail || "You do not have permission to perform this action.";
        }

        if (res.status === 401) {
          errorMessage = "Session expired. Please login again.";
        }

        throw new Error(errorMessage);
      }

      toast.success("Comment resolved successfully");
      fetchCommentHistory(id);

    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Something went wrong");
    }
  };

  const fetchUsers = async (query: string, setter: (u: User[]) => void) => {
    const token = localStorage.getItem('accessToken');
    try {
      const res = await fetch(`${BASE_URL}/accounts/users/search/?q=${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setter(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    const token = localStorage.getItem('accessToken');
    try {
      const res = await fetch(`${BASE_URL}/content/comments/edit/${commentId}/`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        if (res.status === 403) toast.error('You do not have permission to delete this comment');
        else if (res.status === 404) toast.error('Comment not found');
        else toast.error('Failed to delete comment');
        return;
      }
      toast.success('Comment deleted successfully');
      fetchCommentHistory(id);
    } catch {
      toast.error('Something went wrong while deleting comment');
    }
  };

  const handleSaveEdit = async (commentId: string) => {
    if (!editText.trim()) return;
    let final = editText;

    Object.entries(mentionMap).forEach(([k, v]) => {
      final = final.replace(k, v);
    });
    const token = localStorage.getItem('accessToken');
    try {
      const res = await fetch(`${BASE_URL}/content/comments/edit/${commentId}/`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment_text: final }),
      });
      if (!res.ok) {
        if (res.status === 403) toast.error('You do not have permission to edit this comment');
        else toast.error('Failed to update comment');
        return;
      }
      toast.success('Comment updated successfully');
      setEditingCommentId(null);
      setEditText('');
      fetchCommentHistory(id);
    } catch {
      toast.error('Something went wrong while updating comment');
    }
  };

  const addComment = async (comment: string, replyTo?: string | null) => {
    const token = localStorage.getItem('accessToken');

    const body: Record<string, string> = { comment_text: comment };
    if (replyTo) body.reply_to = replyTo;

    try {
      const res = await fetch(`${BASE_URL}/content/contents/${id}/comment/`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      let data: any = null;

      // Safely parse JSON (in case backend fails)
      try {
        data = await res.json();
      } catch {
        data = null;
      }

      if (!res.ok) {
        let errorMessage = "Failed to add comment";

        if (data) {
          if (typeof data === "string") {
            errorMessage = data;
          } else if (data.message) {
            errorMessage = data.message;
          } else if (data.error) {
            errorMessage = data.error;
          } else if (data.detail) {
            errorMessage = data.detail;
          } else {
            // Handle validation errors like { field: ["msg"] }
            const messages: string[] = [];
            Object.values(data).forEach((val: any) => {
              if (Array.isArray(val)) messages.push(...val);
              else if (typeof val === "string") messages.push(val);
            });

            if (messages.length > 0) {
              errorMessage = messages.join(", ");
            }
          }
        }

        throw new Error(errorMessage);
      }

      //  Success
      toast.success("Comment added successfully");
      fetchCommentHistory(id);

    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    }
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setNewComment(value);
    const match = value.match(/@(\w*)$/);
    if (match && match[1].length > 0) {
      setShowDropdown(true);
      fetchUsers(match[1], setMentionUsers);
    } else {
      setShowDropdown(false);
    }
  };

  const handleSelectUser = (user: User) => {
    const display = `@${user.full_name}`;
    const backend = `@[${user.full_name}](${user.user_id})`;
    setMentionMap((p) => ({ ...p, [display]: backend }));
    setNewComment((prev) => prev.replace(/@\w*$/, display + ' '));
    setShowDropdown(false);
  };

  const handleAddCommentClick = async () => {
    if (!newComment.trim()) return;
    let final = newComment;
    Object.entries(mentionMap).forEach(([k, v]) => { final = final.replace(k, v); });
    await addComment(final);
    setNewComment('');
    setMentionMap({});
  };

  const handleReplyTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setReplyText(value);
    const match = value.match(/@(\w*)$/);
    if (match && match[1].length > 0) {
      setShowReplyDropdown(true);
      fetchUsers(match[1], setReplyMentionUsers);
    } else {
      setShowReplyDropdown(false);
    }
  };

  const handleReplySelectUser = (user: User) => {
    const display = `@${user.full_name}`;
    const backend = `@[${user.full_name}](${user.user_id})`;
    setReplyMentionMap((p) => ({ ...p, [display]: backend }));
    setReplyText((prev) => prev.replace(/@\w*$/, display + ' '));
    setShowReplyDropdown(false);
  };

  const handleReplySubmit = async (parentId: string) => {
    if (!replyText.trim()) return;
    let final = replyText;
    Object.entries(replyMentionMap).forEach(([k, v]) => { final = final.replace(k, v); });
    await addComment(final, parentId);
    setReplyToCommentId(null);
    setReplyText('');
    setReplyMentionMap({});
  };

  const getRepliesFor = (commentId: string) =>
    comments
      .filter((c) => c.reply_to === commentId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  const topLevelComments = comments
    .filter((c) => !c.reply_to)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  useEffect(() => { fetchCommentHistory(id); }, []);

  const sharedItemProps = {
    openMenuId,
    editingCommentId,
    editText,
    replyToCommentId,
    replyText,
    replyMentionUsers,
    showReplyDropdown,
    onResolve: resolveComment,
    onMenuToggle: setOpenMenuId,
    onEditStart: (cid: string, text: string) => {
      setEditingCommentId(cid);

      const mentionMap: Record<string, string> = {};

      const displayText = text.replace(/@\[(.*?)\]\((.*?)\)/g, (_, name, id) => {
        const display = `@${name}`;
        const backend = `@[${name}](${id})`;

        mentionMap[display] = backend;
        return display;
      });

      setEditText(displayText);
      setMentionMap(mentionMap);
    },
    onEditTextChange: setEditText,
    onEditSave: handleSaveEdit,
    onEditCancel: () => { setEditingCommentId(null); setEditText(''); },
    onDelete: handleDeleteComment,
    onReplyStart: setReplyToCommentId,
    onReplyTextChange: handleReplyTextChange,
    onReplySelectUser: handleReplySelectUser,
    onReplySubmit: handleReplySubmit,
    onReplyCancel: () => { setReplyToCommentId(null); setReplyText(''); },
    getRepliesFor,
    onResolve: resolveComment
  };

  return (
    <div>
      <div className="flex-1 lg:max-w-md">
        <Card className="bg-white border border-gray-300 h-[480px] overflow-y-auto">
          <CardContent className="p-3 sm:p-4 flex flex-col h-full">
            <div className="mb-4 sm:mb-6">
              <Label className="text-[11px] sm:text-[12px] font-semibold text-gray-600 mb-2 block">
                Add Comment
              </Label>
              <div>
                <Textarea
                  placeholder="Leave feedback or suggestions..."
                  value={newComment}
                  onChange={handleCommentChange}
                  className="border-gray-300 mb-2 text-sm min-h-[80px]"
                />
                {showDropdown && mentionUsers.length > 0 && (
                  <div className="border bg-white shadow-md rounded mt-1 max-h-40 overflow-y-auto">
                    {mentionUsers.map((user) => (
                      <div
                        key={user.user_id}
                        onClick={() => handleSelectUser(user)}
                        className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
                      >
                        {user.full_name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex justify-end">
                <Button
                  onClick={handleAddCommentClick}
                  className="bg-[#1a2c47] text-white hover:bg-[#2a3c57] text-sm"
                  disabled={!newComment.trim()}
                >
                  <MessageSquare className="w-4 h-4 mr-1 sm:mr-2" />
                  Add Comment
                </Button>
              </div>
            </div>

            <h3 className="font-medium text-[13px] sm:text-[14px] text-black mb-4 sm:mb-6">
              Comments
            </h3>

            <div className="space-y-4">
              {topLevelComments.map((comment) => (
                <CommentItem
                  key={comment.comment_id}
                  comment={comment}
                  replies={getRepliesFor(comment.comment_id)}
                  {...sharedItemProps}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CommentSection;