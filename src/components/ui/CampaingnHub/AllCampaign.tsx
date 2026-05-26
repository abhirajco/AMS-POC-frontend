import { useEffect, useState } from "react";
import { useCampaign } from "@/store/useCampaign";
import { Card, CardContent } from "@mui/material";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, MapPin } from "lucide-react";
import EditCampaign from "../EditCampaign";


const AllCampaign = () => {
  const campaigns = useCampaign((s: any) => s.campaigns);
  const fetchCampaigns = useCampaign((s: any) => s.fetchCampaigns);
  const isLoading = useCampaign((s: any) => s.isLoading);
  const error = useCampaign((s: any) => s.error);
  const [isEventDetailOpen, setIsEventDetailOpen] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState("");

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleCampaignClick = (campaignId: string) => {
    setSelectedCampaignId(campaignId);
    setIsEventDetailOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'In Progress':
        return <Badge className="bg-blue-100 text-blue-800 text-xs">In Progress</Badge>;
      case 'Upcoming':
        return <Badge className="bg-green-100 text-green-800 text-xs">Upcoming</Badge>;
      case 'Follow Up':
        return <Badge className="bg-orange-100 text-orange-800 text-xs">Follow Up</Badge>;
      case 'Planning':
        return <Badge className="bg-purple-100 text-purple-800 text-xs">Planning</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'High':
        return <Badge className="bg-red-600 text-white text-xs">High</Badge>;
      case 'Medium':
        return <Badge className="bg-yellow-500 text-white text-xs">Medium</Badge>;
      case 'Low':
        return <Badge className="bg-gray-500 text-white text-xs">Low</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">{priority}</Badge>;
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-4">
      {campaigns.map((campaign: any) => (
        <Card
          key={campaign.campaign_id}
          className="bg-white border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => handleCampaignClick(campaign.campaign_id)}>
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg text-black">{campaign.title}</h3>
                  {getStatusBadge(campaign.status)}
                  {getPriorityBadge(campaign.priority)}
                </div>
                <p className="text-sm text-gray-600 mb-3">{campaign.description}</p>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <CalendarIcon className="w-4 h-4" />
                    {campaign.start_date}
                  </div>
                  {/* <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {event.time}
                          </div> */}

                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {campaign.location}
                  </div>
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
                <Badge variant="outline" className="text-xs">
                  {campaign.campaign_type}
                </Badge>
                {/* <span className="text-xs text-gray-500">
                          {event.assignedTeam.length} team members
                        </span> */}
              </div>
              <span className="text-xs text-gray-500">{campaign.end_date}</span>
            </div>
          </CardContent>
        </Card>
      ))}
      <EditCampaign
        campaignId={selectedCampaignId}
        isEventDetailOpen={isEventDetailOpen}
        setIsEventDetailOpen={setIsEventDetailOpen}
      />
    </div>
  )
};

export default AllCampaign;