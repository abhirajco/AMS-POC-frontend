import HeaderSection from "@/components/common/HeaderSection"
import { BASE_URL } from "@/utils/BASE_URL";
import { useEffect, useState } from "react";
import { Popover, Box, FormControl, InputLabel, Select, MenuItem, Button, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { getCsrfToken } from "@/utils/csrf";
import { getStatusBadge } from "@/utils/helpers";

const AllCreatedBrief = () => {

    type ContentBrief = {
        form_id: string;
        title: string;
        content_type: string;
        created_by_name: string;
        brief: string;
        created_at: string;
        initiated: boolean;
        // fields present in the list response that we use for prefill
        campaign: string;
        event: string | null;
        sme: string;
        created_by: string;
        content?: string | null;
        content_id?: string | null;
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
    const [contentDetails, setContentDetails] = useState<Record<string, any>>({});
    const navigate = useNavigate();

    const allCreatedBrief = async () => {
        try {
            const res = await fetch(`${BASE_URL}/content/contents/form/`, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": getCsrfToken(),
                },
            })
            const data = await res.json();
            console.log(data.results);
            setAllContentBrief(data.results);
        }
        catch (err) {
            console.error(err);
        }
    }

    // Accept either `content` or `content_id` from the list row.
    const getContentId = (task: ContentBrief) => task.content ?? task.content_id ?? null;

    const fetchParticularContent = async (id: string) => {
        try {
            // NOTE: trailing slash added to match the working endpoints.
            const res = await fetch(`${BASE_URL}/content/contents/${id}/`,
                {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRFToken": getCsrfToken(),
                    },
                }
            )
            if (!res.ok) {
                console.error("fetchParticularContent failed:", res.status, id);
                return;
            }
            const data = await res.json();
            setContentDetails(prev => ({
                ...prev,
                [id]: data
            }));
        }
        catch (err) {
            console.error(err);
        }
    }

    const handleClose = () => {
        setAnchorEl(null);
    };
    const open = Boolean(anchorEl);

    const fetchCampaigns = async () => {
        try {
            const res = await fetch(`${BASE_URL}/board/campaigns/`, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": getCsrfToken(),
                },
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
            const res = await fetch(`${BASE_URL}/board/campaigns/${campaignId}/events/`, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": getCsrfToken(),
                },
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
        try {
            const res = await fetch(`${BASE_URL}/content/contents/exe`, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": getCsrfToken(),
                },
            })
            const data = await res.json();
            setExecutive(data);
        }
        catch (err) {
            console.error(err);
        }
    }

    
    const startWorking = (task: ContentBrief, e: React.MouseEvent<HTMLButtonElement>) => {
        const target = e.currentTarget;

        setTitle(task.title);
        setBrief(task.brief);
        setContentType(task.content_type);
        setSme(task.sme);
        setFormId(task.form_id);
        setCampaignId(task.campaign);
        setEventId(task.event ?? "");
        setExecutiveId(task.created_by ?? "");

        // Open immediately with all prefilled values already in state
        setAnchorEl(target);

        // Fetch events in the background so the Event dropdown options populate
        if (task.campaign) {
            fetchEvents(task.campaign);
        }
    };

    const createContent = async () => {
        try {
            const res1 = await fetch(`${BASE_URL}/content/contents/startFromForm/`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": getCsrfToken(),
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

            let data1: any = {};
            try {
                data1 = await res1.json();
            } catch {
                data1 = {};
            }

            if (!res1.ok) {
                if (res1.status === 401) {
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
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRFToken": getCsrfToken(),
                    },
                    body: JSON.stringify({
                        sme_id: data1.sme_id,
                        executive_id: data1.executive_id,
                    }),
                }
            );

            try {
                await res2.json();
            } catch {
                // ignore non-JSON response body
            }

            if (!res2.ok) {
                if (res2.status === 401) {
                    localStorage.clear();
                    navigate("/login");
                    return;
                }
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

    useEffect(() => {
        allCreatedBrief();
        fetchCampaigns();
        fetchExecutive();
    }, [])

    useEffect(() => {
        allContentBrief.forEach(task => {
            const cid = getContentId(task);
            if (task.initiated && cid && !contentDetails[cid]) {
                fetchParticularContent(cid);
            }
        });
    }, [allContentBrief]);

    return (
        <>
            <HeaderSection />
            <div className="mt-5">
                {
                    allContentBrief.map((task) => {
                        const cid = getContentId(task);
                        return (
                            <div className="my-3 mx-5 border border-gray-300 rounded-md p-3 flex justify-between"
                                key={task.form_id}>
                                <div className="">
                                    <h1>{task.title}</h1>
                                    <p className="my-2 text-gray-500">{task.brief}</p>
                                    <div className="flex">
                                        <p className="mr-3">Created At - {new Date(task.created_at).toLocaleDateString("en-GB")}</p>
                                        <p>Created By - {task.created_by_name}</p>
                                    </div>
                                </div>
                                <div>
                                    {!task.initiated ? (
                                        <button
                                            className="bg-blue-950 text-white px-3 py-1 rounded-sm hover:bg-blue-800"
                                            onClick={(e) => startWorking(task, e)}
                                        >
                                            Start Working
                                        </button>
                                    ) : (
                                        <div>
                                            {cid && contentDetails[cid] ? (
                                                <div className="flex items-center gap-2 flex-shrink-0">
                                                    {getStatusBadge(contentDetails[cid])}
                                                </div>
                                            ) : (
                                                <span>Loading</span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })
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
