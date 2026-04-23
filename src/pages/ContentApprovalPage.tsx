
// const ContentApprovalPage = () => {

// const { id } = useParams();

// const [title, setTitle] = useState("");
// const [body, setBody] = useState("");

// const [rejectOpen, setRejectOpen] = useState(false);
// const [reason, setReason] = useState("");

// const [comment, setComment] = useState("");
// const [comments, setComments] = useState([]);

//   const [mentionUsers, setMentionUsers] = useState([]);
//   const [showDropdown, setShowDropdown] = useState(false);

//   const [anchorEl, setAnchorEl] = useState(null);
//   const [selectedComment, setSelectedComment] = useState(null);

//   const [editingId, setEditingId] = useState(null);
//   const [editText, setEditText] = useState("");

//   const currentUser = JSON.parse(localStorage.getItem("user"));

//   const isOwnComment = (c) => c.user === currentUser?.full_name;


// const fetchContent = async () => {
//   const token = localStorage.getItem("accessToken");

//   const res = await fetch(`${BASE_URL}/content/contents/${id}`, {
//     headers: { Authorization: `Bearer ${token}` },
//   });

//   const data = await res.json();
//   setTitle(data.title);
//   setBody(data.body);
// };

//   const fetchComments = async () => {
//     const token = localStorage.getItem("accessToken");

//     const res = await fetch(
//       `${BASE_URL}/content/contents/${id}/comments/history/`,
//       {
//         headers: { Authorization: `Bearer ${token}` },
//       }
//     );

//     const data = await res.json();
//     setComments(data.comments || []);
//   };

//   useEffect(() => {
//     if (id) {
//       fetchContent();
//       fetchComments();
//     }
//   }, [id]);

//   const rejectContent = async () => {
//   const token = localStorage.getItem("accessToken");

//   try {
//     const res = await fetch(
//       `${BASE_URL}/content/contents/${id}/reject/`,
//       {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           action: "reject",
//           reason: reason,
//         }),
//       }
//     );
//     if (!res.ok) {
//       toast.error("Something went wrong");
//       return;
//     }
//     const data = await res.json();
//     toast.error(data.message || "Rejected successfully");
//     setRejectOpen(false);
//     setReason("");
//   } catch (err) {
//     console.error(err);
//   }
// };

//   const addComment = async () => {
//     const token = localStorage.getItem("accessToken");

//     await fetch(`${BASE_URL}/content/contents/${id}/comment/`, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ comment_text: comment }),
//     });

//     toast.success("Comment added");
//     setComment("");
//     fetchComments();
//   };

//   const handleDelete = async (c) => {
//     if (!window.confirm("Are you sure you want to delete?")) return;

//     const token = localStorage.getItem("accessToken");

//     await fetch(`${BASE_URL}/content/comments/edit/${c.comment_id}/`, {
//       method: "DELETE",
//       headers: { Authorization: `Bearer ${token}` },
//     });

//     toast.success("Deleted");
//     fetchComments();
//   };

//   const saveEdit = async () => {
//     const token = localStorage.getItem("accessToken");

//     await fetch(`${BASE_URL}/content/comments/edit/${editingId}/`, {
//       method: "PATCH",
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ comment_text: editText }),
//     });

//     toast.success("Updated");
//     setEditingId(null);
//     fetchComments();
//   };

//   const fetchUsers = async (query) => {
//     const token = localStorage.getItem("accessToken");

//     const res = await fetch(
//       `${BASE_URL}/accounts/users/search/?q=${query}`,
//       {
//         headers: { Authorization: `Bearer ${token}` },
//       }
//     );

//     const data = await res.json();
//     setMentionUsers(data || []);
//   };

// const handleMenuOpen = (event, c) => {
//   setAnchorEl(event.currentTarget);
//   setSelectedComment(c);
// };

// const handleMenuClose = () => {
//   setAnchorEl(null);
//   setSelectedComment(null);
// };

// const handleApprove = async () => {
//   const token = localStorage.getItem("accessToken");

//   try {
//     const res = await fetch(
//       `${BASE_URL}/content/contents/${id}/approve/`,
//       {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ action: "approve" }),
//       }
//     );

//     const data = await res.json();
//     toast.success(data.message || "Approved successfully");
//   } catch (err) {
//     console.log(err);
//   }
// };

// const publishContent = async () => {
//   const token = localStorage.getItem("accessToken");

//   try {
//     const res = await fetch(
//       `${BASE_URL}/content/contents/${id}/publish/`,
//       {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           action: "publish",
//         }),
//       }
//     );

//     const data = await res.json();

//     if (!res.ok) {
//       throw new Error(data.message || "Publish failed");
//     }

//     console.log(" Publish Success:", data);
//     return data;

//   } catch (err: any) {
//     console.error(" Publish Error:", err.message);
//     // toast.error(err.message || "Something went wrong");
//   }
// };


//   return (
//     <div>
//       <Toaster position="top-right" richColors />
//       <HeaderSection />

//       <Box sx={{ maxWidth: 1100, mx: "auto", mt: 4, p: 3, boxShadow: 3 }}>
//         <TextField
//           label="Title"
//           fullWidth
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           sx={{ mb: 3 }}
//         />

//         <Box sx={{ display: "flex", gap: 2 }}>
//           {/* BODY ONLY */}
//           <Box
//             sx={{ flex: 2, border: "1px solid #ccc", p: 2 }}
//             dangerouslySetInnerHTML={{ __html: body }}
//           />

//           {/* COMMENTS */}
//           <Box sx={{ flex: 1 }}>
//             <TextField
//               fullWidth
//               placeholder="Write comment..."
//               value={comment}
//               onChange={(e) => {
//                 const value = e.target.value;
//                 setComment(value);

//                 const match = value.match(/@(\w*)$/);
//                 if (match) {
//                   fetchUsers(match[1]);
//                   setShowDropdown(true);
//                 } else {
//                   setShowDropdown(false);
//                 }
//               }}
//             />

//             {showDropdown && (
//               <Box sx={{ border: "1px solid #ccc", maxHeight: 150 }}>
//                 {mentionUsers.map((u) => (
//                   <Box
//                     key={u.id}
//                     sx={{ p: 1, cursor: "pointer" }}
//                     onClick={() => {
//                       setComment((prev) =>
//                         prev.replace(
//                           /@\w*$/,
//                           `@[${u.full_name}](${u.id}) `
//                         )
//                       );
//                       setShowDropdown(false);
//                     }}
//                   >
//                     {u.full_name}
//                   </Box>
//                 ))}
//               </Box>
//             )}

//            <Button
//               sx={{ backgroundColor: "#e0e0e0", color: "black" }}
//               onClick={addComment}
//             >
//               Add Comment
//             </Button>

//             {/* COMMENT LIST */}
//             <Box sx={{ mt: 2 }}>
//               {comments.map((c) => (
//                 <Box
//                   key={c.comment_id}
//                   sx={{
//                     border: "1px solid #eee",
//                     p: 1,
//                     mb: 1,
//                     borderRadius: 1,
//                   }}
//                 >
//                   <Box
//                     sx={{
//                       display: "flex",
//                       justifyContent: "space-between",
//                     }}
//                   >
//                     <strong>{c.user}</strong>

//                     {isOwnComment(c) && (
//                       <IconButton
//                         onClick={(e) => handleMenuOpen(e, c)}
//                       >
//                         <MoreVertIcon />
//                       </IconButton>
//                     )}
//                   </Box>

//                   {/* EDIT MODE */}
//                   {editingId === c.comment_id ? (
//                     <>
//                       <TextField
//                         fullWidth
//                         value={editText}
//                         onChange={(e) => setEditText(e.target.value)}
//                         sx={{ mt: 1 }}
//                       />
//                       <Button onClick={saveEdit}>Save</Button>
//                     </>
//                   ) : (
//                     <Box sx={{ mt: 1 }}>{c.text}</Box>
//                   )}
//                 </Box>
//               ))}
//             </Box>
//           </Box>
//         </Box>

//         {/* MENU */}
//         <Menu
//           anchorEl={anchorEl}
//           open={Boolean(anchorEl)}
//           onClose={handleMenuClose}
//         >
//           <MenuItem
//             onClick={() => {
//               setEditingId(selectedComment.comment_id);
//               setEditText(selectedComment.text);
//               handleMenuClose();
//             }}
//           >
//             Edit
//           </MenuItem>

