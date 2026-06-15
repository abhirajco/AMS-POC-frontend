import { BASE_URL } from "@/utils/BASE_URL";
import { getCsrfToken } from "@/utils/csrf";
import { toast } from "sonner";

const cookieHeaders = () => ({
  "Content-Type": "application/json",
  "X-CSRFToken": getCsrfToken(),
});

// Django REST Framework returns validation errors as a flat string
// (message/error/detail) OR as a field-keyed map like
// { title: ["This field may not be blank."], assigned_team: ["..."] }.
// Flatten whatever shape we got into a single human-readable message so the
// toast shows the real reason instead of a generic "bad request".
const extractApiError = (data: any, fallback: string): string => {
  if (!data) return fallback;
  if (typeof data === "string") return data;

  // Shape: { errors: [{ field, message }, ...] }
  if (Array.isArray(data.errors)) {
    const parts = data.errors
      .map((e: any) =>
        e?.field && e.field !== "non_field_errors"
          ? `${e.field}: ${e.message ?? ""}`.trim()
          : e?.message ?? String(e)
      )
      .filter(Boolean);
    if (parts.length) return parts.join(" | ");
  }

  if (typeof data.message === "string") return data.message;
  if (typeof data.error === "string") return data.error;
  if (typeof data.detail === "string") return data.detail;

  // Shape: { field: ["msg"], ... } (plain DRF serializer errors)
  const parts: string[] = [];
  for (const [field, value] of Object.entries(data)) {
    if (field === "errors") continue;
    const text = Array.isArray(value) ? value.join(", ") : String(value);
    parts.push(field === "non_field_errors" ? text : `${field}: ${text}`);
  }

  return parts.length ? parts.join(" | ") : fallback;
};


export const getAllCampaign = async () => {
  try {
    const response = await fetch(`${BASE_URL}/board/campaigns/`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCsrfToken(),
      },
    });

    let data = null;

    try {
      data = await response.json();
    } catch {
      data = {};
    }

    if (response.status === 401) {
      localStorage.removeItem("user");
      window.location.href = "/login";
      throw new Error(
        data?.message ||
        data?.detail ||
        "Session expired. Please login again."
      );
    }

    if (response.status === 403) {
      toast.error(data?.message || data?.detail || "You are not authorized to access campaigns.");
      throw new Error(data?.message || data?.detail || "Forbidden access.");
    }

    if (response.status === 404) {
      toast.error(
        data?.message ||
        data?.detail ||
        "Campaigns not found."
      );

      throw new Error("Campaigns not found.");
    }

    if (response.status >= 500) {
      toast.error("Internal server error. Please try again later.");
      throw new Error("Internal server error.");
    }

    if (!response.ok) {
      toast.error(data?.message || data?.detail || "Failed to fetch campaigns.");
      throw new Error(data?.message || data?.detail || "API request failed.");
    }

    return data;
  } catch (error: any) {
    console.error("Get All Campaign Error:", error);

    if (error.message !== "Session expired. Please login again.") {
      toast.error(error.message || "Something went wrong.");
    }

    throw error;
  }
};

export const createCampaign = async (campaignData: any) => {
  try {
    const response = await fetch(`${BASE_URL}/board/campaigns/`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCsrfToken(),
      },
      body: JSON.stringify(campaignData),
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
      throw new Error("Session expired. Please login again.");
    }

    if (response.status === 403) {
      const msg = extractApiError(data, "Access forbidden");
      toast.error(msg);
      throw new Error(msg);
    }

    if (!response.ok) {
      const msg = extractApiError(data, "Failed to create campaign");
      toast.error(msg);
      throw new Error(msg);
    }

    return data;
  } catch (error: any) {
    if (error.name === "TypeError") {
      throw new Error("Network error. Please check your internet.");
    }

    throw error;
  }
};


