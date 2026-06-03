// import { BASE_URL } from "@/utils/BASE_URL";
// import { toast } from "sonner";
// export const fetchAllEvent = async () => {
//     const token = localStorage.getItem("accessToken");

//     if (!token) {
//         localStorage.clear();
//         window.location.href = "/login";
//         return null;
//     }

//     try {
//         const res = await fetch(`${BASE_URL}/board/events`, {
//             method: "GET",
//             headers: {
//                 "Content-Type": "application/json",
//                 Authorization: `Bearer ${token}`,
//             },
//         });

//         if (res.status === 401) {
//             localStorage.clear();
//            window.location.href = "/login";
//             return null;
//         }

//         if (!res.ok) {
//             const errorData = await res.json().catch(() => ({}));
//             throw new Error(errorData?.message || errorData?.error || "Failed to fetch events");
//         }

//         const data = await res.json();
//         return data;

//     } catch (err: any) {
//         console.error("Fetch Event Error:", err);
//         return null;
//     }
// };

// export const createEvent = async (eventData: any) => {
//     const token = localStorage.getItem("accessToken");
//     if (!token) {
//         localStorage.clear();
//         window.location.href = "/login";
//     }
//     try {
//         const res = await fetch(`${BASE_URL}/board/events/`, {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//                  Authorization: `Bearer ${token}`,
//             },
//             body: JSON.stringify(eventData)
//         });
//         const data = await res.json();
//         if (res.status === 401) {
//             localStorage.clear();
//             window.location.href = "/login";
//             throw new Error("Session expired. Please login again.");
//         }

//         if (res.status === 403) {
//             toast.error(data?.message || data?.error || data?.detail || "Access forbidden");
//             throw new Error(data?.message || data?.error || data?.detail || "Access forbidden");
//         }

//         if (!res.ok) {
//             throw new Error(data?.message || data?.error || data?.detail ||"Failed to create campaign");
//         }

//          if (res.ok) {
//             toast.success("Event created successfully");
//         }

//         return data;
//     }
//     catch (err) {
//         console.error(err);
//         throw err;
//     }
// }


import { BASE_URL } from "@/utils/BASE_URL";
import { getCsrfToken } from "@/utils/csrf";
import { toast } from "sonner";

export const fetchAllEvent = async () => {
  try {
    const res = await fetch(`${BASE_URL}/board/events/all`, {
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