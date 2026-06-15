import { Input } from "../ui/input";
import { Search, Bell, Loader2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { IconButton, Menu, MenuItem, Badge } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import {globalSearch,getSearchResultPath,type GlobalSearchResponse,type GlobalSearchResult,} from "@/api/globalapi";

// How long to wait after the user stops typing before hitting the API.
const SEARCH_DEBOUNCE_MS = 2000;

// Max hits to preview per group in the dropdown; the rest live on /global-search.
const MAX_PREVIEW = 5;

// Color the small type badge per result kind so they're easy to scan.
const TYPE_BADGE_STYLES: Record<string, string> = {
  content: "bg-blue-50 text-blue-600",
  task: "bg-amber-50 text-amber-600",
  event: "bg-purple-50 text-purple-600",
};


// A single search hit: title on top, type badge + snippet below.
const SuggestionRow = ({
  item,
  onSelect,
}: {
  item: GlobalSearchResult;
  onSelect: (item: GlobalSearchResult) => void;
}) => (
  <button
    type="button"
    onClick={() => onSelect(item)}
    className="flex w-full flex-col items-start gap-1 px-4 py-2.5 text-left transition-colors hover:bg-gray-50"
  >
    <div className="flex w-full items-center gap-2">
      <span className="flex-1 truncate text-sm font-medium text-gray-800">
        {item.title}
      </span>
      <span
        className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
          TYPE_BADGE_STYLES[item.type] ?? "bg-gray-100 text-gray-500"
        }`}
      >
        {item.type}
      </span>
    </div>
    {item.snippet && (
      <span className="line-clamp-1 w-full text-xs text-gray-500">
        {item.snippet.replace(/<[^>]*>/g, "")}
      </span>
    )}
  </button>
);

const HeaderSection = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  const open = Boolean(anchorEl);

  // --- Global search state ---
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GlobalSearchResponse | null>(null);
  const [searching, setSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchBoxRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Debounce the query: only call the API 2s after the user stops typing.
  useEffect(() => {
    const trimmed = query.trim();

    if (!trimmed) {
      setResults(null);
      setSearching(false);
      abortRef.current?.abort();
      return;
    }

    setSearching(true);
    const timer = setTimeout(async () => {
      // Cancel any still-pending request before firing a new one.
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      const data = await globalSearch(trimmed, controller.signal);
      if (!controller.signal.aborted) {
        setResults(data);
        setSearching(false);
      }
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [query]);

  // Close the suggestions box when clicking outside it.
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchBoxRef.current &&
        !searchBoxRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNavigate = () => {
    handleClose();
    navigate("/content-to-approve");
  };

  const hasResults =
    !!results &&
    (results.exact_matches.length > 0 || results.related_content.length > 0);

  // Jump to the full results page, carrying the query in the URL.
  const goToGlobalSearch = () => {
    const trimmed = query.trim();
    if (!trimmed) return;
    setShowSuggestions(false);
    navigate(`/global-search?q=${encodeURIComponent(trimmed)}`);
  };

  // Open the page a search hit points to, based on its type + id.
  const handleSelectResult = (item: GlobalSearchResult) => {
    const path = getSearchResultPath(item);
    if (!path) return;
    setShowSuggestions(false);
    navigate(path);
  };

  return (
    <div className="top-0 left-0 right-0 w-full py-6 border-b border-gray-200 bg-white">
      <div className="flex items-center w-full px-6">

        {/* RIGHT SECTION */}
        <div className="relative flex items-center gap-2 ml-auto">

          {/* SEARCH */}
          <div className="relative" ref={searchBoxRef}>
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              onKeyDown={(e) => {
                if (e.key === "Enter") goToGlobalSearch();
              }}
              placeholder="Search projects, tasks"
              className="w-48 sm:w-64 md:w-80 pl-10 rounded-full border-gray-300 text-sm"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
            {searching && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 animate-spin" />
            )}

            {/* SUGGESTIONS BOX */}
            {showSuggestions && query.trim() && (
              <div className="absolute left-0 right-0 mt-2 z-50 w-80 sm:w-96 max-h-[420px] overflow-y-auto rounded-2xl border border-gray-200 bg-white shadow-xl ring-1 ring-black/5">
                {searching && (
                  <div className="flex items-center gap-2 px-4 py-6 text-sm text-gray-500">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Searching…
                  </div>
                )}

                {!searching && !hasResults && (
                  <div className="px-4 py-6 text-center text-sm text-gray-500">
                    No results found for “{query.trim()}”
                  </div>
                )}

                {!searching && hasResults && (
                  <div className="py-2">
                    {/* EXACT MATCHES */}
                    {results!.exact_matches.length > 0 && (
                      <div>
                        <div className="px-4 pt-2 pb-1 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                          Exact Match
                        </div>
                        {results!.exact_matches
                          .slice(0, MAX_PREVIEW)
                          .map((item) => (
                            <SuggestionRow
                              key={`exact-${item.id}`}
                              item={item}
                              onSelect={handleSelectResult}
                            />
                          ))}
                      </div>
                    )}

                    {/* RELATED CONTENT */}
                    {results!.related_content.length > 0 && (
                      <div className="mt-1">
                        <div className="px-4 pt-2 pb-1 text-[11px] font-semibold uppercase tracking-wide text-gray-400 border-t border-gray-100">
                          Related Content
                        </div>
                        {results!.related_content
                          .slice(0, MAX_PREVIEW)
                          .map((item) => (
                            <SuggestionRow
                              key={`related-${item.id}`}
                              item={item}
                              onSelect={handleSelectResult}
                            />
                          ))}
                      </div>
                    )}

                    {/* SHOW MORE */}
                    <button
                      type="button"
                      onClick={goToGlobalSearch}
                      className="mt-1 w-full border-t border-gray-100 px-4 py-2.5 text-center text-sm font-medium text-blue-600 transition-colors hover:bg-gray-50"
                    >
                      Show more
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* NOTIFICATION */}
          <IconButton >
            <Badge color="error">
              <Bell className="w-5 h-5 sm:w-6 sm:h-6" />
            </Badge>
          </IconButton>
          <IconButton onClick={handleClick}>
            <MenuIcon sx={{ color: "gray" }}/>
          </IconButton>

          {/* DROPDOWN MENU */}
          {/* <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            PaperProps={{
              style: {
                width: 280,
                borderRadius: 10,
              },
            }}
          >
            <MenuItem
              onClick={() => { navigate("/content-brief-list") }}
              sx={{
                justifyContent: "center",
                py: 1.5,
                color: "text.secondary",
              }}
            >
              Content Brief List
            </MenuItem>

            <MenuItem
              onClick={handleNavigate}
              sx={{
                justifyContent: "center",
                py: 1.5,
                color: "text.secondary",
              }}
            >
              Contents to Review
            </MenuItem>

            <MenuItem
              onClick={() => { navigate("/approved-content") }}
              sx={{
                justifyContent: "center",
                py: 1.5,
                color: "text.secondary",
              }}
            >
              Approved Contents
            </MenuItem>

          </Menu> */}
          <Menu
  anchorEl={anchorEl}
  open={open}
  onClose={handleClose}
  PaperProps={{
    style: {
      width: 150,
      borderRadius: 10,
    },
  }}
>
  <MenuItem
    onClick={() => navigate("/content-brief-list")}
    sx={{
      justifyContent: "flex-start",
      alignItems: "center",
      py: 1,
      color: "text.secondary",
      textAlign: "left",
    }}
  >
    Content Brief List
  </MenuItem>

  <MenuItem
    onClick={handleNavigate}
    sx={{
      justifyContent: "flex-start",
      alignItems: "center",
      py: 1,
      color: "text.secondary",
      textAlign: "left",
    }}
  >
    Contents to Review
  </MenuItem>

  <MenuItem
    onClick={() => navigate("/approved-content")}
    sx={{
      justifyContent: "flex-start",
      alignItems: "center",
      py: 1,
      color: "text.secondary",
      textAlign: "left",
    }}
  >
    Approved Contents
  </MenuItem>
</Menu>

        </div>
      </div>
    </div>
  );
};

export default HeaderSection;