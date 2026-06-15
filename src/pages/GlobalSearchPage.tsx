import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import HeaderSection from "@/components/common/HeaderSection";
import { Card, CardContent } from "@/components/ui/card";
import {
  globalSearch,
  getSearchResultPath,
  type GlobalSearchResponse,
  type GlobalSearchResult,
} from "@/api/globalapi";

// Color the small type badge per result kind so they're easy to scan.
const TYPE_BADGE_STYLES: Record<string, string> = {
  content: "bg-blue-50 text-blue-600",
  task: "bg-amber-50 text-amber-600",
  event: "bg-purple-50 text-purple-600",
};

// A single result as its own card: title + snippet on the left, type badge on the right.
const ResultCard = ({
  item,
  onSelect,
}: {
  item: GlobalSearchResult;
  onSelect: (item: GlobalSearchResult) => void;
}) => (
  <Card
    onClick={() => onSelect(item)}
    className="bg-white border border-gray-300 hover:shadow-md transition-shadow cursor-pointer"
  >
    <CardContent className="p-3 sm:p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h2 className="font-medium text-[13px] sm:text-[14px] text-black mb-1 sm:mb-2 leading-snug">
            {item.title}
          </h2>
          {item.snippet && (
            <p className="text-[11px] sm:text-[12px] text-gray-600 leading-snug">
              {item.snippet.replace(/<[^>]*>/g, "")}
            </p>
          )}
        </div>
        <span
          className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
            TYPE_BADGE_STYLES[item.type] ?? "bg-gray-100 text-gray-500"
          }`}
        >
          {item.type}
        </span>
      </div>
    </CardContent>
  </Card>
);

const GlobalSearchPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = (searchParams.get("q") ?? "").trim();

  // Open the page a result points to, based on its type + id.
  const handleSelectResult = (item: GlobalSearchResult) => {
    const path = getSearchResultPath(item);
    if (path) navigate(path);
  };

  const [results, setResults] = useState<GlobalSearchResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) {
      setResults(null);
      return;
    }

    const controller = new AbortController();
    setLoading(true);

    (async () => {
      const data = await globalSearch(query, controller.signal);
      if (!controller.signal.aborted) {
        setResults(data);
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [query]);

  // Show exact matches first, then related content, in one flat list.
  const allResults = results
    ? [...results.exact_matches, ...results.related_content]
    : [];

  return (
    <div className="bg-neutral-50 min-h-full flex flex-col">
      <HeaderSection />

      <div className="my-8 px-6">
        {loading && (
          <div className="flex items-center gap-2 px-1 py-10 text-sm text-gray-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            Searching…
          </div>
        )}

        {!loading && !query && (
          <div className="px-1 py-10 text-center text-sm text-gray-500">
            Type a search term to see results.
          </div>
        )}

        {!loading && query && allResults.length === 0 && (
          <div className="px-1 py-10 text-center text-sm text-gray-500">
            No results found for “{query}”
          </div>
        )}

        {!loading && allResults.length > 0 && (
          <div className="space-y-2.5">
            {allResults.map((item) => (
              <ResultCard
                key={`${item.type}-${item.id}`}
                item={item}
                onSelect={handleSelectResult}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GlobalSearchPage;
