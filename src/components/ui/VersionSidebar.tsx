import { useState } from "react";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { BASE_URL } from "@/utils/BASE_URL";
import { useEffect } from "react";
import { getCsrfToken } from "@/utils/csrf";

type Props = {
  allContent: any;
  onSelect: (contentId: string, versionId?: string,) => void;
  refreshKey: number;
};

const VersionSidebar = ({ allContent, onSelect, refreshKey }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [versions, setVersions] = useState<Record<string, any[]>>({});

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

  // dropdown data
  const [, setCampaigns] = useState<any[]>([]);
  const [, setExecutives] = useState<any[]>([]);
  console.log(allContent)

  // const fetchCampaigns = async () => {
  //   const token = localStorage.getItem("accessToken");
  //   const res = await fetch(`${BASE_URL}/board/campaigns/`, {
  //     headers: { Authorization: `Bearer ${token}` },
  //   });
  //   const data = await res.json();
  //   setCampaigns(data);
  // };


const fetchCampaigns = async () => {
  try {
    const response = await fetch(`${BASE_URL}/board/campaigns/`, {
      method: "GET",
      credentials: "include",
      headers:
      {
        "Content-Type": "application/json",
        "X-CSRFToken": getCsrfToken(),
      },
    });

    if (response.status === 401) {
      localStorage.clear();
      window.location.href = "/login";
      throw new Error("Session expired. Please login again.");
    }

    if (response.status === 403) {
      throw new Error("You are not authorized to view campaigns.");
    }

    if (response.status >= 500) {
      throw new Error("Internal server error. Please try again later.");
    }

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(
        errorMessage ||
          `Failed to fetch campaigns. Status: ${response.status}`
      );
    }

    const data = await response.json();
    setCampaigns(data);
  } catch (error) {
    console.error("Error fetching campaigns:", error);
  }
};

  // const fetchExecutives = async () => {
  //   const token = localStorage.getItem("accessToken");
  //   const res = await fetch(`${BASE_URL}/content/contents/exe`, {
  //     headers: { Authorization: `Bearer ${token}` },
  //   });
  //   const data = await res.json();
  //   setExecutives(data);
  // };


  const fetchExecutives = async () => {
  try {
    const response = await fetch(`${BASE_URL}/content/contents/exe`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCsrfToken(),
      },
    });

    if (response.status === 401) {
      localStorage.clear();
      window.location.href = "/login";
      throw new Error("Session expired. Please login again.");
    }

    if (response.status === 403) {
      throw new Error("You are not authorized to view executives.");
    }

    if (response.status >= 500) {
      throw new Error("Internal server error. Please try again later.");
    }

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(
        errorMessage ||
          `Failed to fetch executives. Status: ${response.status}`
      );
    }

    const data = await response.json();
    setExecutives(data);
  } catch (error) {
    console.error("Error fetching executives:", error);
  }
};

  // const fetchAllVersion = async (contentId: string) => {
  //   const token = localStorage.getItem("accessToken");

  //   try {
  //     const res = await fetch(
  //       `${BASE_URL}/content/contents/${contentId}/history/`,
  //       {
  //         headers: { Authorization: `Bearer ${token}` },
  //       }
  //     );

  //     const data = await res.json();
  //     console.log(data);
  //     setVersions((prev) => ({
  //       ...prev,
  //       [contentId]: data.history || [],
  //     }));
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  const fetchAllVersion = async (contentId: string) => {
  try {
    const response = await fetch(
      `${BASE_URL}/content/contents/${contentId}/history/`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCsrfToken(),
        },
      }
    );

    if (response.status === 401) {
      localStorage.clear();
      window.location.href = "/login";
      throw new Error("Session expired. Please login again.");
    }

    if (response.status === 403) {
      throw new Error("You are not authorized to view version history.");
    }

    if (response.status >= 500) {
      throw new Error("Internal server error. Please try again later.");
    }

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(
        errorMessage ||
          `Failed to fetch version history. Status: ${response.status}`
      );
    }

    const data = await response.json();

    setVersions((prev) => ({
      ...prev,
      [contentId]: data.history || [],
    }));
  } catch (error) {
    console.error("Error fetching version history:", error);
  }
};

  const handleClick = async (contentId: string) => {
    // toggle dropdown
    if (expandedId === contentId) {
      setExpandedId(null);
      return;
    }

    setExpandedId(contentId);

    // fetch only once
    if (!versions[contentId]) {
      await fetchAllVersion(contentId);
    }
  };

  useEffect(() => {
    fetchCampaigns();
    fetchExecutives();
  }, []);

  useEffect(() => {
    if (expandedId) {
      fetchAllVersion(expandedId);
    }
  }, [refreshKey]);

  // return (
  //   <div
  //     className={`h-[550px] transition-all duration-300 overflow-y-auto border border-gray-200 rounded-sm mx-2 ${isOpen ? "w-96 p-2" : "w-12 p-1"
  //       }`}
  //   >
  //     <div className="flex items-center gap-2 border-b py-2">
  //       <button
  //         onClick={() => setIsOpen(!isOpen)}
  //         className="p-1 hover:bg-gray-200 rounded"
  //       >
  //         {isOpen ? <ArrowRightIcon /> : <ArrowLeftIcon />}
  //       </button>

  //       {isOpen && <h1 className="font-bold">Content versions</h1>}
  //     </div>

  //     {isOpen && (
  //       <div className="flex flex-col mt-3">
  //         <button
  //           className="bg-blue-950 flex py-1 px-3 rounded-sm text-white justify-center mx-3"
  //           onClick={handleOpen}
  //         >
  //           + New Content
  //         </button>

  //         <div className="mt-2">
  //           {allContent.map((items) => {
  //             const isExpanded = expandedId === items.content_id;
  //             const history = versions[items.content_id];

  //             return (
  //               <div key={items.content_id} className="mb-2">
  //                 {/* TITLE */}
  //                 <div
  //                   className="flex items-center gap-2 cursor-pointer hover:bg-gray-200 p-1 rounded"
  //                   //onClick={() => handleClick(items.content_id)}
  //                   onClick={() => {
  //                     handleClick(items.content_id);
  //                     onSelect(items.content_id);
  //                   }}
  //                 >
  //                   {isExpanded ? (
  //                     <KeyboardArrowDownIcon fontSize="small" />
  //                   ) : (
  //                     <ArrowForwardIosIcon fontSize="small" />
  //                   )}

  //                   <h1>{items.title}</h1>
  //                 </div>

  //                 {isExpanded && (
  //                   <div className="ml-6 mt-1">
  //                     {!history ? (
  //                       <p className="text-gray-400 text-sm">Loading...</p>
  //                     ) : history.length === 0 ? (
  //                       <p className="text-gray-400 text-sm">
  //                         No version created
  //                       </p>
  //                     ) : (
  //                       history.map((ver) => (
  //                         <div
  //                           key={ver.version_id}
  //                           className="text-sm border-b py-1 cursor-pointer hover:bg-gray-200 p-2 rounded-sm"
  //                           onClick={() => onSelect(items.content_id, ver.version_id)}
  //                         >
  //                           <p>{ver.title}</p>
  //                           <p className="text-xs text-gray-400">
  //                             {new Date(ver.timestamp).toLocaleString("en-IN")}
  //                           </p>
  //                         </div>
  //                       ))
  //                     )}
  //                   </div>
  //                 )}
  //               </div>
  //             );
  //           })}
  //         </div>
  //       </div>
  //     )}
  //     <Popover
  //       open={open}
  //       anchorEl={anchorEl}
  //       onClose={handleClose}
  //       anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
  //     >
  //       <Box
  //         sx={{
  //           p: 2,
  //           width: 300,
  //           display: "flex",
  //           flexDirection: "column",
  //           gap: 2,
  //         }}
  //       >
  //         {/* Title */}
  //         <TextField
  //           label="Title"
  //           size="small"
  //           value={title}
  //           onChange={(e) => setTitle(e.target.value)}
  //         />

  //         {/* Brief */}
  //         <TextField
  //           label="Brief"
  //           size="small"
  //           multiline
  //           rows={2}
  //           value={brief}
  //           onChange={(e) => setBrief(e.target.value)}
  //         />

  //         {/* Campaign */}
  //         <FormControl fullWidth size="small">
  //           <InputLabel>Campaign</InputLabel>
  //           <Select
  //             value={campaignId}
  //             label="Campaign"
  //             onChange={(e) => {
  //               const id = e.target.value;
  //               setCampaignId(id);
  //               fetchEvents(id);
  //             }}
  //           >
  //             {campaigns.map((c) => (
  //               <MenuItem key={c.campaign_id} value={c.campaign_id}>
  //                 {c.title}
  //               </MenuItem>
  //             ))}
  //           </Select>
  //         </FormControl>

  //         {/* Event */}
  //         <FormControl fullWidth size="small">
  //           <InputLabel>Event</InputLabel>
  //           <Select
  //             value={eventId}
  //             label="Event"
  //             onChange={(e) => setEventId(e.target.value)}
  //           >
  //             {events.map((ev) => (
  //               <MenuItem key={ev.event_id} value={ev.event_id}>
  //                 {ev.title}
  //               </MenuItem>
  //             ))}
  //           </Select>
  //         </FormControl>

  //         {/* Executive */}
  //         <FormControl fullWidth size="small">
  //           <InputLabel>Executive</InputLabel>
  //           <Select
  //             value={executiveId}
  //             label="Executive"
  //             onChange={(e) => setExecutiveId(e.target.value)}
  //           >
  //             {executives.map((ex) => (
  //               <MenuItem key={ex.user_id} value={ex.user_id}>
  //                 {ex.full_name}
  //               </MenuItem>
  //             ))}
  //           </Select>
  //         </FormControl>

  //         {/* Content Type */}
  //         <FormControl fullWidth size="small">
  //           <InputLabel>Content Type</InputLabel>
  //           <Select
  //             value={contentType}
  //             label="Content Type"
  //             onChange={(e) => setContentType(e.target.value)}
  //           >
  //             {[
  //               "Use Case",
  //               "Video",
  //               "Blog",
  //               "Case Study",
  //               "Webinar",
  //               "Whitepaper",
  //               "E-book",
  //             ].map((type) => (
  //               <MenuItem key={type} value={type}>
  //                 {type}
  //               </MenuItem>
  //             ))}
  //           </Select>
  //         </FormControl>

  //         {/* Tags */}
  //         <TextField
  //           label="Tags"
  //           size="small"
  //           value={tags}
  //           onChange={(e) => setTags(e.target.value)}
  //         />

  //         {/* Submit */}
  //        <Button
  //         variant="contained"
  //         onClick={createNewContent}
  //        >
  //          Create
  //       </Button>
  //       </Box>
  //     </Popover>
  //   </div>
  // );
  return (
    <div
      className={`h-[550px] transition-all duration-300 overflow-y-auto border border-gray-200 rounded-sm mx-2 ${isOpen ? "w-96 p-2" : "w-12 p-1"
        }`}
    >
      {/* Header */}
      <div className="flex items-center gap-2 border-b py-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1 hover:bg-gray-200 rounded"
        >
          {isOpen ? <ArrowRightIcon /> : <ArrowLeftIcon />}
        </button>

        {isOpen && <h1 className="font-bold">Content versions</h1>}
      </div>

      {/* Content List */}
      {isOpen && allContent && (
        <div className="flex flex-col mt-3">
          <div className="mt-2">
            {(() => {
              const isExpanded = expandedId === allContent.content_id;
              const history = versions[allContent.content_id];

              return (
                <div key={allContent.content_id} className="mb-2">
                  {/* TITLE */}
                  <div
                    className="flex items-center gap-2 cursor-pointer hover:bg-gray-200 p-1 rounded"
                    onClick={() => {
                      handleClick(allContent.content_id);
                      onSelect(allContent.content_id);
                    }}
                  >
                    {isExpanded ? (
                      <KeyboardArrowDownIcon fontSize="small" />
                    ) : (
                      <ArrowForwardIosIcon fontSize="small" />
                    )}

                    <h1 className="text-sm">{allContent.title}</h1>
                  </div>

                  {/* VERSIONS */}
                  {isExpanded && (
                    <div className="ml-6 mt-1">
                      {!history ? (
                        <p className="text-gray-400 text-sm">Loading...</p>
                      ) : history.length === 0 ? (
                        <p className="text-gray-400 text-sm">
                          No version created
                        </p>
                      ) : (
                        history.map((ver) => (
                          <div
                            key={ver.version_id}
                            className="text-sm border-b py-1 cursor-pointer hover:bg-gray-200 p-2 rounded-sm"
                            onClick={() =>
                              onSelect(allContent.content_id, ver.version_id)
                            }
                          >
                            <p>{ver.title}</p>
                            <p className="text-xs text-gray-400">
                              {formatDateTime(ver.timestamp)}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

export default VersionSidebar;