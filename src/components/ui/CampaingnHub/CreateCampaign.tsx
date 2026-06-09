import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createCampaign } from "@/api/CampaignHub";
import { useCampaign } from "@/store/useCampaign";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../select";

const CreateCampaignDialog = ({ open, setOpen }: any) => {

    const [loading, setLoading] = useState(false);
    const { fetchCampaigns } = useCampaign();

    const [form, setForm] = useState({
        title: "",
        description: "",
        start_date: "",
        end_date: "",
        max_hierarchy_level: 2,
        campaign_type: "",
        priority: "",
        status: "",
        location: "",
        tags: ""
    });

    const handleChange = (key: string, value: any) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };


    const handleSubmit = async () => {
        const { toast } = await import("sonner");

        try {
            setLoading(true);

            await createCampaign(form);

            await fetchCampaigns();

            toast.success("Campaign created successfully");

            setOpen(false);
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-lg bg-white max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create Campaign</DialogTitle>
                    <DialogDescription>
                        Create a new marketing Campaign and assign team members
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div>
                        <Label htmlFor="title" className="text-sm text-gray-700 mb-2 block">Campaign Title</Label>
                        <Input
                            value={form.title}
                            placeholder="Enter event title"
                            className="border-gray-300"
                            onChange={(e) => handleChange("title", e.target.value)}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="type" className="text-sm text-gray-700 mb-2 block">Type</Label>
                            <Select
                                value={form.campaign_type}
                                onValueChange={(value) => handleChange("campaign_type", value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="campaign">Campaign</SelectItem>
                                    <SelectItem value="webinar">Webinar</SelectItem>
                                    <SelectItem value="workshop">Workshop</SelectItem>
                                    <SelectItem value="training">Training</SelectItem>
                                    <SelectItem value="meeting">Meeting</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="priority" className="text-sm text-gray-700 mb-2 block">Priority</Label>
                            <Select
                                value={form.priority}
                                onValueChange={(value) => handleChange("priority", value)}>
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
                            <Label className="text-sm text-gray-700 mb-2 block">Start Date</Label>
                            <Input
                                type="date"
                                value={form.start_date}
                                className="border-gray-300"
                                onChange={(e) => handleChange("start_date", e.target.value)}
                            />
                        </div>

                        <div>
                            <Label className="text-sm text-gray-700 mb-2 block">End Date</Label>
                            <Input
                                type="date"
                                value={form.end_date}
                                className="border-gray-300"
                                onChange={(e) => handleChange("end_date", e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="location" className="text-sm text-gray-700 mb-2 block">Location</Label>
                            <Input
                                id="location"
                                placeholder="Event location"
                                className="border-gray-300"
                                value={form.location}
                                onChange={(e) => handleChange("location", e.target.value)}
                            />
                        </div>
                        <div>
                            <Label className="text-sm text-gray-700 mb-2 block">Hierarchy Level</Label>
                            <Input
                                type="number"
                                placeholder=""
                                value={form.max_hierarchy_level}
                                className="border-gray-300"
                                onChange={(e) =>
                                    handleChange("max_hierarchy_level", Number(e.target.value))
                                }
                            />
                        </div>

                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="location" className="text-sm text-gray-700 mb-2 block">tags</Label>
                            <Input
                                id="tags"
                                placeholder="tags"
                                className="border-gray-300"
                                value={form.tags}
                                onChange={(e) => handleChange("tags", e.target.value)}
                            />
                        </div>
                        <div>
                            <Label className="text-sm text-gray-700 mb-2 block">Status</Label>
                            <Select
                                value={form.status}
                                onValueChange={(value) => handleChange("status", value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select priority" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="upcoming">Upcoming</SelectItem>
                                    <SelectItem value="in_progress">In Progress</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                    <SelectItem value="planning">Planning</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                    </div>

                    <div>
                        <Label className="text-sm text-gray-700 mb-2 block">Description</Label>
                        <Textarea
                            placeholder="Event description and objectives..."
                            className="border-gray-300 resize-none"
                            value={form.description}
                            onChange={(e) => handleChange("description", e.target.value)}
                        />
                    </div>


                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>

                        <Button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="bg-[#1a2c47] text-white"
                        >
                            {loading ? "Creating..." : "Create Campaign"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default CreateCampaignDialog;