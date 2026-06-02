import { createContent, assignSme } from "@/api/ContentHub";

interface CreateContentFlowPayload {
  title: string;
  brief: string;
  content_type: string;
  campaign_id: string;
  event_id?: string;
  tags?: string;
  executive_id?: string;
}

export const createContentFlow = async (payload: CreateContentFlowPayload) => {

  const contentResponse = await createContent(payload);
  const contentId = contentResponse?.content_id;
  const executiveId = contentResponse?.executive_id;

  if (!contentId || !executiveId) {
    throw {
      status: 500,
      message: "Invalid response from server",
    };
  }

  await assignSme(contentId, executiveId);
  return {
    contentId,
    title: payload.title,
    brief: payload.brief,
    contentType: payload.content_type,
  };
};