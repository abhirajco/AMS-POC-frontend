import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Plus, Search, Calendar, Star, ArrowLeft, ArrowRight, X, Paperclip } from 'lucide-react';
import { HeaderSection } from "../components/common/HeaderSection";
import { getPriorityBadge } from "../utils/helpers";
import { mockTasks } from "../data/mockData";
import { useState, useMemo } from 'react';

interface PlannerPageProps {
  setIsSidebarOpen: (open: boolean) => void;
  isTaskDialogOpen: boolean;
  setIsTaskDialogOpen: (open: boolean) => void;
}

export const PlannerPage = ({
  setIsSidebarOpen,
  isTaskDialogOpen,
  setIsTaskDialogOpen
}: PlannerPageProps) => {
  // Local task state so drag-and-drop updates re-render instantly
  const [tasks, setTasks] = useState(mockTasks);

  // Calculate task metrics - use local tasks state
  const taskMetrics = {
    total: tasks.length,
    todo: tasks.filter(task => task.status === 'todo').length,
    inProgress: tasks.filter(task => task.status === 'in-progress').length,
    inReview: tasks.filter(task => task.status === 'in-review').length,
    completed: tasks.filter(task => task.status === 'done').length
  };

  // Local filter/search state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedAssignee, setSelectedAssignee] = useState<string>('Sujith Kumar');
  const [selectedQuarter, setSelectedQuarter] = useState<string>('all');

  // Map simple type values to task categories present in mock data
  const typeToCategories: Record<string, string[]> = {
    all: [],
    content: ['Content Creation'],
    design: ['Design', 'Brand & Design'],
    research: ['Research'],
    video: ['Video Production'],
    email: ['Email Marketing']
  };

  const getQuarterFromDate = (dateStr?: string) => {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return null;
    const month = d.getMonth();
    if (month <= 2) return 'Q1';
    if (month <= 5) return 'Q2';
    if (month <= 8) return 'Q3';
    return 'Q4';
  };

  const filteredTasks = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return tasks.filter(task => {
      if (selectedType !== 'all') {
        const categories = typeToCategories[selectedType] || [];
        const category = (task.category || '').toLowerCase();
        const matchesCategory = categories.some(c => c.toLowerCase() === category);
        if (!matchesCategory) return false;
      }

      if (selectedStatus !== 'all' && task.status !== selectedStatus) return false;

      if (selectedPriority !== 'all' && (task.priority || '').toLowerCase() !== selectedPriority) return false;

      if (selectedAssignee !== 'all') {
        const assigneeName = (task.assignedTo ? task.assignedTo.name : '').toLowerCase();
        if (assigneeName !== selectedAssignee.toLowerCase()) return false;
      }

      // Quarter filter works against launchDate first, fallback to dueDate
      if (selectedQuarter !== 'all') {
        const quarterSource = task.launchDate || task.dueDate || '';
        const q = getQuarterFromDate(quarterSource);
        if (q !== selectedQuarter) return false;
      }

      if (query) {
        const haystack = `${task.title} ${task.description} ${(task.tags || []).join(' ')}`.toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      return true;
    });
  }, [tasks, searchQuery, selectedType, selectedStatus, selectedPriority, selectedAssignee, selectedQuarter, typeToCategories]);

  // Month navigation for the header control
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const now = new Date();
    return new Date(now.getFullYear(), 7, 25);
  });
  const monthNames = [
    'January','February','March','April','May','June','July','August','September','October','November','December'
  ];
  const navigateMonth = (direction: 'prev' | 'next') => {
    setSelectedDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
      return newDate;
    });
  };

  // Task detail dialog state
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [isTaskDetailOpen, setIsTaskDetailOpen] = useState<boolean>(false);
  const [isEditingTask, setIsEditingTask] = useState<boolean>(false);
  const [editEstimatedHours, setEditEstimatedHours] = useState<number>(0);
  const [editCompletedHours, setEditCompletedHours] = useState<number>(0);
  const [editRemainingHours, setEditRemainingHours] = useState<number>(0);
  const handleTaskClick = (taskId: number) => {
    setSelectedTaskId(taskId);
    setIsTaskDetailOpen(true);
    const src = filteredTasks.find(t => t.id === taskId) || tasks.find(t => t.id === taskId);
    if (src) {
      setEditEstimatedHours(src.estimatedHours || 0);
      setEditCompletedHours(src.completedHours || 0);
      const remaining = (src.estimatedHours || 0) - (src.completedHours || 0);
      setEditRemainingHours(remaining > 0 ? remaining : 0);
    }
    setIsEditingTask(false);
  };

  // Listen for deep-linking events to open a task from other pages
  if (typeof window !== 'undefined') {
    window.removeEventListener('open-planner-task', (window as any)._openPlannerTaskHandler as any);
    (window as any)._openPlannerTaskHandler = (e: any) => {
      const id = e?.detail?.taskId;
      if (typeof id === 'number') {
        handleTaskClick(id);
      }
    };
    window.addEventListener('open-planner-task', (window as any)._openPlannerTaskHandler);
  }

  return (
    <div className="bg-neutral-50 flex flex-col h-full">
      <HeaderSection setIsSidebarOpen={setIsSidebarOpen} />

      {/* Page Header */}
      <div className="px-4 sm:px-6 py-4 sm:py-6 bg-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-[20px] sm:text-[24px] lg:text-[28px] font-medium text-black">Planner</h1>
            <p className="text-[12px] sm:text-[14px] text-gray-600 mt-1">Manage all your tasks at one place</p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="rounded-full border-gray-300 text-sm whitespace-nowrap"
                onClick={() => import('sonner').then(({ toast }) => toast('Work Items by AI is coming soon.'))}
              >
                <Star className="w-4 h-4 mr-2" />
                Work Items by AI
              </Button>
              <div className="rounded-full border border-gray-300 px-4 py-2 flex items-center gap-3">
                <button aria-label="Previous Month" onClick={() => navigateMonth('prev')} className="text-gray-700">
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <Calendar className="w-4 h-4 text-gray-700" />
                <span className="text-sm text-gray-800">
                  {monthNames[selectedDate.getMonth()]} {selectedDate.getDate()}
                </span>
                <button aria-label="Next Month" onClick={() => navigateMonth('next')} className="text-gray-700">
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            <Select value={selectedQuarter} onValueChange={setSelectedQuarter}>
              <SelectTrigger className="w-full sm:w-auto min-w-[120px] rounded-full border-gray-300 text-sm">
                <SelectValue placeholder="Quarter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Quarters</SelectItem>
                <SelectItem value="Q1">Q1 2025</SelectItem>
                <SelectItem value="Q2">Q2 2025</SelectItem>
                <SelectItem value="Q3">Q3 2025</SelectItem>
                <SelectItem value="Q4">Q4 2025</SelectItem>
              </SelectContent>
            </Select>
            <Button
              className="bg-[#1a2c47] text-white rounded-full px-4 py-2 hover:bg-[#2a3c57] text-sm whitespace-nowrap"
              onClick={() => setIsTaskDialogOpen(true)}
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
              New Task
            </Button>
          </div>
        </div>
      </div>

      {/* Task Metrics */}
      <div className="px-4 sm:px-6 pb-4 sm:pb-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {[
            { label: "Total Tasks", value: taskMetrics.total, color: "text-gray-900" },
            { label: "To do", value: taskMetrics.todo, color: "text-gray-900" },
            { label: "In Progress", value: taskMetrics.inProgress, color: "text-gray-900" },
            { label: "In Review", value: taskMetrics.inReview, color: "text-gray-900" },
            { label: "Completed", value: taskMetrics.completed, color: "text-gray-900" }
          ].map((metric, index) => (
            <Card key={index} className="bg-white border border-gray-200">
              <CardContent className="p-4 sm:p-6">
                <h3 className="font-semibold text-[14px] sm:text-[16px] text-gray-800 mb-2 sm:mb-3">{metric.label}</h3>
                <p className={`text-[24px] sm:text-[32px] lg:text-[36px] font-semibold ${metric.color} tracking-tight`}>{metric.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Filters Section */}
      <div className="px-4 sm:px-6 pb-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-2 sm:gap-3 mb-4">
          <div className="flex-1">
            <h3 className="font-semibold text-[14px] sm:text-[16px] text-gray-800">Planner Tasks</h3>
          </div>

          <div className="flex flex-wrap gap-2 sm:gap-3 w-full lg:w-auto">
            <div className="relative flex-1 lg:flex-none lg:w-80">
              <Input
                placeholder="Search Tasks"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 rounded-full border-gray-300 text-sm"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>

            {/* Assignee Filter */}
            {(() => {
              const assigneeOptions = Array.from(new Set((tasks || [])
                .map(t => t.assignedTo && t.assignedTo.name)
                .filter((n): n is string => Boolean(n)))).sort();
              return (
                <Select value={selectedAssignee} onValueChange={setSelectedAssignee}>
                  <SelectTrigger className="w-full sm:w-auto min-w-[160px] rounded-full border-gray-300 text-sm">
                    <SelectValue placeholder="All Persons" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Persons</SelectItem>
                    {assigneeOptions.map(name => (
                      <SelectItem key={name} value={name}>{name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              );
            })()}

            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-full sm:w-auto min-w-[120px] rounded-full border-gray-300 text-sm">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="content">Content Creation</SelectItem>
                <SelectItem value="design">Design</SelectItem>
                <SelectItem value="research">Research</SelectItem>
                <SelectItem value="video">Video Production</SelectItem>
                <SelectItem value="email">Email Marketing</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full sm:w-auto min-w-[120px] rounded-full border-gray-300 text-sm">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="todo">To Do</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="in-review">In Review</SelectItem>
                <SelectItem value="done">Completed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedPriority} onValueChange={setSelectedPriority}>
              <SelectTrigger className="w-full sm:w-auto min-w-[120px] rounded-full border-gray-300 text-sm">
                <SelectValue placeholder="All Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="rounded-full border-gray-300 text-sm whitespace-nowrap">
              <Star className="w-4 h-4 mr-2" />
              Work Items by AI
            </Button>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="px-4 sm:px-6 pb-4">
        <div className="bg-gray-200 bg-opacity-40 rounded-lg p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {['To do', 'In Progress', 'In Review', 'Completed'].map((column) => (
              <div key={column} className="space-y-4"
                   onDragOver={(e) => e.preventDefault()}
                   onDrop={(e) => {
                     const idStr = e.dataTransfer.getData('text/plain');
                     const id = Number(idStr);
                     if (!id) return;
                     const newStatus = column === 'To do' ? 'todo' : column === 'In Progress' ? 'in-progress' : column === 'In Review' ? 'in-review' : 'done';
                     setTasks(prev => prev.map(t => t.id === id ? { ...t, status: newStatus as any } : t));
                     import('sonner').then(({ toast }) => toast.success('Task moved to ' + column));
                   }}>
                <h4 className="font-semibold text-[11px] sm:text-[12px] text-black">{column}</h4>
                <div className="space-y-3 sm:space-y-4">
                   {filteredTasks
                    .filter(task => {
                      if (column === 'To do') return task.status === 'todo';
                      if (column === 'In Progress') return task.status === 'in-progress';
                      if (column === 'In Review') return task.status === 'in-review';
                      if (column === 'Completed') return task.status === 'done';
                      return false;
                    })
                    .map((task) => (
                      <Card key={task.id}
                        className="bg-white border border-gray-300 p-3 sm:p-4 hover:shadow-md transition-shadow cursor-pointer"
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.setData('text/plain', String(task.id));
                        }}
                        onClick={() => handleTaskClick(task.id)}>
                        <CardContent className="p-0">
                          <div className="space-y-2 sm:space-y-3">
                            <div className="flex items-start gap-2">
                              {getPriorityBadge(task.priority)}
                              <div className="bg-gray-100 text-black text-xs px-2 py-1 rounded">
                                {task.category ? task.category.split(' ')[0] : 'Task'}
                              </div>
                            </div>
                            <h5 className="font-medium text-[13px] sm:text-[14px] text-black line-clamp-2">{task.title}</h5>
                            <p className="text-[11px] sm:text-[12px] text-gray-600 line-clamp-2">{task.description}</p>
                            <div className="space-y-2 sm:space-y-3">
                              <div className="flex flex-wrap gap-1 sm:gap-1.5">
                                {task.tags && task.tags.slice(0, 3).map((tag, tagIndex) => (
                                  <div key={tagIndex} className="border border-gray-400 text-[10px] sm:text-xs px-2 py-1 rounded">
                                    {tag}
                                  </div>
                                ))}
                                {task.tags && task.tags.length > 3 && (
                                  <div className="border border-gray-400 text-[10px] sm:text-xs px-2 py-1 rounded text-gray-500">
                                    +{task.tags.length - 3}
                                  </div>
                                )}
                              </div>
                              <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-1 text-gray-600 text-[11px] sm:text-[12px]">
                                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                                  <span className={
                                    task.status === 'done' ? 'text-green-600 font-semibold' :
                                    new Date(task.dueDate) < new Date() ? 'text-red-600' : ''
                                  }>
                                    Due: {task.dueDate}
                                  </span>
                                </div>
                                {task.launchDate && (
                                  <div className="flex items-center gap-1 text-gray-600 text-[11px] sm:text-[12px]">
                                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                                    <span className="font-medium">Launch: {task.launchDate}</span>
                                  </div>
                                )}
                              </div>
                              <div className="flex items-center gap-1 text-gray-600 text-[11px] sm:text-[12px]">
                                <div className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center text-[8px] font-semibold">
                                  {task.assignedTo ? task.assignedTo.initials : 'N/A'}
                                </div>
                                <span className="font-medium">
                                  {task.assignedTo ? task.assignedTo.name : 'Unassigned'}
                                </span>
                              </div>
                              {task.estimatedHours && (
                                <div className="flex items-center gap-1 text-gray-600 text-[11px] sm:text-[12px]">
                                  <span>Progress: {task.completedHours || 0}/{task.estimatedHours}h</span>
                                  <div className="flex-1 bg-gray-200 h-1 rounded">
                                    <div
                                      className="bg-blue-600 h-1 rounded"
                                      style={{ width: `${((task.completedHours || 0) / task.estimatedHours) * 100}%` }}
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Task Creation Dialog */}
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

      {/* Task Detail Dialog */}
      <Dialog open={isTaskDetailOpen} onOpenChange={setIsTaskDetailOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-2xl bg-white mx-4 max-h-[90vh] overflow-y-auto">
          {selectedTaskId && (() => {
            const task = filteredTasks.find(t => t.id === selectedTaskId) || tasks.find(t => t.id === selectedTaskId);
            if (!task) return null;
            return (
              <div className="space-y-4">
                <DialogHeader>
                  <div className="flex items-center justify-between">
                    <DialogTitle className="text-[14px] sm:text-[16px] font-medium">Task Details</DialogTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsTaskDetailOpen(false)}
                      className="h-6 w-6 flex-shrink-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <DialogDescription>
                    View full task information.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-3">
                  <h3 className="font-medium text-[14px] text-black">{task.title}</h3>
                  <p className="text-[12px] text-gray-700">{task.description}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="text-[12px] text-gray-700">
                      <div className="font-semibold text-gray-600 mb-1">Status</div>
                      <span className="inline-block border border-gray-300 rounded px-2 py-0.5 text-[11px] capitalize">{task.status}</span>
                    </div>
                    <div className="text-[12px] text-gray-700">
                      <div className="font-semibold text-gray-600 mb-1">Priority</div>
                      {getPriorityBadge(task.priority)}
                    </div>
                    <div className="text-[12px] text-gray-700">
                      <div className="font-semibold text-gray-600 mb-1">Due Date</div>
                      <span>{task.dueDate}</span>
                    </div>
                    {task.launchDate && (
                      <div className="text-[12px] text-gray-700">
                        <div className="font-semibold text-gray-600 mb-1">Launch Date</div>
                        <span>{task.launchDate}</span>
                      </div>
                    )}
                    <div className="text-[12px] text-gray-700">
                      <div className="font-semibold text-gray-600 mb-1">Created Date</div>
                      <span>{task.createdDate}</span>
                    </div>
                    <div className="text-[12px] text-gray-700">
                      <div className="font-semibold text-gray-600 mb-1">Assigned To</div>
                      <span>{task.assignedTo ? task.assignedTo.name : 'Unassigned'}</span>
                    </div>
                    <div className="text-[12px] text-gray-700">
                      <div className="font-semibold text-gray-600 mb-1">Category</div>
                      <span>{task.category || 'N/A'}</span>
                    </div>
                  </div>

                  {task.tags && task.tags.length > 0 && (
                    <div>
                      <div className="font-semibold text-[12px] text-gray-600 mb-1">Tags</div>
                      <div className="flex flex-wrap gap-1.5">
                        {task.tags.map((tag, idx) => (
                          <Badge key={idx} variant="outline" className="text-[10px] sm:text-xs border-gray-400">{tag}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Attachments indicator */}
                  {Array.isArray(task.attachments) && task.attachments.length > 0 && (
                    <div className="flex items-center gap-2 text-[12px] text-gray-700">
                      <Paperclip className="w-4 h-4" />
                      <span>{task.attachments.length} attachment(s)</span>
                    </div>
                  )}

                  {/* Editable Hours */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <div>
                      <div className="text-[12px] text-gray-600 mb-1">Estimated hours</div>
                      {isEditingTask ? (
                        <Input type="number" value={editEstimatedHours} onChange={(e) => setEditEstimatedHours(Number(e.target.value))} className="text-sm" />
                      ) : (
                        <div className="text-[12px] text-gray-800">{task.estimatedHours || 0}h</div>
                      )}
                    </div>
                    <div>
                      <div className="text-[12px] text-gray-600 mb-1">Completed hours</div>
                      {isEditingTask ? (
                        <Input type="number" value={editCompletedHours} onChange={(e) => setEditCompletedHours(Number(e.target.value))} className="text-sm" />
                      ) : (
                        <div className="text-[12px] text-gray-800">{task.completedHours || 0}h</div>
                      )}
                    </div>
                    <div>
                      <div className="text-[12px] text-gray-600 mb-1">Remaining hours</div>
                      {isEditingTask ? (
                        <Input type="number" value={editRemainingHours} onChange={(e) => setEditRemainingHours(Number(e.target.value))} className="text-sm" />
                      ) : (
                        <div className="text-[12px] text-gray-800">{(task.estimatedHours || 0) - (task.completedHours || 0) > 0 ? (task.estimatedHours || 0) - (task.completedHours || 0) : 0}h</div>
                      )}
                    </div>
                  </div>

                  {/* Comments Section */}
                  {Array.isArray(task.comments) && task.comments.length > 0 && (
                    <div className="pt-2">
                      <div className="font-semibold text-[12px] text-gray-600 mb-1">Comments</div>
                      <div className="space-y-2">
                        {task.comments.map((c, i) => (
                          <div key={i} className="p-2 bg-gray-50 border border-gray-200 rounded">
                            <div className="text-[12px] text-gray-900 font-medium">{c.author}</div>
                            <div className="text-[11px] text-gray-600">{c.timestamp}</div>
                            <div className="text-[12px] text-gray-800 mt-1">{c.content}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <Button
                      variant={isEditingTask ? "default" : "outline"}
                      className={`rounded-full text-xs sm:text-sm ${isEditingTask ? 'bg-[#1a2c47] text-white hover:bg-[#2a3c57]' : 'border-gray-300'}`}
                      onClick={() => setIsEditingTask(prev => !prev)}
                    >
                      {isEditingTask ? 'Done' : 'Edit'}
                    </Button>
                    <Button
                      className="bg-[#1a2c47] text-white hover:bg-[#2a3c57] rounded-full text-xs sm:text-sm"
                      onClick={() => setIsTaskDetailOpen(false)}
                    >
                      Close
                    </Button>
                  </div>
                </div>
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
};