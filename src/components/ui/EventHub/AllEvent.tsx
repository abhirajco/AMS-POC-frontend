import { useEvent } from "@/store/useEvent";
import { Card, CardContent } from "@mui/material";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, MapPin } from 'lucide-react';
import { getCEStatusBadge, getPriorityBadge, renderHtmlContent } from "@/utils/helpers";

const AllEvent = (
    { events: eventsProp, onEventClick }: {
        events?: any[];
        onEventClick?: (event: any) => void;
    } = {}
) => {
    const eventsRaw = useEvent((s) => s.events);
    const events = eventsProp ?? (Array.isArray(eventsRaw) ? eventsRaw : []);

    return (

     <div className="space-y-4">
              {events.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-8">No events found.</p>
              )}
              {events.map(event => (
                <Card
                  key={event.event_id}
                  className="bg-white border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => onEventClick?.(event)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg text-black">{event.title}</h3>
                          {getCEStatusBadge(event.status)}
                          {getPriorityBadge(event.priority)}
                        </div>
                        <div className="text-sm text-gray-600 mb-3">{renderHtmlContent(event.description)}</div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 flex-wrap">
                          <div className="flex items-center gap-1">
                            <CalendarIcon className="w-4 h-4" />
                            {event.start_date}
                          </div>
                          {event.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {event.location}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {event.event_type && (
                          <Badge variant="outline" className="text-xs capitalize">
                            {event.event_type}
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">{event.end_date}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
    );
};

export default AllEvent;
