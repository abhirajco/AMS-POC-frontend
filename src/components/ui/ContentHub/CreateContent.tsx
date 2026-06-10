import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import LabeledTagInput from "../LabeledTagInput";
import { createContentFlow } from "@/services/contentService";
import { useCampaign } from "@/store/useCampaign";
import { useUserStore } from "@/store/useUsers";
import { getCampaignEvents } from "@/api/CampaignHub";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface Event {
  event_id: string;
  title: string;
}


interface CreateContentFormData {
  title: string;
  brief: string;
  campaignId: string;
  eventId: string;
  executiveId: string;
  contentType: string;
  tags: string[];
}

interface CreateContentProps {
  open: boolean;
  onClose: (open: boolean) => void;
}

const CreateContent = ({ open, onClose, }: CreateContentProps) => {


  const contentTypes = [
    "Blog",
    "Article",
    "Case Study",
    "Whitepaper",
    "Social Post",
    "Email",
    "Newsletter",
    "Video",
    "Webinar",
    "Infographic",
  ];

  const [formData, setFormData] = useState<CreateContentFormData>({
    title: "",
    brief: "",
    campaignId: "",
    eventId: "",
    executiveId: "",
    contentType: "",
    tags: [],
  });

  const navigate = useNavigate();

  const handleCreate = async () => {
    try {
      const result = await createContentFlow({
        title: formData.title,
        brief: formData.brief,
        content_type: formData.contentType,
        campaign_id: formData.campaignId,
        event_id: formData.eventId || undefined,
        executive_id: formData.executiveId || undefined,
        tags: formData.tags.join(","),
      });

      setFormData({
        title: "",
        brief: "",
        campaignId: "",
        eventId: "",
        executiveId: "",
        contentType: "",
        tags: [],
      });

      setEvents([]);
      onClose(false);
      navigate("/generate-new-content", {
        state: {
          contentId: result.contentId,
          title: result.title,
          brief: result.brief,
          contentType: result.contentType,
        },
      });

    } catch (error: any) {
      console.error(error);

      toast.error(
        error?.message || "Failed to create content"
      );
    }
  };

  const [events, setEvents] = useState<Event[]>([]);
  const { campaigns, fetchCampaigns, } = useCampaign();
  const { executives, fetchExecutives } = useUserStore();

  const fetchEvents = async (campaignId: string) => {
    try {
      const data = await getCampaignEvents(campaignId);

      setEvents(data.events || []);
    } catch (error) {
      console.error("Failed to fetch events:", error);
      setEvents([]);
    }
  };

  const handleChange = (
    key: keyof CreateContentFormData,
    value: string | string[]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  useEffect(() => {
    fetchCampaigns();
    fetchExecutives();
  }, []);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className=" sm:max-w-[600px] max-h-[90vh] overflow-y-auto shadow-lg rounded-xl">
        <DialogHeader>
          <DialogTitle>Create Content</DialogTitle>
          <DialogDescription>
            Fill in the details to create new content.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2">
          {/* Title */}
          <div className="flex flex-col gap-2">
            <Label>Title</Label>

            <Input
              className="border border-gray-300 focus:border-blue-500"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Enter title"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Brief</Label>

            <Textarea
              className="border border-gray-300 focus:border-blue-500"
              rows={3}
              value={formData.brief}
              onChange={(e) => handleChange("brief", e.target.value)}
              placeholder="Enter brief"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Campaign</Label>

            <Select
              value={formData.campaignId}
              onValueChange={(value) => {
                handleChange("campaignId", value);
                handleChange("eventId", ""); // reset selected event
                fetchEvents(value);
              }}
            >
              <SelectTrigger className="border border-gray-300 focus:border-blue-500">
                <SelectValue placeholder="Select campaign" />
              </SelectTrigger>

              <SelectContent>
                {campaigns.map((campaign) => (
                  <SelectItem
                    key={campaign.campaign_id}
                    value={campaign.campaign_id}
                  >
                    {campaign.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Event</Label>

            <Select
              value={formData.eventId}
              onValueChange={(value) =>
                handleChange("eventId", value)
              }
            >
              <SelectTrigger className="border border-gray-300 focus:border-blue-500">
                <SelectValue placeholder="Select event" />
              </SelectTrigger>

              <SelectContent>
                {events.map((event) => (
                  <SelectItem
                    key={event.event_id}
                    value={event.event_id}
                  >
                    {event.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Executive</Label>

            <Select
              value={formData.executiveId}
              onValueChange={(value) =>
                handleChange("executiveId", value)
              }
            >
              <SelectTrigger className="border border-gray-300 focus:border-blue-500">
                <SelectValue placeholder="Select executive" />
              </SelectTrigger>

              <SelectContent>
                {executives.map((executive) => (
                  <SelectItem
                    key={executive.user_id}
                    value={executive.user_id}
                  >
                    {executive.full_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Content Type</Label>

            <Select
              value={formData.contentType}
              onValueChange={(value) =>
                handleChange("contentType", value)
              }
            >
              <SelectTrigger className="border border-gray-300 focus:border-blue-500">
                <SelectValue placeholder="Select content type" />
              </SelectTrigger>

              <SelectContent>
                {contentTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tags */}
          <div className="flex flex-col gap-2">
            {/* <Label>Tags</Label> */}

            <LabeledTagInput
             
              tags={formData.tags}
              onChange={(tags) => handleChange("tags", tags)}
            />
          </div>

          <Button
            onClick={handleCreate}
            className="w-full bg-blue-950 hover:bg-blue-900 text-white"
          >
            Create Content
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateContent;