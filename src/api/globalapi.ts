import { BASE_URL } from "@/utils/BASE_URL";
import { getCsrfToken } from "@/utils/csrf";
import { toast } from "sonner";

// Shape of a single hit returned by the global hybrid search endpoint.
export interface GlobalSearchResult {
  type: string;
  id: string;
  title: string;
  snippet: string;
  score: number;
  match: "exact" | "semantic" | string;
}

export interface GlobalSearchResponse {
  query: string;
  exact_matches: GlobalSearchResult[];
  related_content: GlobalSearchResult[];
  total: number;
}

// Map a search hit to the page that should open when it's clicked.
// Returns null for unknown types so callers can skip navigation.
const RESULT_ROUTE_BY_TYPE: Record<string, (id: string) => string> = {
  content: (id) => `/editor/${id}`,
  task: (id) => `/planner/${id}`,
  campaign: (id) => `/campaign/${id}`,
  event: (id) => `/event/${id}`,
};

export const getSearchResultPath = (
  item: Pick<GlobalSearchResult, "type" | "id">
): string | null => {
  const buildPath = RESULT_ROUTE_BY_TYPE[item.type];
  return buildPath ? buildPath(item.id) : null;
};

// Global hybrid search.
//   GET /search/?q=<query>
// Returns exact_matches + related_content. Pass an AbortSignal so callers can
// cancel an in-flight request when the debounced query changes.
export const globalSearch = async (
  query: string,
  signal?: AbortSignal
): Promise<GlobalSearchResponse | null> => {
  try {
    const res = await fetch(
      `${BASE_URL}/search/?q=${encodeURIComponent(query)}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCsrfToken(),
        },
        signal,
      }
    );

    if (res.status === 401) {
      localStorage.removeItem("user");
      window.location.href = "/login";
      return null;
    }

    if (res.status === 403) {
      toast.error("You are not authorized to search.");
      return null;
    }

    if (res.status >= 500) {
      toast.error("Internal server error. Please try again later.");
      return null;
    }

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(
        errorData?.message || errorData?.detail || "Failed to search."
      );
    }

    return (await res.json()) as GlobalSearchResponse;
  } catch (err: any) {
    // Aborted requests are expected when the user keeps typing; stay quiet.
    if (err?.name === "AbortError") return null;
    console.error("Global Search Error:", err);
    return null;
  }
};
