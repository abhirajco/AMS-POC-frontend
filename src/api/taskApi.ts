import { getCsrfToken } from "@/utils/csrf";
import { BASE_URL } from "@/utils/BASE_URL";

const cookieHeaders = () => ({
  "Content-Type": "application/json",
  "X-CSRFToken": getCsrfToken(),
});

export const getTasks = async () => {
  const res = await fetch(`${BASE_URL}/board/tasks/`, {
    method: "GET",
    credentials: "include",
    headers: cookieHeaders(),
  });
  return await res.json();
};

export const updateTaskStatus = async (id: string, status: string) => {
  const res = await fetch(`${BASE_URL}/board/tasks/${id}/update/`, {
    method: "PATCH",
    credentials: "include",
    headers: cookieHeaders(),
    body: JSON.stringify({ status }),
  });
  return await res.json();
};

export const getTaskDetail = async (taskId: string) => {
  const res = await fetch(`${BASE_URL}/board/tasks/${taskId}/`, {
    method: "GET",
    credentials: "include",
    headers: cookieHeaders(),
  });
  return await res.json();
};

export const filterTasks = async (params: Record<string, any>) => {
  const cleaned = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== "")
  );
  const query = new URLSearchParams(cleaned).toString();
  const res = await fetch(`${BASE_URL}/board/tasks/filter/?${query}`, {
    method: "GET",
    credentials: "include",
    headers: cookieHeaders(),
  });
  return await res.json();
};

export const apiFetch = async (
  endpoint: string,
  options: RequestInit = {}
) => {
  const isFormData = options.body instanceof FormData;

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: options.method || "GET",
    credentials: "include",
    body: options.body,
    headers: {
      "X-CSRFToken": getCsrfToken(),
      ...(!isFormData && options.body && { "Content-Type": "application/json" }),
      ...(options.headers || {}),
    },
  });

  const text = await res.text();

  try {
    const data = text ? JSON.parse(text) : {};

    if (!res.ok) {
      console.error("API ERROR RESPONSE:", data);
      throw new Error("API Error");
    }

    return data;
  } catch (e) {
    console.error("RAW RESPONSE:", text);
    throw new Error("Invalid JSON response");
  }
};


export const filterContents = async (params: Record<string, any>) => {
  const cleaned = Object.fromEntries(
    Object.entries(params).filter(
      ([, v]) => v !== undefined && v !== null && v !== ""
    )
  );

  const query = new URLSearchParams(cleaned).toString();

  const res = await fetch(
    `${BASE_URL}/content/contents/filter/?${query}`,
    {
      method: "GET",
      credentials: "include",
      headers: cookieHeaders(),
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to filter contents: ${res.status}`);
  }

  return await res.json();
};
