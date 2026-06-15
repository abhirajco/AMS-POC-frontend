import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { useCampaign } from "@/store/useCampaign";
import { useEffect } from "react";
import { createEvent } from "@/api/EventHub";
import { toast } from "sonner";
import { useEvent } from "@/store/useEvent";

const CreateEventDialog = ({ open, setOpen, defaultDate }: any) => {
    const [loading, setLoading] = useState(false);

    const campaigns = useCampaign((s: any) => s.campaigns);
    const fetchCampaigns = useCampaign((s: any) => s.fetchCampaigns);
    const { fetchEvents } = useEvent();

    const [form, setForm] = useState({
        title: "",
        description: "",
        start_date: "",
        end_date: "",
        max_hierarchy_level: 2,
        event_type: "",
        priority: "",
        status: "",
        location: "",
        tags: "",
        campaign_id: "",
    });

    useEffect(() => {
        fetchCampaigns();
    }, [])

    // Prefill the date range when the dialog is opened from a calendar cell "+".
    useEffect(() => {
        if (open && defaultDate) {
            setForm((prev) => ({
                ...prev,
                start_date: defaultDate,
                end_date: prev.end_date || defaultDate,
            }));
        }
    }, [open, defaultDate])

    const handleChange = (key: string, value: any) => {
        setForm((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const validateForm = () => {
        const requiredFields = [
            "title",
            "description",
            "start_date",
            "end_date",
            "event_type",
            "priority",
            "status",
            "location",
            "campaign_id"
        ];

        for (const field of requiredFields) {
            if (!form[field as keyof typeof form]) {
                return `${field.replace("_", " ")} is required`;
            }
        }

        if (new Date(form.end_date) < new Date(form.start_date)) {
            return "End date cannot be before start date";
        }

        if (form.max_hierarchy_level < 1) {
            return "Hierarchy level must be at least 1";
        }

        return null;
    };

    const handleSubmit = async () => {
        const validationError = validateForm();

        if (validationError) {
            toast.error(validationError);
            return;
        }

        try {
            setLoading(true);

            const payload = {
                ...form,
                tags: form.tags?.trim() || "",
            };

            await createEvent(payload);
            await fetchEvents();
            setOpen(false);

            setForm({
                title: "",
                description: "",
                start_date: "",
                end_date: "",
                max_hierarchy_level: 2,
                event_type: "",
                priority: "",
                status: "",
                location: "",
                tags: "",
                campaign_id: ""
            });
        } catch (err: any) {
            toast.error(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-lg bg-white max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create Event </DialogTitle>

                    <DialogDescription>
                        Create a new marketing event
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div>
                        <Label className="text-sm text-gray-700 mb-2 block">
                            Event Title *
                        </Label>

                        <Input
                            value={form.title}
                            placeholder="Enter campaign title"
                            className="border-gray-300"
                            onChange={(e) => handleChange("title", e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label className="text-sm text-gray-700 mb-2 block">
                                Type *
                            </Label>

                            <Select
                                value={form.event_type}
                                onValueChange={(value) => handleChange("event_type", value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>

                                <SelectContent>
                                    <SelectItem value="launch">Launch</SelectItem>
                                    <SelectItem value="webinar">Webinar</SelectItem>
                                    <SelectItem value="workshop">Workshop</SelectItem>
                                    <SelectItem value="training">Training</SelectItem>
                                    <SelectItem value="meeting">Meeting</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label className="text-sm text-gray-700 mb-2 block">
                                Priority *
                            </Label>

                            <Select
                                value={form.priority}
                                onValueChange={(value) => handleChange("priority", value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select priority" />
                                </SelectTrigger>

                                <SelectContent>
                                    <SelectItem value="high">High</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="low">Low</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label className="text-sm text-gray-700 mb-2 block">
                                Start Date *
                            </Label>

                            <Input
                                type="date"
                                value={form.start_date}
                                className="border-gray-300"
                                onChange={(e) =>
                                    handleChange("start_date", e.target.value)
                                }
                            />
                        </div>

                        <div>
                            <Label className="text-sm text-gray-700 mb-2 block">
                                End Date *
                            </Label>

                            <Input
                                type="date"
                                value={form.end_date}
                                className="border-gray-300"
                                onChange={(e) =>
                                    handleChange("end_date", e.target.value)
                                }
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label className="text-sm text-gray-700 mb-2 block">
                                Location *
                            </Label>

                            <Input
                                value={form.location}
                                placeholder="Campaign location"
                                className="border-gray-300"
                                onChange={(e) =>
                                    handleChange("location", e.target.value)
                                }
                            />
                        </div>

                        <div>
                            <Label className="text-sm text-gray-700 mb-2 block">
                                Hierarchy Level *
                            </Label>

                            <Input
                                type="number"
                                min={1}
                                value={form.max_hierarchy_level}
                                className="border-gray-300"
                                onChange={(e) =>
                                    handleChange(
                                        "max_hierarchy_level",
                                        Number(e.target.value)
                                    )
                                }
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label className="text-sm text-gray-700 mb-2 block">
                                Select Related Campaign *
                            </Label>

                            <Select
                                value={form.campaign_id}
                                onValueChange={(value) => handleChange("campaign_id", value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select campaign" />
                                </SelectTrigger>

                                <SelectContent>
                                    {campaigns?.map((campaign: any) => (
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
                        <div>
                            <Label className="text-sm text-gray-700 mb-2 block">
                                Status *
                            </Label>

                            <Select
                                value={form.status}
                                onValueChange={(value) => handleChange("status", value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>

                                <SelectContent>
                                    <SelectItem value="upcoming">Upcoming</SelectItem>
                                    <SelectItem value="in_progress">In Progress</SelectItem>
                                    <SelectItem value="planning">Planning</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div>
                        <Label className="text-sm text-gray-700 mb-2 block">
                            Tags (Optional)
                        </Label>

                        <Input
                            value={form.tags}
                            placeholder="Enter tags"
                            className="border-gray-300"
                            onChange={(e) => handleChange("tags", e.target.value)}
                        />
                    </div>

                    <div>
                        <Label className="text-sm text-gray-700 mb-2 block">
                            Description *
                        </Label>

                        <Textarea
                            placeholder="Campaign description..."
                            className="border-gray-300 resize-none"
                            value={form.description}
                            onChange={(e) =>
                                handleChange("description", e.target.value)
                            }
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button
                            variant="outline"
                            onClick={() => setOpen(false)}
                        >
                            Cancel
                        </Button>

                        <Button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="bg-[#1a2c47] text-white"
                        >
                            {loading ? "Creating..." : "Create Event"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default CreateEventDialog; 