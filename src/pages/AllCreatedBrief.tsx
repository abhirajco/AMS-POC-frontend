import HeaderSection from "@/components/common/HeaderSection"
import { BASE_URL } from "@/utils/BASE_URL";
import { useEffect, useState } from "react";
import { Popover, Box, FormControl, InputLabel, Select, MenuItem, Button, Typography, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { getStatusBadge, normalizeStatus } from "@/utils/helpers";
import { toast } from "sonner";

const AllCreatedBrief = () => {
    type ContentBrief = {
        form_id: string;
        title: string;
        content_type: string;
        created_by_name: string;
        brief: string;
        created_at: string;
        initiated: boolean;

    };
    type Campaign = {
        campaign_id: string;
        title: string;
    };

    type Event = {
        event_id: string;
        title: string;
    };

    type Executive = {
        user_id: string;
        full_name: string;
    }

    const [allContentBrief, setAllContentBrief] = useState<ContentBrief[]>([]);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [formData, setFormData] = useState({
        campaign: "",
        event: "",
        executive: ""
    });
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [eventsWrtContent, setEventWrtContent] = useState<Event[]>([]);
    const [campaignId, setCampaignId] = useState("");
    const [eventId, setEventId] = useState("");
    const [executiveId, setExecutiveId] = useState("");
    const [executive, setExecutive] = useState<Executive[]>([]);
    const [tags, setTags] = useState("");
    const [contentType, setContentType] = useState("");
    const [title, setTitle] = useState("");
    const [brief, setBrief] = useState("");
    const [sme, setSme] = useState("");
    const [formId, setFormId] = useState("");
    const [contentDetails, setContentDetails] = useState({});
    const navigate = useNavigate();

    const allCreatedBrief = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            const res = await fetch(`${BASE_URL}/content/contents/form/`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            const data = await res.json();
            console.log(data.results);
            setAllContentBrief(data.results);
            // fetchParticularContent(data.)
            //console.log(allContentBrief);
        }
        catch (err) {
            console.error(err);
        }
    }

  const getStatusBadge = (item: any) => {
          const normalizedStatus = normalizeStatus(item?.status);
          switch (normalizedStatus) {
              case 'draft':
                  return <Badge variant="secondary" className="bg-gray-100 text-black">Draft</Badge>;
              case 'in_review':
                  return <Badge className="bg-blue-600 text-white">In review</Badge>;
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

    const fetchParticularContent = async (id) => {
        try {
            const token = localStorage.getItem("accessToken");
            const res = await fetch(`${BASE_URL}/content/contents/${id}`,
                {
                    method: "GET",
                    headers: { Authorization: `Bearer ${token}` }
                }
            )
            const data = await res.json();
            setContentDetails(prev => ({
                ...prev,
                [id]: data
            }));
            console.log(data);
        }
        catch (err) {
            console.error(err);
        }
    }

    const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    const open = Boolean(anchorEl);

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value
        }));
    };

    const fetchCampaigns = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            const res = await fetch(`${BASE_URL}/board/campaigns/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error("Something went wrong");
            }

            setCampaigns(data);
        }
        catch (err) {
            console.error(err);
        }

    };

    const fetchEvents = async (campaignId: string) => {
        try {
            const token = localStorage.getItem("accessToken");
            const res = await fetch(
                `${BASE_URL}/board/campaigns/${campaignId}/events/`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            const data = await res.json();
            setEventWrtContent(data.events);
        }
        catch (err) {
            console.error(err);
        }
    };

    const fetchExecutive = async () => {
        const token = localStorage.getItem("accessToken");
        try {
            const res = await fetch(`${BASE_URL}/content/contents/exe`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            const data = await res.json();
            setExecutive(data);
        }
        catch (err) {
            console.error(err);
        }
    }

    // const createContent = async () => {
    //     const token = localStorage.getItem("accessToken");

    //     try {
    //         const res1 = await fetch(`${BASE_URL}/content/contents/startFromForm/`, {
    //             method: "POST",
    //             headers: {
    //                 Authorization: `Bearer ${token}`,
    //                 "Content-Type": "application/json",
    //             },
    //             body: JSON.stringify({
    //                 title,
    //                 brief,
    //                 content_type: contentType,
    //                 campaign_id: campaignId,
    //                 sme_id: sme,
    //                 ...(eventId && { event_id: eventId }),
    //                 tags,
    //                 created_by: executiveId,
    //                 form_id: formId
    //             }),
    //         });

    //         const data1 = await res1.json();

    //         if (!res1.ok) {
    //             throw new Error(data1.message || "Failed to create content");
    //         }

    //         console.log("Content Created:", data1);

    //         const res2 = await fetch(
    //             `${BASE_URL}/content/contents/${data1.content_id}/assign-sme/`,
    //             {
    //                 method: "POST",
    //                 headers: {
    //                     Authorization: `Bearer ${token}`,
    //                     "Content-Type": "application/json",
    //                 },
    //                 body: JSON.stringify({
    //                     sme_id: data1.sme_id,
    //                     executive_id: data1.executive_id,
    //                 }),
    //             }
    //         );

    //         const data2 = await res2.json();

    //         if (!res2.ok) {
    //             throw new Error(data2.message || "Failed to assign SME");
    //         }

    //         console.log("SME Assigned:", data2);

    //         navigate("/generate-new-content", {
    //             state: {
    //                 contentId: data1.content_id,
    //                 title,
    //                 brief,
    //                 contentType,
    //             },
    //         });

    //     } catch (err) {
    //         console.error("ERROR:", err);
    //     }
    // };


const createContent = async () => {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    localStorage.clear();
    navigate("/login");
    return;
  }

  try {
    const res1 = await fetch(`${BASE_URL}/content/contents/startFromForm/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        brief,
        content_type: contentType,
        campaign_id: campaignId,
        sme_id: sme,
        ...(eventId && { event_id: eventId }),
        tags,
        created_by: executiveId,
        form_id: formId,
      }),
    });

    let data1 = {};
    try {
      data1 = await res1.json();
    } catch {
      data1 = {};
    }

    if (!res1.ok) {
      if (res1.status === 401) {
        //toast.error("Session expired. Please login again.");
        localStorage.clear();
        navigate("/login");
        return;
      }

      if (res1.status === 403) {
        toast.error(data1.message || "You are not authorized to create content.");
        return;
      }

    }

    if (!data1?.content_id) {
      toast.error("Invalid response from server.");
      return;
    }

    const res2 = await fetch(
      `${BASE_URL}/content/contents/${data1.content_id}/assign-sme/`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sme_id: data1.sme_id,
          executive_id: data1.executive_id,
        }),
      }
    );

    let data2 = {};
    try {
      data2 = await res2.json();
    } catch {
      data2 = {};
    }

    if (!res2.ok) {
      if (res2.status === 401) {
       // toast.error("Session expired. Please login again.");
        localStorage.clear();
        navigate("/login");
        return;
      }

    //   if (res2.status === 403) {
    //     toast.error("You are not authorized to assign SME.");
    //     return;
    //   }

     // toast.error(data2?.message || "Failed to assign SME.");
     // return;
    }

    toast.success("Content created successfully ");

    navigate("/generate-new-content", {
      state: {
        contentId: data1.content_id,
        title,
        brief,
        contentType,
      },
    });

  } catch (err) {
    console.error("ERROR:", err);
  }
};

    const fetchParticularContentBrief = async (id: string) => {
        const token = localStorage.getItem("accessToken");

        try {
            const res = await fetch(
                `${BASE_URL}/content/contents/particularForm/${id}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            const data = await res.json();
            console.log(data);

            if (!res.ok) {
                throw new Error(data.message || "Failed to fetch");
            }


            setTitle(data.title);
            setBrief(data.brief);
            setContentType(data.content_type);
            setCampaignId(data.campaign);
            setSme(data.sme);
            setFormId(data.form_id);

            await fetchEvents(data.campaign);

            setEventId(data.event);
            setExecutiveId(data.created_by);

            return data;

        } catch (err) {
            console.error("ERROR:", err);
        }
    };


    useEffect(() => {
        allCreatedBrief();
        fetchCampaigns();
        fetchExecutive();
    }, [])

    useEffect(() => {
        allContentBrief.forEach(task => {
            if (
                task.initiated &&
                task.content &&
                !contentDetails[task.content]
            ) {
                fetchParticularContent(task.content);
            }
        });
    }, [allContentBrief]);

    return (
        <>
            <HeaderSection />
            <div className="mt-5">
                {
                    allContentBrief.map((task) => (
                        <div className="my-3 mx-5 border border-gray-300 rounded-md p-3 flex justify-between"
                            key={task.form_id} onClick={() => { fetchParticularContentBrief(task.form_id) }} >
                            <div className="">
                                <h1>{task.title}</h1>
                                <p className="my-2 text-gray-500">{task.brief}</p>
                                <div className="flex">
                                    <p className="mr-3">Created At - {new Date(task.created_at).toLocaleDateString("en-GB")}</p>
                                    <p>Created By - {task.created_by_name}</p>
                                </div>
                            </div>
                            <div>
                                {/* {task.initiated ? ("") :
                                    (<button
                                        className="bg-blue-950 text-white px-3 py-1 rounded-sm hover:bg-blue-800"
                                        onClick={handleOpen}
                                    >
                                        Start Working
                                    </button>)
                                } */}
                                {!task.initiated ? (
                                    <button className="bg-blue-950 text-white px-3 py-1 rounded-sm hover:bg-blue-800"
                                        onClick={handleOpen}>Start Working</button>
                                ) : (
                                    <div>
                                        {contentDetails[task.content] ? (
                                            <div className="flex items-center gap-2 flex-shrink-0">
                                            {getStatusBadge(contentDetails[task.content])}
                                            </div>
                                        ) : (
                                            <span>Loading</span>
                                        )}
                                    </div>
                                )}

                            </div>
                        </div>
                    )
                    )
                }

                <Popover
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: "center",
                        horizontal: "left"
                    }}
                    transformOrigin={{
                        vertical: "center",
                        horizontal: "right"
                    }}
                >
                    <Box
                        sx={{
                            p: 2,
                            width: 260,
                            display: "flex",
                            flexDirection: "column",
                            gap: 2
                        }}
                    >

                        {/* Campaign */}
                        <FormControl fullWidth size="small">
                            <InputLabel>Campaign</InputLabel>
                            <Select
                                value={campaignId}
                                label="Campaign"
                                onChange={(e) => {
                                    const selectedId = e.target.value;
                                    setCampaignId(selectedId);
                                    fetchEvents(selectedId);
                                }}
                            >
                                {campaigns.map((camp) => (
                                    <MenuItem key={camp.campaign_id} value={camp.campaign_id}>
                                        {camp.title}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {/* Event */}
                        <FormControl fullWidth size="small">
                            <InputLabel>Event</InputLabel>
                            <Select
                                value={eventId}
                                label="Event"
                                onChange={(e) => setEventId(e.target.value)}
                            >
                                {eventsWrtContent.map((event) => (
                                    <MenuItem key={event.event_id} value={event.event_id}>
                                        {event.title}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {/* Executive */}
                        <FormControl fullWidth size="small">
                            <InputLabel>Executive</InputLabel>
                            <Select
                                value={executiveId}
                                label="Executive"
                                onChange={(e) => setExecutiveId(e.target.value)}
                            >
                                {executive.map((exe) => (
                                    <MenuItem key={exe.user_id} value={exe.user_id}>
                                        {exe.full_name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {/* Tags */}
                        <TextField
                            fullWidth
                            size="small"
                            label="Tags"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                        />

                        {/* Button */}
                        <Button
                            fullWidth
                            variant="contained"
                            sx={{
                                mt: 1,
                                textTransform: "none",
                                backgroundColor: "#1e3a8a",
                                "&:hover": {
                                    backgroundColor: "#1e40af"
                                }
                            }}
                            onClick={() => {
                                //  console.log({ campaignId, eventId, executiveId, tags });
                                handleClose();
                                createContent();
                            }}
                        >
                            Submit
                        </Button>

                    </Box>
                </Popover>
            </div>
        </>
    )
}

export default AllCreatedBrief;
