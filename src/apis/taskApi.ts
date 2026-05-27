const BASE_URL = "http://127.0.0.1:8000/api";

const getToken = () => localStorage.getItem("accessToken");

export const getTasks = async () => {
  const res = await fetch(`${BASE_URL}/board/tasks/`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return await res.json();
};

// Update task status
export const updateTaskStatus = async (id: number, status: string) => {
  const res = await fetch(`${BASE_URL}/board/tasks/${id}/update/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ status }),
  });

  return await res.json();
};

export const filterTasks = async (params: Record<string, any>) => {
  const query = new URLSearchParams(params).toString();

  const res = await fetch(
    `${BASE_URL}/board/tasks/filter/?${query}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  return await res.json();
};

export const apiFetch = async (
  endpoint: string,
  options: RequestInit = {}
) => {
  const token = localStorage.getItem("accessToken");

  const isFormData = options.body instanceof FormData;

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: options.method || "GET",
    body: options.body,
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),

      // ✅ ONLY for JSON (NOT FormData)
      ...(!isFormData && options.body && {
        "Content-Type": "application/json",
      }),

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