//           <MenuItem
//             onClick={() => {
//               handleDelete(selectedComment);
//               handleMenuClose();
//             }}
//           >
//             Delete
//           </MenuItem>
//         </Menu>

//         {/* ACTIONS */}
//         <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
//           <Button
//             variant="contained"
//             sx={{ backgroundColor: "#0d47a1" }}
//             onClick={handleApprove}
//           >
//             Approved
//           </Button>

//           <Button
//             variant="contained"
//             sx={{ backgroundColor: "", color: "black" }}
//             onClick={() => setRejectOpen(true)}
//           >
//             Rejected
//           </Button>

//            <Button
//             variant="contained"
//             sx={{ backgroundColor: "#0d47a1" }}
//             onClick={publishContent}
//           >
//             Publish
//           </Button>

//         </Box>
//       </Box>

//       {/* REJECT DIALOG */}
//       <Dialog open={rejectOpen} onClose={() => setRejectOpen(false)}>
//         <DialogTitle>Reject Reason</DialogTitle>
//         <DialogContent>
//           <TextField
//             fullWidth
//             value={reason}
//             onChange={(e) => setReason(e.target.value)}
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setRejectOpen(false)}>Cancel</Button>
//           <Button onClick={rejectContent} variant="contained">
//              Submit
//            </Button>
//         </DialogActions>
//       </Dialog>
//     </div>
//   );
// };

// export default ContentApprovalPage;

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

const ContentApprovalPage = () => {

  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [rejectOpen, setRejectOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);


  const rejectContent = async () => {
    const token = localStorage.getItem("accessToken");

    try {
      const res = await fetch(
        `${BASE_URL}/content/contents/${id}/reject/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "reject",
            reason: reason,
          }),
        }
      );
      if (!res.ok) {
        toast.error("Something went wrong");
        return;
      }
      const data = await res.json();
      toast.error(data.message || "Rejected successfully");
      setRejectOpen(false);
      setReason("");
    } catch (err) {
      console.error(err);
    }
  };

  // const handleApprove = async () => {
  //   const token = localStorage.getItem("accessToken");

  //   try {
  //     const res = await fetch(
  //       `${BASE_URL}/content/contents/${id}/approve/`,
  //       {
  //         method: "POST",
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({ action: "approve" }),
  //       }
  //     );

  //     const data = await res.json();
  //     toast.success(data.message || "Approved successfully");
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };
  const handleApprove = async () => {
  const token = localStorage.getItem("accessToken");

  try {
    const res = await fetch(
      `${BASE_URL}/content/contents/${id}/approve/`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "approve" }),
      }
    );

    const data = await res.json();

    if (res.ok) {
      toast.success(data.message || "Approved successfully");
    } else {
      const errorMessage =
        data?.error || data?.message || "Something went wrong";

      toast.error(errorMessage);
      console.error("API Error:", data);
    }
  } catch (err) {
    console.error("Network Error:", err);
    toast.error("Network error. Please try again.");
  }
};

  const fetchContent = async () => {
    const token = localStorage.getItem("accessToken");

    const res = await fetch(`${BASE_URL}/content/contents/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    setTitle(data.title);
    setBody(data.body);
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
                  onClick={handleApprove}
                  className="flex items-center bg-[#1a2c47] text-white hover:bg-[#2a3c57] text-sm py-2 px-3 border rounded-sm"
                >
                  <CheckSquare className="w-4 h-4 mr-2" />
                  Approve Content
                </button>

                <button
                  onClick={() => setRejectOpen(true)}
                  className="border border-red-300 text-red-600 hover:bg-red-50 text-sm py-2 px-4 rounded-sm"
                >
                  Reject Content
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
      <Dialog open={rejectOpen} onClose={() => setRejectOpen(false)}>
        <DialogTitle>Reject Reason</DialogTitle>

        <DialogContent>
          <TextField
            fullWidth
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter reason..."
          />
        </DialogContent>

        <DialogActions>
          <button className="mr-4" onClick={() => setRejectOpen(false)}>Cancel</button>
          <button className="text-white text-sm bg-blue-950 hover:bg-blue-900 border rounded-sm px-3 py-1" onClick={rejectContent}>
            Submit
          </button>
        </DialogActions>
      </Dialog>
    </>
  );

}

export default ContentApprovalPage;