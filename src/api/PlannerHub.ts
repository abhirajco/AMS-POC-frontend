import { BASE_URL } from "@/utils/BASE_URL";
import { toast } from "sonner";
import { getCsrfToken } from "@/utils/csrf";

export const getAllTasks = async () => {
  try {
    const res = await fetch(`${BASE_URL}/board/tasks/`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCsrfToken(),
      },
    });

    if (res.status === 401) {
      localStorage.clear();
      window.location.href =  "/login";
      return;
    }

    if (res.status === 403) {
      throw new Error("You are not authorized to access this resource.");
    }

    if (res.status >= 500) {
  toast.error("Server error. Please try again later.");
  throw new Error("Server error. Please try again later.");
}

    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      throw new Error(errorData?.message || "Failed to fetch tasks.");
    }

    const data = await res.json();
    console.log("Tasks:", data);
    return data;

  } catch (err: any) {
    console.error("Get Tasks Error:", err.message);
    if (err.name === "TypeError") {
      console.error("Network error or backend is down.");
    }
  }
};

