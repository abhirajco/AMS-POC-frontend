import { useState, useEffect } from "react";
import { BASE_URL } from "@/utils/BASE_URL";
import { toast } from "sonner";

const EditTaskModal = ({ task, isOpen, onClose, onSuccess }: any) => {
  const [form, setForm] = useState<any>({});

  useEffect(() => {
    if (task) {
      setForm(task);
    }
  }, [task]);

  if (!isOpen || !task) return null;

  const handleChange = (e: any) =>
  {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      const res = await fetch(
        `${BASE_URL}/board/tasks/${task.id}/update/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify({
            title: form.title,
            description: form.description,
            priority: form.priority,
            marketing_type: form.marketing_type,
            due_date: form.due_date,
            status: form.status,
          }),
        }
      );

      if (!res.ok) throw new Error("Update failed");

      toast.success("Task updated");

      onSuccess?.();
      onClose();

    } catch (err) {
      console.error(err);
      toast.error("Update failed ");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white w-[500px] p-6 rounded-lg">

        <h2 className="text-lg font-semibold mb-4">Edit Task</h2>
        <label>Title</label>

        <input
          name="title"
          value={form.title || ""}
          onChange={handleChange}
          className="w-full border p-2 mb-2 rounded"
        />
        <label>Description</label>

        <textarea
          name="description"
          value={form.description || ""}
          onChange={handleChange}
          className="w-full border p-2 mb-2 rounded"
        />
         <label>Priority</label>
        <select
          name="priority"
          value={form.priority || ""}
          onChange={handleChange}
          className="w-full border p-2 mb-2 rounded"
        >
          <option value="">Priority</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        <label>Due Date</label>
        <input
          type="date"
          name="due_date"
          value={form.due_date || ""}
          onChange={handleChange}
          className="w-full border p-2 mb-3 rounded"
        />

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="border px-4 py-2 rounded">
            Cancel
          </button>

          <button
            onClick={handleUpdate}
            className="bg-[#1E2A44] text-white px-4 py-2 rounded"
          >
            Update
          </button>
        </div>

      </div>
    </div>
  );
};

export default EditTaskModal;