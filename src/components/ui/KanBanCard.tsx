import { CardContent, Card } from "./card";
import { Calendar, Users, MapPin } from "lucide-react";
import { getPriorityBadge, renderHtmlContent } from "@/utils/helpers";


export interface KanBanCardProps {
  title: string;
  description?: string;
  /** Optional priority — renders a colored badge (campaigns / tasks). */
  priority?: string;
  /** Small grey chip, e.g. campaign_type, marketing_type, or "Event". */
  category?: string;
  /** Tags to show as outlined chips (first 3, then a "+N" overflow chip). */
  tags?: string[];
  /** Start of the date range (campaigns / events). */
  startDate?: string | null;
  /** End of the date range (campaigns / events). */
  endDate?: string | null;
  /** Single due date (tasks). */
  dueDate?: string | null;
  launchDate?: string | null;
  /** Optional location (campaigns). */
  location?: string;
  /** Person to show in the avatar row, e.g. assigned_to_name / created_by_name. */
  assignee?: string;
  /** Optional count shown in the footer, e.g. task_count. */
  taskCount?: number;
  onClick?: () => void;
}

const getInitials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

/** "May 23" style range; collapses to a single date when start === end. */
const formatRange = (start?: string | null, end?: string | null) => {
  if (start && end) return start === end ? start : `${start} → ${end}`;
  return start || end || "";
};

const KanBanCard = ({
  title,
  description,
  priority,
  category,
  tags,
  startDate,
  endDate,
  dueDate,
  launchDate,
  location,
  assignee,
  taskCount,
  onClick,
}: KanBanCardProps) => {
  const dateRange = formatRange(startDate, endDate);

  return (
    <Card
      onClick={onClick}
      className="bg-white border border-gray-300 p-3 sm:p-4 hover:shadow-md transition-shadow cursor-pointer"
    >
      <CardContent className="p-0">
        <div className="space-y-2 sm:space-y-3">
          {(priority || category) && (
            <div className="flex flex-wrap items-center gap-2">
              {priority && getPriorityBadge(priority)}
              {category && (
                <div className="bg-gray-100 text-black text-xs px-2 py-1 rounded capitalize">
                  {category}
                </div>
              )}
            </div>
          )}

          <h5 className="font-medium text-[13px] sm:text-[14px] text-black line-clamp-2">
            {title}
          </h5>

          {description && (
            <div className="text-[11px] sm:text-[12px] text-gray-600 line-clamp-2">
              {renderHtmlContent(description)}
            </div>
          )}

          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-1 sm:gap-1.5">
              {tags.slice(0, 3).map((tag, tagIndex) => (
                <div
                  key={tagIndex}
                  className="border border-gray-400 text-[10px] sm:text-xs px-2 py-1 rounded"
                >
                  {tag}
                </div>
              ))}
              {tags.length > 3 && (
                <div className="border border-gray-400 text-[10px] sm:text-xs px-2 py-1 rounded text-gray-500">
                  +{tags.length - 3}
                </div>
              )}
            </div>
          )}

          <div className="flex flex-col gap-1">
            {dateRange && (
              <div className="flex items-center gap-1 text-gray-600 text-[11px] sm:text-[12px]">
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>{dateRange}</span>
              </div>
            )}
            {dueDate && (
              <div className="flex items-center gap-1 text-gray-600 text-[11px] sm:text-[12px]">
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className={new Date(dueDate) < new Date() ? "text-red-600" : ""}>
                  Due: {dueDate}
                </span>
              </div>
            )}
            {launchDate && (
              <div className="flex items-center gap-1 text-gray-600 text-[11px] sm:text-[12px]">
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="font-medium">Launch: {launchDate}</span>
              </div>
            )}
            {location && (
              <div className="flex items-center gap-1 text-gray-600 text-[11px] sm:text-[12px]">
                <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>{location}</span>
              </div>
            )}
          </div>

          {assignee && (
            <div className="flex items-center gap-1 text-gray-600 text-[11px] sm:text-[12px]">
              <div className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center text-[8px] font-semibold">
                {getInitials(assignee)}
              </div>
              <span className="font-medium">{assignee}</span>
            </div>
          )}

          {typeof taskCount === "number" && (
            <div className="flex items-center gap-1 text-gray-600 text-[11px] sm:text-[12px]">
              <Users className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>{taskCount} tasks</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default KanBanCard;