export const getSelectedCampaign = async (campaignId: string) => {
  try {
    const response = await fetch(`${BASE_URL}/board/campaigns/${campaignId}/`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCsrfToken(),
      },
    });

    let data = null;

    try {
      data = await response.json();
    } catch {
      data = null;
    }

    if (response.status === 401) {
      localStorage.removeItem("user");
      window.location.href = "/login";
      throw new Error(data?.message || "Session expired. Please login again.");
    }

    if (response.status === 403) {
      toast.error(
        data?.message ||
          data?.detail ||
          "You are not authorized to access this campaign."
      );

      throw new Error(
        data?.message ||
          data?.detail ||
          "Forbidden access."
      );
    }

    if (response.status === 404) {
      toast.error(data?.message || "Campaign not found.");
      throw new Error("Campaign not found.");
    }

    if (response.status >= 500) {
      toast.error("Internal server error. Please try again later.");
      throw new Error("Internal server error.");
    }

    if (!response.ok) {
      toast.error(data?.message || data?.detail || "Something went wrong.");
      throw new Error(data?.message || data?.detail || "API request failed.");
    }

    return data;
  } catch (error: any) {
    console.error("Get Particular Campaign Error:", error);

    if (error.message !== "Session expired. Please login again.") {
      toast.error(error.message || "Something went wrong.");
    }

    throw error;
  }
};


export const deleteCampaign = async (campaignId: string) => {
  try {
    const response = await fetch(`${BASE_URL}/board/campaigns/${campaignId}/`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCsrfToken(),
      },
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
      toast.error(data?.message || data?.detail || "You are not authorized to delete this campaign.");
      throw new Error(data?.message || data?.detail || "Forbidden access.");
    }

    if (response.status === 404) {
      toast.error(data?.message || data?.detail || "Campaign not found.");
      throw new Error("Campaign not found.");
    }

    if (response.status >= 500) {
      toast.error("Internal server error. Please try again later.");
      throw new Error("Internal server error.");
    }

    if (!response.ok) {
      toast.error(data?.message || data?.detail || "Failed to delete campaign.");
      throw new Error(data?.message || data?.detail || "API request failed.");
    }

    toast.success(data?.message || "Campaign deleted successfully.");
    return data;
  } catch (error: any) {
    console.error("Delete Campaign Error:", error);

    if (error.message !== "Session expired. Please login again.") {
      toast.error(error.message || "Something went wrong.");
    }
    throw error;
  }
};


export const updateCampaign = async (campaignId: string, updatedData: any) => {
  try {
    const response = await fetch(`${BASE_URL}/board/campaigns/${campaignId}/`, {
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
      localStorage.removeItem("user");
      window.location.href = "/login";

      throw new Error(
        data?.message ||
          data?.detail ||
          "Session expired. Please login again."
      );
    }

    if (response.status === 403) {
      toast.error(
        data?.message ||
          data?.detail ||
          "You are not authorized to update this campaign."
      );

      throw new Error(
        data?.message ||
          data?.detail ||
          "Forbidden access."
      );
    }

    if (response.status === 400) {
      const msg = extractApiError(data, "Invalid campaign data.");
      toast.error(msg);
      throw new Error(msg);
    }

    if (response.status === 404) {
      toast.error(
        data?.message ||
          data?.detail ||
          "Campaign not found."
      );

      throw new Error("Campaign not found.");
    }

    if (response.status >= 500) {
      toast.error("Internal server error. Please try again later.");
      throw new Error("Internal server error.");
    }

    if (!response.ok) {
      toast.error(
        data?.message ||
          data?.detail ||
          "Failed to update campaign."
      );

      throw new Error(
        data?.message ||
          data?.detail ||
          "API request failed."
      );
    }

    toast.success(data?.message || "Campaign updated successfully.");
    return data;
  } catch (error: any) {
    console.error("Update Campaign Error:", error);

    if (error.message !== "Session expired. Please login again.") {
      toast.error(error.message || "Something went wrong.");
    }

    throw error;
  }
};


export const getCampaignEvents = async (campaignId: string) => {
  try {
    const res = await fetch(`${BASE_URL}/board/campaigns/${campaignId}/events/`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCsrfToken(),
      },
    });

    let data = null;

    try {
      data = await res.json();
    } catch {
      data = null;
    }

    if (res.status === 401) {
      localStorage.removeItem("user");
      window.location.href = "/login";
      throw new Error(data?.message || data?.detail || "Session expired. Please login again.");
    }

    if (res.status === 403) {
      toast.error(data?.message || data?.detail || "You are not authorized to access campaign events.");
      throw new Error(data?.message || data?.detail || "Forbidden access.");
    }

    if (res.status === 404) {
      toast.error(data?.message || data?.detail || "Campaign events not found.");
      throw new Error("Campaign events not found.");
    }

    if (res.status >= 500) {
      toast.error("Internal server error. Please try again later.");
      throw new Error("Internal server error.");
    }

    if (!res.ok) {
      throw new Error(
        data?.message ||
        data?.detail ||
        "Failed to fetch campaign events"
      );
    }

    return data;
  } catch (err: any) {
    console.error("GET CAMPAIGN EVENTS ERROR:", err);
    throw new Error(err.message || "Something went wrong");
  }
};


