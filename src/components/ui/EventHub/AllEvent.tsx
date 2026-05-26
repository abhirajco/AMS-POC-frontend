import { useEvent } from "@/store/useEvent";
import { useEffect } from "react";
import { Card, CardContent } from "@mui/material";
import {Calendar as CalendarIcon,} from 'lucide-react';

const AllEvent = () => {
    const { events, fetchEvents } = useEvent();
    
    useEffect(() => {
        fetchEvents();
    }, []);

    useEffect(() => {
      console.log(events);
    }, [events]);

    return (
        
     <div className="space-y-4">
              {events.map(event => (
                <Card
                  key={event.event_id}
                  className="bg-white border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                 // onClick={() => handleEventClick(event.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg text-black">{event.title}</h3>
                          {/* {getStatusBadge(event.status)}
                          {getPriorityBadge(event.priority)} */}
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{event.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <CalendarIcon className="w-4 h-4" />
                            {event.start_date}
                          </div>
                          {/* <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {event.time}
                          </div> */}
                          {/* <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {event.location}
                          </div> */}
                          {/* {(event as any).relatedTaskId !== undefined && (
                            <div className="flex items-center gap-1">
                              <a
                                className="text-blue-600 hover:underline"
                                href={`/planner?task=${(event as any).relatedTaskId}`}
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  const url = `/planner?task=${(event as any).relatedTaskId}`;
                                  (window as any).openTaskFromQuery = (event as any).relatedTaskId;
                                  window.history.pushState(null, '', url);
                                  window.dispatchEvent(new Event('popstate'));
                                }}
                              >
                                Related Task #{(event as any).relatedTaskId}
                              </a>
                            </div>
                          )} */}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {/* <Badge variant="outline" className="text-xs">
                          {event.type}
                        </Badge> */}
                        {/* <span className="text-xs text-gray-500">
                          {event.assignedTeam.length} team members
                        </span> */}
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