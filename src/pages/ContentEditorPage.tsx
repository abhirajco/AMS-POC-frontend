import HeaderSection from "@/components/common/HeaderSection"
import { useEffect, useState } from "react"
import TextEditor from "@/components/ui/TextEditor"
import { useParams } from "react-router-dom"
import { BASE_URL } from "@/utils/BASE_URL"
import { Card, CardContent } from "../components/ui/card";
import CommentSection from "@/components/ui/CommentSection"
import { toast } from "sonner"
import VersionSidebar from "@/components/ui/VersionSidebar"

const ContentEditorPage = () => {

  const { id } = useParams<{ id: string }>();
  const [contentTitle, setContentTitle] = useState<string>("");
  const [contentBody, setContentBody] = useState<string>("");
  const [contentId, setContentId] = useState("");
  const [status, setStatus] = useState("");
  const [internalApproval, setInternalApproval] = useState(false);
  const [marketingApproval, setMarketingApproval] = useState(false);
  const [stakeholderApproval, setStakeholderApproval] = useState(false);
  const [refreshVersionsKey, setRefreshVersionsKey] = useState(0);
  const [allContent, setAllContent] = useState([]);


  type HistoryItem = {
    history_id: string;
    action_type: string;
    performed_by_name: string;
    note: string | null;
    timestamp: string;
  };

  const [history, setHistory] = useState<HistoryItem[]>([]);

  const approvalLabels = [];

  if (internalApproval) approvalLabels.push("Internal Member");
  if (marketingApproval) approvalLabels.push("Marketing");
  if (stakeholderApproval) approvalLabels.push("Stakeholder");

  const approvalCount =
    (internalApproval ? 1 : 0) +
    (marketingApproval ? 1 : 0) +
    (stakeholderApproval ? 1 : 0);

  let progressPercent = 0;


  if (status === "draft" || status === "rejected") {
    progressPercent = 0;
  }
  else if (status === "in_review") {
    progressPercent = 33;
    progressPercent += (approvalCount / 3) * 33;
  }
  else if (status === "approved") {
    progressPercent = 66;
  }
  else if (status === "published") {
    progressPercent = 100;
  }

  let tooltipText = "Draft";

  if (status === "in_review") {
    if (approvalLabels.length === 0) {
      tooltipText = "In Review (No approvals yet)";
    } else {
      tooltipText = `Approved by ${approvalLabels.join(", ")}`;
    }
  }

  else if (status === "approved") {
    tooltipText = `Approved by ${approvalLabels.join(", ")}`;
  }

  else if (status === "published") {
    tooltipText = "Published";
  }


  const fetchContentHistory = async (id: string) => {
    const token = localStorage.getItem("accessToken");

    try {
      const response = await fetch(
        `${BASE_URL}/content/contents/${id}/history2/`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setHistory(data.history);
      console.log(data.history);
    } catch (error) {
      console.error("Failed to fetch content history:", error);
      return null;
    }
  };

  const handleSubmitContent = async () => {
    const token = localStorage.getItem("accessToken");

    if (!contentId) {
      toast.error("No content selected");
      return;
    }

    try {
      //SAVE
      const saveRes = await fetch(`${BASE_URL}/content/contents/save/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content_id: contentId,
          title: contentTitle,
          body: contentBody,
        }),
      });
      // console.log(contentId, selectedTitle, selectedBody);

      const saveData = await saveRes.json();

      if (!saveRes.ok) {
        throw new Error(saveData.message || "Save failed");
      }

      console.log("SAVE SUCCESS");

      //  STEP 2: SUBMIT (only if save success)
      const submitRes = await fetch(`${BASE_URL}/content/contents/submit/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content_id: contentId,
        }),
      });

      const submitData = await submitRes.json();

      if (!submitRes.ok) {
        throw new Error(submitData.message || "Submit failed");
      }

      console.log("SUBMIT SUCCESS");
      setContentBody("");
      setContentTitle("");
      toast.success("Content submitted successfully");

    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Something went wrong");
    }
  };

  const handleSaveVersion = async () => {
    const token = localStorage.getItem("accessToken");

    if (!contentId) {
      toast.error("No content selected");
      return;
    }

    try {
      // SAVE
      const res = await fetch(`${BASE_URL}/content/contents/save/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content_id: contentId,
          title: contentTitle,
          body: contentBody,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Save failed");
      }
      console.log("SAVE SUCCESS:", data);

      toast.success("Saved successfully");
      setRefreshVersionsKey(prev => prev + 1);
      fetchVersionDetails(contentId);

    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Something went wrong");
    }
  };

  const fetchVersionDetails = async (contentId: string, versionId?: string) => {
    const token = localStorage.getItem("accessToken");

    try {
      let url = "";

      if (versionId) {
        url = `${BASE_URL}/content/contents/${contentId}/versions/${versionId}/`;
      } else {
        url = `${BASE_URL}/content/contents/${contentId}/`;
      }

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      console.log("DETAIL DATA:", data);

      setContentTitle(data.title);
      setContentBody(data.body);
      setContentId(data.content_id);

    } catch (err) {
      console.error(err);
    }
  };

  const stripMentions = (text: string) => {
    return text.replace(/@\[(.*?)\]\(.*?\)/g, "@$1");
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "medium",
      timeStyle: "short",
    });
  };


  const fetchParticularContent = async (id: string) => {
    setContentId(id);
    try {
      const token = localStorage.getItem("accessToken")
      const res = await fetch(`${BASE_URL}/content/contents/${id}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` }
        })
      const data = await res.json();
      setContentTitle(data.title);
      setContentBody(data.body);
      setStatus(data.status);
      setInternalApproval(data.internal_approval);
      setMarketingApproval(data.marketing_approval);
      setStakeholderApproval(data.stakeholder_approval);
      console.log(data);
    }
    catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    if (id) {
      fetchParticularContent(id);
      fetchContentHistory(id);
    }
  }, [])

  return (
    <div>
      <HeaderSection />


      <div className="mx-6 mt-4">
        <div className="flex justify-between text-sm mb-1 text-gray-600">
          <span>Draft</span>
          <span>In Review</span>
          <span>Approved</span>
          <span>Published</span>
        </div>

        <div className="relative group w-full py-2">

          <div className="relative h-1 bg-gray-300 rounded-full">

            <div
              className="absolute inset-y-0 left-0 h-1 bg-blue-950 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />

            <div className="absolute inset-y-0 left-0 w-full flex justify-between items-center">
              <div className="w-3 h-3 rounded-full bg-gray-400 -translate-y-0" />
              <div className={`w-3 h-3 rounded-full ${progressPercent >= 33 ? "bg-yellow-400" : "bg-gray-400"}`} />
              <div className={`w-3 h-3 rounded-full ${progressPercent >= 66 ? "bg-blue-500" : "bg-gray-400"}`} />
              <div className={`w-3 h-3 rounded-full ${status === "published" ? "bg-green-400" : "bg-gray-400"}`} />
            </div>
          </div>

          <div className="absolute top-8 left-1/2 -translate-x-1/2 
          flex gap-3 items-start 
          opacity-0 group-hover:opacity-100 transition z-50 pointer-events-none">

            <div className="bg-gray-300 text-xs px-3 py-2 rounded shadow-md whitespace-nowrap">
              {tooltipText}
            </div>

            <div className="bg-gray-300 text-xs px-3 py-3 
            w-80 max-h-72 overflow-y-auto shadow-lg border rounded-sm border-gray-300 pointer-events-auto">
              <p className="font-semibold mb-2">History</p>
              {[...history]
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                .map((item) => (
                  <div key={item.history_id} className="mb-2 border-b border-gray-700 pb-1">
                    <p className="capitalize font-medium">
                      {item.action_type.replace("_", " ")}
                    </p>
                    <p>By: {item.performed_by_name}</p>
                    {item.note && (
                      <p className="italic">"{stripMentions(item.note)}"</p>
                    )}
                    <p className="text-gray-500 text-[10px]">
                      {formatDateTime(item.timestamp)}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>


      <div className="flex mx-6 justify-between my-5">
        <div>
          <h1 className="text-2xl">Content Editor</h1>
          <p className="text-gray-500 mt-2">Review and edit content</p>
        </div>
        <div className="mt-1">
          Content Status
        </div>
      </div>
      <div className="flex gap-4">
        {/* LEFT → Editor */}
        <div className="flex-1">
          {/* <VersionSidebar
                    allContent={allContent}
                    onSelect={fetchVersionDetails}
                    refreshKey={refreshVersionsKey}
                  /> */}
          <Card className="bg-white border border-gray-300">
            <CardContent className="p-3 sm:p-4">
              <TextEditor
                contentTitle={contentTitle}
                contentBody={contentBody}
                contentId={contentId}
                onChange={(value) => setContentBody(value)}
              />
              <div className="mt-4 flex justify-between">
                <button
                  onClick={handleSaveVersion}
                  className="px-2 py-1 text-white bg-blue-950 rounded-sm"
                >
                  Save Version
                </button>
                <button className="px-2 py-1 text-white bg-blue-950 rounded-sm"
                  onClick={handleSubmitContent}>Send For Approval</button>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* RIGHT → Comments */}
        <div className=" w-80 ">
          <CommentSection id={id} />
        </div>
      </div>
    </div>
  )
}

export default ContentEditorPage
