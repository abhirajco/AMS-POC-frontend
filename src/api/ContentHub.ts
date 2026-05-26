import { toast } from "sonner";
import { BASE_URL } from "@/utils/BASE_URL";


export const createContent = async (payload: any) => {
    const token = localStorage.getItem("accessToken");
    try {

        if (!token) {
            toast.error("Session expired. Please login again.");
            localStorage.clear();
            window.location.href = "/login";
            return;
        }

        const res = await fetch(`${BASE_URL}/content/contents/new`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        const data = await res.json();


    }
    catch (err) {

    }
}

