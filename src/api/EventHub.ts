import { BASE_URL } from "@/utils/BASE_URL";
import { getCsrfToken } from "@/utils/csrf";
import { toast } from "sonner";


const cookieHeaders = () => ({
  "Content-Type": "application/json",
  "X-CSRFToken": getCsrfToken(),
});

export const fetchAllEvent = async () => {
  try {
    const res = await fetch(`${BASE_URL}/board/events/all/`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCsrfToken(),
      },
    });

    if (res.status === 401) {
      localStorage.clear();
      window.location.href = "/login";
      return null;
    }

    if (res.status === 403) {
      toast.error("You are not authorized to view events.");
      return null;
    }

    if (res.status >= 500) {
      toast.error("Internal server error. Please try again later.");
      return null;
    }

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData?.message || errorData?.error || "Failed to fetch events");
    }

    const data = await res.json();
    return data;

  } catch (err: any) {
    console.error("Fetch Event Error:", err);
    return null;
  }
};


export const createEvent = async (eventData: any) => {
  try {
    const res = await fetch(`${BASE_URL}/board/events/`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCsrfToken(),
      },
      body: JSON.stringify(eventData),
    });

    let data = null;

    try {
      data = await res.json();
    } catch {
      data = {};
    }

    if (res.status === 401) {
      localStorage.clear();
      window.location.href = "/login";
      throw new Error("Session expired. Please login again.");
    }

    if (res.status === 403) {
      toast.error(data?.message || data?.error || data?.detail || "Access forbidden");
      throw new Error(data?.message || data?.error || data?.detail || "Access forbidden");
    }

    if (res.status >= 500) {
      toast.error("Internal server error. Please try again later.");
      throw new Error("Internal server error.");
    }

    if (!res.ok) {
      toast.error(data?.message || data?.error || data?.detail || "Failed to create event");
      throw new Error(data?.message || data?.error || data?.detail || "Failed to create event");
    }

    toast.success("Event created successfully");
    return data;

  } catch (err) {
    console.error(err);
    throw err;
  }
};


export const updateEvent = async (eventId: string, updatedData: any) => {
  try {
    const response = await fetch(`${BASE_URL}/board/events/${eventId}/`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCsrfToken(),
      },
      body: JSON.stringify(updatedData),
    });

    let data = null;

    try {
      data = await response.json();
    } catch {
      data = {};
    }

    if (response.status === 401) {
      localStorage.clear();
      window.location.href = "/login";
      throw new Error(data?.message || data?.detail || "Session expired. Please login again.");
    }

    if (response.status === 403) {
      toast.error(data?.message || data?.detail || "You are not authorized to update this event.");
      throw new Error(data?.message || data?.detail || "Forbidden access.");
    }

    if (response.status === 400) {
      toast.error(data?.message || data?.detail || "Invalid event data.");
      throw new Error(data?.message || data?.detail || "Bad request.");
    }

    if (response.status === 404) {
      toast.error(data?.message || data?.detail || "Event not found.");
      throw new Error("Event not found.");
    }

    if (response.status >= 500) {
      toast.error("Internal server error. Please try again later.");
      throw new Error("Internal server error.");
    }

    if (!response.ok) {
      toast.error(data?.message || data?.detail || "Failed to update event.");
      throw new Error(data?.message || data?.detail || "API request failed.");
    }

    toast.success(data?.message || "Event updated successfully.");
    return data;
  } catch (error: any) {
    console.error("Update Event Error:", error);

    if (error.message !== "Session expired. Please login again.") {
      toast.error(error.message || "Something went wrong.");
    }
    throw error;
  }
};


export const filterEvents = async (params: Record<string, any>) => {
  const cleaned = Object.fromEntries(
    Object.entries(params).filter(
      ([, v]) => v !== undefined && v !== null && v !== ""
    )
  );

  const query = new URLSearchParams(
    cleaned as Record<string, string>
  ).toString();

  const res = await fetch(
    `${BASE_URL}/board/events/filter/?${query}`,
    {
      method: "GET",
      credentials: "include",
      headers: cookieHeaders(),
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to filter events: ${res.status}`);
  }

  return await res.json();
};