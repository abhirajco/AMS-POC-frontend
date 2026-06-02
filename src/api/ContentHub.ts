import { toast } from "sonner";
import { BASE_URL } from "@/utils/BASE_URL";
import { getCsrfToken } from "@/utils/csrf";

interface CreateContentPayload {
  title: string;
  brief: string;
  content_type: string;
  campaign_id: string;
  event_id?: string;
  tags?: string;
  executive_id?: string;
}

interface ApiError {
  status: number;
  message: string;
  data?: any;
}

interface AssignSmeResponse {
  message?: string;
  detail?: string;
}

export interface ContentFilters {
  status?: string;
  content_type?: string;
  author_id?: string;
  campaign_id?: string;
  month?: number;
  quarter?: number;
  year?: number;
}


export const createContent = async (payload: CreateContentPayload) => {
  try {
    const response = await fetch(`${BASE_URL}/content/contents/new/`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCsrfToken(),
      },
      body: JSON.stringify(payload),
    });

    let data: any = {};

    const contentType = response.headers.get("content-type");

    if (contentType?.includes("application/json")) {
      try {
        data = await response.json();
      } catch {
        data = {};
      }
    }

    if (response.status === 401) {
      toast.error("Session expired. Please login again.");
      localStorage.clear();
      window.location.href = "/login";

      throw {
        status: 401,
        message: data?.messages?.[0]?.message || "Unauthorized",
        data,
      } as ApiError;
    }

    if (response.status === 403) {
      toast.error(
        data?.detail ||
        data?.[0]?.message ||
        "You are not authorized to perform this action."
      );

      throw {
        status: 403,
        message: data?.detail || "Forbidden",
        data,
      } as ApiError;
    }

    if (response.status >= 500) {
      toast.error("Server error occurred. Please try again later.");

      throw {
        status: response.status,
        message: "Internal Server Error",
        data,
      } as ApiError;
    }

    if (!response.ok) {
      toast.error(data?.message || "Something went wrong.");

      throw {
        status: response.status,
        message: data?.details || data?.message || "Request failed",
        data,
      } as ApiError;
    }

    return data;

  } catch (error: any) {
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      toast.error("Network error. Please check your internet connection.");

      throw {
        status: 0,
        message: "Network Error",
      } as ApiError;
    }

    throw error;
  }
};


export const assignSme = async (
  contentId: string,
  executiveId: string
): Promise<AssignSmeResponse> => {

  if (!contentId) {
    throw {
      status: 400,
      message: "Content ID is required",
    } as ApiError;
  }

  if (!executiveId) {
    throw {
      status: 400,
      message: "Executive ID is required",
    } as ApiError;
  }

  try {
    const response = await fetch(
      `${BASE_URL}/content/contents/${contentId}/assign-sme/`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCsrfToken(),
        },
        body: JSON.stringify({
          executive_id: executiveId,
        }),
      }
    );

    let data: any = {};
    const contentType = response.headers.get("content-type");

    if (contentType?.includes("application/json")) {
      try {
        data = await response.json();
      } catch {
        data = {};
      }
    }

    if (response.status === 401 || data?.code === "token_not_valid") {
      const tokenMessage =
        data?.messages?.[0]?.message ||
        data?.detail ||
        "Session expired";

      localStorage.clear();
      window.location.href = "/login";

      throw {
        status: 401,
        message: tokenMessage,
        data,
      } as ApiError;
    }

    if (response.status === 403) {
      const message =
        data?.detail || "You do not have permission to perform this action.";
      toast.error(message);

      throw {
        status: 403,
        message,
        data,
      } as ApiError;
    }

    if (response.status === 400) {
      const message = data?.detail || data?.message || "Invalid request.";
      toast.error(message);

      throw {
        status: 400,
        message,
        data,
      } as ApiError;
    }

    if (response.status === 404) {
      const message = data?.detail || "Requested resource not found.";

      throw {
        status: 404,
        message,
        data,
      } as ApiError;
    }

    if (response.status >= 500) {
      toast.error("Server error occurred. Please try again later.");

      throw {
        status: response.status,
        message: "Internal Server Error",
        data,
      } as ApiError;
    }

    if (!response.ok) {
      const message =
        data?.detail ||
        data?.message ||
        "Something went wrong.";

      throw {
        status: response.status,
        message,
        data,
      } as ApiError;
    }

    return data;

  } catch (error: any) {
    if (error.name === "AbortError") {
      toast.error("Request timeout. Please try again.");

      throw {
        status: 408,
        message: "Request timeout",
      } as ApiError;
    }

    if (error instanceof TypeError && error.message === "Failed to fetch") {
      toast.error("Network error. Check your internet connection.");

      throw {
        status: 0,
        message: "Network Error",
      } as ApiError;
    }

    throw error;
  }
};


export const getAllContents = async (filters: ContentFilters) => {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (
      value !== undefined &&
      value !== null &&
      value !== "" &&
      value !== "all"
    ) {
      params.append(key, String(value));
    }
  });

  const response = await fetch(
    `${BASE_URL}/content/contents/filter/?${params.toString()}`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCsrfToken(),
      },
    }
  );

  if (response.status === 404) {
    throw new Error("Content not found");
  }

  if (response.status >= 500) {
    throw new Error("Server error");
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    throw new Error(
      errorData?.message ||
      errorData?.detail ||
      "Failed to fetch contents"
    );
  }

  return response.json();
};


export const getContentById = async (id: string) => {
  try {
    const response = await fetch(`${BASE_URL}/content/contents/${id}`, {
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
      localStorage.clear();
      throw new Error("Unauthorized access.");
    }

    if (response.status === 404) {
      throw new Error("Content not found.");
    }

    if (response.status >= 500) {
      throw new Error("Server error. Please try again later.");
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.message ||
        errorData?.detail ||
        "Failed to fetch content."
      );
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error("getContentById Error:", error);
    throw error;
  }
};