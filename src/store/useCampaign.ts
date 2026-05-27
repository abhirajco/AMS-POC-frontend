import { create } from "zustand";
import { getAllCampaign, getSelectedCampaign } from "@/api/CampaignHub";

interface CampaignStore {
  campaigns: any[];
  selectedCampaign: any | null;

  isLoading: boolean;
  isFetchingCampaignDetails: boolean;

  error: any;

  fetchCampaigns: () => Promise<void>;

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
          campaigns: data,
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

