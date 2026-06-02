import { useState } from "react";
import { toast } from "sonner";
import { BASE_URL } from "@/utils/BASE_URL";
import { getCsrfToken } from "@/utils/csrf";

const CreateTaskModal = ({ isOpen, onClose, onSuccess }: any) => {
  const [loading, setLoading] = useState(false);
  const [userSearch, setUserSearch] = useState("");
  const [userResults, setUserResults] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "",
    marketing_type: "",
    assigned_to: "",
    due_date: "",
    launch_date: "",
    tags: "",
  });

  if (!isOpen) return null;

  const searchUsers = async (query: string) => {
  try {
    const res = await fetch(
      `${BASE_URL}/accounts/users/search/?q=${query}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCsrfToken(),
        },
      }
    );

    const data = await res.json();
    setUserResults(data);
  } catch (err) {
    console.error(err);
  }
};

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${BASE_URL}/board/tasks/`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCsrfToken(),
        },
        // body: JSON.stringify({
        //   title: form.title,
        //   description: form.description,
        //   priority: form.priority.toLowerCase(),
        //   marketing_type: form.marketing_type,
        //   assigned_to: Number(form.assigned_to),
        //   due_date: form.due_date,
        //   tags: form.tags,
        // }),
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          priority: form.priority.toLowerCase(),
          marketing_type: form.marketing_type,
          assigned_to: selectedUser?.id,   // ✅ IMPORTANT CHANGE
          due_date: form.due_date,
          tags: form.tags,
       }),
      });
      setSelectedUser(null);
       setUserSearch("");
        setUserResults([]);

      if (!res.ok) throw new Error("Failed to create task");

      toast.success("Task created ");

      onSuccess?.();
      onClose();

      setForm({
        title: "",
        description: "",
        priority: "",
        marketing_type: "",
        assigned_to: "",
        due_date: "",
        launch_date: "",
        tags: "",
      });

    } catch (err) {
      console.error(err);
      toast.error("Error creating task ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[600px] rounded-lg p-6 shadow-lg">

        <h2 className="text-lg font-semibold mb-1">Create New Task</h2>
        <p className="text-sm text-gray-500 mb-3">
          Fill out the form below to create a new task for your marketing activities.
        </p>

        {/* TITLE */}
        <div className="mb-2">
          <label className="text-sm font-medium">Task Title</label>
          <input
            name="title"
            placeholder="Enter task title..."
            value={form.title}
            onChange={handleChange}
            className="w-full border p-2 rounded mt-1"
          />
        </div>

        {/* DESCRIPTION */}
        <div className="mb-2">
          <label className="text-sm font-medium">Description</label>
          <textarea
            name="description"
            placeholder="Enter task description..."
            value={form.description}
            onChange={handleChange}
            className="w-full border p-2 rounded mt-1"
          />
        </div>

        {/* PRIORITY + MARKETING TYPE */}
        <div className="flex gap-3 mb-2">
          <div className="w-1/2">
            <label className="text-sm font-medium">Priority</label>
            <select
              name="priority"
              value={form.priority}
              onChange={handleChange}
              className="w-full border p-2 rounded mt-1"
            >
              <option value="">Select priority</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div className="w-1/2">
            <label className="text-sm font-medium">Marketing Type</label>
            <select
              name="marketing_type"
              value={form.marketing_type}
              onChange={handleChange}
              className="w-full border p-2 rounded mt-1"
            >
              <option value="">Select type</option>
              <option>Social Media</option>
              <option>Email Campaign</option>
              <option>Content</option>
              <option>SEO</option>
              <option>Paid Ads</option>
            </select>
          </div>
        </div>

        {/* ASSIGNEE + DUE DATE */}
        <div className="flex gap-3 mb-2">
          <div className="w-1/2">
            <label className="text-sm font-medium">Assign To</label>
           <input
           type="text"
           placeholder="Search user..."
           value={selectedUser ? selectedUser.full_name : userSearch}
           onChange={(e) => {
           setUserSearch(e.target.value);
           setSelectedUser(null);
           searchUsers(e.target.value);
          }}
          className="w-full border p-2 rounded mt-1"
          />
          {userResults.length > 0 && !selectedUser && (
    <div className="absolute bg-white border w-full mt-1 rounded shadow max-h-40 overflow-y-auto z-10">
      {userResults.map((user) => (
        <div
          key={user.id}
          onClick={() => {
            setSelectedUser(user);
            setUserSearch("");
            setUserResults([]);
          }}
          className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
        >
          {user.full_name} ({user.email})
        </div>
      ))}
    </div>
  )}
          </div>

          <div className="w-1/2">
            <label className="text-sm font-medium">Due Date</label>
            <input
              type="date"
              name="due_date"
              value={form.due_date}
              onChange={handleChange}
              className="w-full border p-2 rounded mt-1"
            />
          </div>
        </div>

        {/* LAUNCH DATE */}

        {/* TAGS */}
        <div className="mb-2">
          <label className="text-sm font-medium">Tags</label>
          <input
            name="tags"
            placeholder="e.g. content, blog, AI"
            value={form.tags}
            onChange={handleChange}
            className="w-full border p-2 rounded mt-1"
          />
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 border rounded">
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 bg-[#1E2A44] text-white rounded"
          >
            {loading ? "Creating..." : "Create Task"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTaskModal;