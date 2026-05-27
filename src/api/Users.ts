import { BASE_URL } from "@/utils/BASE_URL";

export const getAllExecutive = async () => {
  
  const token = localStorage.getItem("accessToken");

  if (!token)
  {
    localStorage.clear();
    window.location.href = "/login";
    throw new Error("Authentication token not found.");
  }

  try {
    const response = await fetch(`${BASE_URL}/content/contents/exe`,
      {
        method: "GET",
        headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage ||`Failed to fetch executives. Status: ${response.status}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error fetching executives:", error);
    throw error;
  }
};