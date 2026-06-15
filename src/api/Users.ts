import { BASE_URL } from "@/utils/BASE_URL";
import { getCsrfToken } from "@/utils/csrf";
import { toast } from "sonner";

export const getAllExecutive = async () => {
  try {
    const response = await fetch(`${BASE_URL}/content/contents/exe/`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCsrfToken(),
      },
    });

    if (response.status === 401) {
      localStorage.clear();
      window.location.href = "/login";
      throw new Error("Session expired. Please login again.");
    }

    if (response.status === 403) {
      throw new Error("You are not authorized to view executives.");
    }

    if (response.status >= 500) {
      toast.error("Internal server error. Please try again later.");
      throw new Error("Internal server error.");
    }

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage || `Failed to fetch executives. Status: ${response.status}`);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error("Error fetching executives:", error);
    throw error;
  }
};


export const getAllWriter = async () => {
  try {
    const res = await fetch(`${BASE_URL}/content/contents/writer`, {
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
      const data = await res.json().catch(() => ({}));
      throw new Error(data?.detail || "Session expired. Please login again.");
    }

    if (res.status === 403) {
      throw new Error("You are not authorized to view writers.");
    }

    if (res.status >= 500) {
      toast.error("Internal server error. Please try again later.");
      throw new Error("Internal server error.");
    }

    if (!res.ok) {
      const errorMessage = await res.text();
      throw new Error(errorMessage || `Failed to fetch writers. Status: ${res.status}`);
    }

    const data = await res.json();
    return data;

  } catch (error) {
    console.error("Error fetching writers:", error);
    throw error;
  }
};



// Invite a new user:  POST /accounts/invite/
// payload: { email, full_name, group, role }
export const inviteUser = async (payload: {
  email: string;
  full_name: string;
  group: string;
  role: string;
}) => {
  try {
    const res = await fetch(`${BASE_URL}/accounts/invite/`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCsrfToken(),
      },
      body: JSON.stringify(payload),
    });

    let data: any = null;
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
      const msg =
        data?.message || data?.error || data?.detail || "You are not authorized to invite users.";
      toast.error(msg);
      throw new Error(msg);
    }

    if (res.status >= 500) {
      toast.error("Internal server error. Please try again later.");
      throw new Error("Internal server error.");
    }

    if (!res.ok) {
      const msg =
        data?.message ||
        data?.error ||
        data?.detail ||
        (Array.isArray(data?.errors)
          ? data.errors
              .map((e: any) => (e?.field ? `${e.field}: ${e.message}` : e?.message))
              .join(" | ")
          : "Failed to invite user.");
      toast.error(msg);
      throw new Error(msg);
    }

    toast.success(data?.message || "Invitation sent successfully.");
    return data;
  } catch (error) {
    console.error("Invite User Error:", error);
    throw error;
  }
};


export const getAllUsers = async () => {
  try {
    const res = await fetch(`${BASE_URL}/accounts/users/all/`, {
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
      const data = await res.json().catch(() => ({}));
      throw new Error(data?.detail || "Session expired. Please login again.");
    }

    if (res.status === 403) {
      throw new Error("You are not authorized to view users.");
    }

    if (res.status >= 500) {
      toast.error("Internal server error. Please try again later.");
      throw new Error("Internal server error.");
    }

    if (!res.ok) {
      const errorMessage = await res.text();
      throw new Error(errorMessage || `Failed to fetch users. Status: ${res.status}`);
    }

    const data = await res.json();
    return data;

  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};


