import { Button } from "../button";
import { Dialog,DialogContent,DialogHeader,DialogTitle,DialogDescription } from "../dialog";
import { Label } from "../label";
import { Input } from "../input";
import { Textarea } from "../textarea";
import { Select, SelectTrigger, SelectValue,SelectContent,SelectItem} from "../select";
import { useState } from "react";


const CreateTask = () => {
 
   const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);

  return (
    <div>
       <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-2xl mx-4">
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
            <DialogDescription>
              Fill out the form below to create a new task for your marketing activities.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="task-title" className="block text-sm text-gray-700 mb-1">Task Title</Label>
              <Input id="task-title" placeholder="Enter task title..." className="border-gray-300 focus:ring-[#1a2c47] focus:border-[#1a2c47]" />
            </div>
            <div>
              <Label htmlFor="task-description" className="block text-sm text-gray-700 mb-1">Description</Label>
              <Textarea id="task-description" placeholder="Enter task description..." rows={3} className="border-gray-300 focus:ring-[#1a2c47] focus:border-[#1a2c47]" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="task-priority" className="block text-sm text-gray-700 mb-1">Priority</Label>
                <Select>
                  <SelectTrigger className="border-gray-300 focus:ring-2 focus:ring-[#1a2c47] focus:border-[#1a2c47]">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="task-category" className="block text-sm text-gray-700 mb-1">Category</Label>
                <Select>
                  <SelectTrigger className="border-gray-300 focus:ring-2 focus:ring-[#1a2c47] focus:border-[#1a2c47]">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="content">Content Creation</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="research">Research</SelectItem>
                    <SelectItem value="video">Video Production</SelectItem>
                    <SelectItem value="email">Email Marketing</SelectItem>
                    <SelectItem value="social">Social Media</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="task-assignee" className="block text-sm text-gray-700 mb-1">Assigned To</Label>
                <Select>
                  <SelectTrigger className="border-gray-300 focus:ring-2 focus:ring-[#1a2c47] focus:border-[#1a2c47]">
                    <SelectValue placeholder="Select assignee" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="piyush">Piyush Singh</SelectItem>
                    <SelectItem value="sarah">Sarah Johnson</SelectItem>
                    <SelectItem value="mike">Mike Chen</SelectItem>
                    <SelectItem value="alex">Alex Thompson</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="task-due" className="block text-sm text-gray-700 mb-1">Due Date</Label>
                <Input id="task-due" type="date" className="border-gray-300 focus:ring-[#1a2c47] focus:border-[#1a2c47]" />
              </div>
              <div>
                <Label htmlFor="task-launch" className="block text-sm text-gray-700 mb-1">Launch Date</Label>
                <Input id="task-launch" type="date" className="border-gray-300 focus:ring-[#1a2c47] focus:border-[#1a2c47]" />
                <p className="text-xs text-gray-500 mt-1">This is the planned launch date for this task.</p>
              </div>
            </div>
            <div>
              <Label htmlFor="task-tags" className="block text-sm text-gray-700 mb-1">Tags (comma separated)</Label>
              <Input id="task-tags" placeholder="e.g., content, blog, AI, insurance" className="border-gray-300 focus:ring-[#1a2c47] focus:border-[#1a2c47]" />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsTaskDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsTaskDialogOpen(false)} className="bg-[#1a2c47] text-white hover:bg-[#2a3c57]">
                Create Task
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CreateTask
