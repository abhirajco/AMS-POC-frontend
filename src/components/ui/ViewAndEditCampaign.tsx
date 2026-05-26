import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./dialog";
import { Label } from "./label";
import { Badge } from "./badge";
import { Input } from "./input";
import { Textarea } from "./textarea";
import { Button } from "./button";
import { Calendar as CalendarIcon, Edit, Trash2, Copy, } from 'lucide-react';
import { useState } from "react";

const ViewAndEditCampaign = () => {

    const [isEditingEvent, setIsEditingEvent] = useState(false);

    const [isEventDetailOpen, setIsEventDetailOpen] = useState(false);
    const [editDraft, setEditDraft] = useState<any | null>(null);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'In Progress':
                return <Badge className="bg-blue-100 text-blue-800 text-xs">In Progress</Badge>;
            case 'Upcoming':
                return <Badge className="bg-green-100 text-green-800 text-xs">Upcoming</Badge>;
            case 'Follow Up':
                return <Badge className="bg-orange-100 text-orange-800 text-xs">Follow Up</Badge>;
            case 'Planning':
                return <Badge className="bg-purple-100 text-purple-800 text-xs">Planning</Badge>;
            default:
                return <Badge variant="outline" className="text-xs">{status}</Badge>;
        }
    };

    const getPriorityBadge = (priority: string) => {
        switch (priority) {
            case 'High':
                return <Badge className="bg-red-600 text-white text-xs">High</Badge>;
            case 'Medium':
                return <Badge className="bg-yellow-500 text-white text-xs">Medium</Badge>;
            case 'Low':
                return <Badge className="bg-gray-500 text-white text-xs">Low</Badge>;
            default:
                return <Badge variant="outline" className="text-xs">{priority}</Badge>;
        }
    };

    return (
        <div>
            <Dialog open={isEventDetailOpen} onOpenChange={setIsEventDetailOpen}>
                <DialogContent className="max-w-[95vw] sm:max-w-2xl bg-white mx-4 max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{selectedEvent?.title}</DialogTitle>
                        <DialogDescription>
                            View and manage event details and milestones
                        </DialogDescription>
                    </DialogHeader>

                    {selectedEvent && (
                        <div className="space-y-6">
                            <div className="flex items-center gap-2">
                                {getStatusBadge(isEditingEvent ? editDraft?.status : selectedEvent.status)}
                                {getPriorityBadge(isEditingEvent ? editDraft?.priority : selectedEvent.priority)}
                                <Badge variant="outline">{isEditingEvent ? editDraft?.type : selectedEvent.type}</Badge>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-sm text-gray-700">Event Details</Label>
                                    <div className="mt-2 space-y-2 text-sm">
                                        <div className="flex justify-between gap-3 items-center">
                                            <span className="text-gray-600">Date:</span>
                                            {isEditingEvent ? (
                                                <Input
                                                    value={editDraft?.eventDate || ''}
                                                    onChange={(e) => setEditDraft((d: any) => ({ ...d, eventDate: e.target.value }))}
                                                    className="border-gray-300 max-w-[180px]"
                                                />
                                            ) : (
                                                <span className="text-gray-900">{selectedEvent.eventDate}</span>
                                            )}
                                        </div>
                                        <div className="flex justify-between gap-3 items-center">
                                            <span className="text-gray-600">Time:</span>
                                            {isEditingEvent ? (
                                                <Input
                                                    value={editDraft?.time || ''}
                                                    onChange={(e) => setEditDraft((d: any) => ({ ...d, time: e.target.value }))}
                                                    className="border-gray-300 max-w-[180px]"
                                                />
                                            ) : (
                                                <span className="text-gray-900">{selectedEvent.time}</span>
                                            )}
                                        </div>
                                        <div className="flex justify-between gap-3 items-center">
                                            <span className="text-gray-600">Location:</span>
                                            {isEditingEvent ? (
                                                <Input
                                                    value={editDraft?.location || ''}
                                                    onChange={(e) => setEditDraft((d: any) => ({ ...d, location: e.target.value }))}
                                                    className="border-gray-300 max-w-[200px]"
                                                />
                                            ) : (
                                                <span className="text-gray-900">{selectedEvent.location}</span>
                                            )}
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Due:</span>
                                            <span className="text-gray-900">{selectedEvent.dueTime}</span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <Label className="text-sm text-gray-700">Assigned Team</Label>
                                    <div className="mt-2 space-y-2">
                                        {selectedEvent.assignedTeam.map(member => (
                                            <div key={member.id} className="flex items-center gap-2">
                                                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                                    <span className="text-xs text-gray-600">{member.initials}</span>
                                                </div>
                                                <div>
                                                    <div className="text-sm text-gray-900">{member.name}</div>
                                                    <div className="text-xs text-gray-600">{member.role}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <Label className="text-sm text-gray-700">Description</Label>
                                {isEditingEvent ? (
                                    <Textarea
                                        className="border-gray-300 mt-2"
                                        rows={3}
                                        value={editDraft?.description || ''}
                                        onChange={(e) => setEditDraft((d: any) => ({ ...d, description: e.target.value }))}
                                    />
                                ) : (
                                    <p className="mt-2 text-sm text-gray-900">{selectedEvent.description}</p>
                                )}
                            </div>

                            <div>
                                <Label className="text-sm text-gray-700">Milestones</Label>
                                <div className="mt-2 space-y-3">
                                    {selectedEvent.milestones.map(milestone => (
                                        <div key={milestone.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div className="flex-1">
                                                <div className="text-sm text-gray-900">{milestone.title}</div>
                                                <div className="text-xs text-gray-600">
                                                    Assigned to {milestone.assignedTo} • Due: {milestone.dueDate}
                                                </div>
                                            </div>
                                            <Badge
                                                variant={milestone.status === 'Completed' ? 'default' : 'outline'}
                                                className="text-xs"
                                            >
                                                {milestone.status}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-between items-center gap-2 pt-4 border-t">
                                {(selectedEvent as any).relatedTaskId !== undefined && (
                                    <div className="text-sm">
                                        <span className="text-gray-600 mr-1">Related Task:</span>
                                        <a
                                            className="text-blue-600 hover:underline"
                                            href={`/planner?task=${(selectedEvent as any).relatedTaskId}`}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                const url = `/planner?task=${(selectedEvent as any).relatedTaskId}`;
                                                (window as any).openTaskFromQuery = (selectedEvent as any).relatedTaskId;
                                                window.history.pushState(null, '', url);
                                                window.dispatchEvent(new Event('popstate'));
                                                setIsEventDetailOpen(false);
                                            }}
                                        >
                                            View Task #{(selectedEvent as any).relatedTaskId}
                                        </a>
                                    </div>
                                )}
                                <Button variant="outline" onClick={handleDuplicate}>
                                    <Copy className="w-4 h-4 mr-2" />
                                    Duplicate
                                </Button>
                                {isEditingEvent ? (
                                    <Button className="bg-[#1a2c47] text-white hover:bg-[#2a3c57]" onClick={handleSaveEdit}>
                                        Save Changes
                                    </Button>
                                ) : (
                                    <Button variant="outline" onClick={() => setIsEditingEvent(true)}>
                                        <Edit className="w-4 h-4 mr-2" />
                                        Edit
                                    </Button>
                                )}
                                <Button variant="outline" className="text-red-600 border-red-300 hover:bg-red-50" onClick={handleDelete}>
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

        </div>
    )
}

export default ViewAndEditCampaign