export const getCampaignTasks = async (campaignId: string) => {
  try {
    const res = await fetch(`${BASE_URL}/board/campaigns/${campaignId}/tasks`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCsrfToken(),
      },
    });

    let data = null;

    try {
      data = await res.json();
    } catch {
      data = null;
    }

    if (res.status === 401) {
      localStorage.removeItem("user");
      window.location.href = "/login";

      throw new Error(
        data?.message ||
        data?.detail ||
        "Session expired. Please login again."
      );
    }

    if (res.status === 403) {
      toast.error(data?.message || data?.detail || "You are not authorized to view campaign tasks.");
      throw new Error(data?.message || data?.detail || "Forbidden access.");
    }

    if (res.status === 404) {
      toast.error(data?.message || data?.detail || "Campaign not found.");
      throw new Error("Campaign not found.");
    }

    if (res.status >= 500) {
      toast.error("Internal server error. Please try again later.");
      throw new Error("Internal server error.");
    }

    if (!res.ok) {
      toast.error(data?.message || data?.detail || "Failed to fetch campaign tasks.");
      throw new Error(data?.message || data?.detail || "API request failed.");
    }

    return data;
  } catch (err: any) {
    console.error("GET CAMPAIGN TASKS ERROR:", err);
    throw err;
  }
};


export const filterCampaigns = async (params: Record<string, any>) => {
  const cleaned = Object.fromEntries(
    Object.entries(params).filter(
      ([, v]) => v !== undefined && v !== null && v !== ""
    )
  );

  const query = new URLSearchParams(
    cleaned as Record<string, string>
  ).toString();

  try {
    const res = await fetch(
      `${BASE_URL}/board/campaigns/filter/?${query}`,
      {
        method: "GET",
        credentials: "include",
        headers: cookieHeaders(),
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to filter campaigns: ${res.status}`);
    }

    return await res.json();
  } catch (err: any) {
    console.error("FILTER CAMPAIGNS ERROR:", err);
    throw err;
  }
};

export const getCampaignHistoryById = async (
  campaignId: string
) => {
  try {

    console.log("Callin gthe APiu which fetches the history  $$$$$$$$$$$$$$$$$$$")
    const response = await fetch(
      `${BASE_URL}/board/campaigns/${campaignId}/history/`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCsrfToken(),
        },
      }
    );

    let data = null;

    try {
      data = await response.json();
    } catch {
      data = null;
    }

    if (response.status === 401) {
      localStorage.removeItem("user");
      window.location.href = "/login";

      throw new Error(
        data?.message ||
          data?.detail ||
          "Session expired. Please login again."
      );
    }

    if (response.status === 403) {
      toast.error(
        data?.message ||
          data?.detail ||
          "You are not authorized to access this campaign history."
      );

      throw new Error(
        data?.message ||
          data?.detail ||
          "Forbidden access."
      );
    }

    if (response.status === 404) {
      toast.error(
        data?.message ||
          data?.detail ||
          "Campaign history not found."
      );

      throw new Error("Campaign history not found.");
    }

    if (response.status >= 500) {
      toast.error(
        "Internal server error. Please try again later."
      );

      throw new Error("Internal server error.");
    }

    if (!response.ok) {
      toast.error(
        data?.message ||
          data?.detail ||
          "Failed to fetch campaign history."
      );

      throw new Error(
        data?.message ||
          data?.detail ||
          "API request failed."
      );
    }

    return data;
  } catch (error: any) {
    console.error(
      "Get Campaign History Error:",
      error
    );

    if (
      error.message !==
      "Session expired. Please login again."
    ) {
      toast.error(
        error.message || "Something went wrong."
      );
    }

    throw error;
  }
};


export const getTeamMembers = async (query: string) => {
  const response = await fetch(`${BASE_URL}/api/accounts/users/search/?search=${query}`,
    {
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to search users"
    );
  }

  return response.json();
};