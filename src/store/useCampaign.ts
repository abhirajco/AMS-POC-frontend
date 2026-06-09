import { create } from "zustand";
import {
  getAllCampaign,
  getSelectedCampaign,
  filterCampaigns as filterCampaignsApi,
} from "@/api/CampaignHub";

// The list endpoint returns a plain array, but the filter endpoint may wrap the
// campaigns in an object (e.g. { results }, { data }, { campaigns }). Normalize
// both to an array so consumers can always safely .map() over `campaigns`.
const toCampaignArray = (data: any): any[] => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.results)) return data.results;
  if (Array.isArray(data?.campaigns)) return data.campaigns;
  if (Array.isArray(data?.data)) return data.data;
  return [];
};

interface CampaignStore {
  campaigns: any[];
  selectedCampaign: any | null;

  isLoading: boolean;
  isFetchingCampaignDetails: boolean;

  error: any;

  fetchCampaigns: () => Promise<void>;
  filterCampaigns: (params: Record<string, any>) => Promise<void>;

  fetchCampaignById: (campaignId: string) => Promise<void>;
  clearSelectedCampaign: () => void;
}

export const useCampaign = create<CampaignStore>((set) => ({
    campaigns: [],

    selectedCampaign: null,

    isLoading: false,

    isFetchingCampaignDetails: false,

    error: null,

    fetchCampaigns: async () => {
      set({
        isLoading: true,
        error: null,
      });

      try {
        const data = await getAllCampaign();

        set({
          campaigns: toCampaignArray(data),
          isLoading: false,
        });
      } catch (err) {
        set({
          isLoading: false,
          error: err,
        });
      }
    },

    filterCampaigns: async (params: Record<string, any>) => {
      set({
        isLoading: true,
        error: null,
      });

      try {
        const data = await filterCampaignsApi(params);

        set({
          campaigns: toCampaignArray(data),
          isLoading: false,
        });
      } catch (err) {
        set({
          isLoading: false,
          error: err,
        });
      }
    },

    fetchCampaignById: async (campaignId: string) => {
      set({
        isFetchingCampaignDetails: true,
        error: null,
      });

      try {
        const data = await getSelectedCampaign(campaignId);

        set({
          selectedCampaign: data, isFetchingCampaignDetails: false,
        });
      } catch (err) {
        set({
          isFetchingCampaignDetails: false,
          error: err,
        });
      }
    },

    clearSelectedCampaign: () => {
      set({
        selectedCampaign: null,
      });
    },
  })
);

