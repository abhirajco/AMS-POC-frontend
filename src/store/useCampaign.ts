import { create } from "zustand";
import { getAllCampaign, getSelectedCampaign,  updateCampaign, deleteCampaign, createCampaign,getCampaignHistoryById  } from "@/api/CampaignHub";

interface CampaignStore {
  campaigns: any[];
  selectedCampaign: any | null;

  isLoading: boolean;
  isFetchingCampaignDetails: boolean;
  isFetchingHistory:boolean;

  history:any[];

  error: any;

  fetchCampaigns: () => Promise<void>;
fetchHistoryById: (
  campaignId: string
) => Promise<void>;


  fetchCampaignById: (campaignId: string) => Promise<void>;
  clearSelectedCampaign: () => void;

  updateCampaignById: (
  campaignId: string,
  updatedData: any,
  ) => Promise<void>;

    deleteCampaignById: (campaignId: string) => Promise<void>;

      createCampaignById: (campaignData: any) => Promise<void>;
}

export const useCampaign = create<CampaignStore>((set) => ({
    campaigns: [],
    history: [],
    selectedCampaign: null,

    isLoading: false,

    isFetchingCampaignDetails: false,
    
      isFetchingHistory: false,

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
    updateCampaignById: async (
  campaignId,
  updatedData
) => {
  try {
    const updatedCampaign =
      await updateCampaign(
        campaignId,
        updatedData
      );

    set((state) => ({
      campaigns: state.campaigns.map(
        (campaign) =>
          campaign.campaign_id === campaignId
            ? {
                ...campaign,
                ...updatedCampaign,
              }
            : campaign
      ),

      selectedCampaign:
        state.selectedCampaign?.campaign_id ===
        campaignId
          ? {
              ...state.selectedCampaign,
              ...updatedCampaign,
            }
          : state.selectedCampaign,
    }));
  } catch (err) {
    set({ error: err });
    throw err;
  }
    },
    deleteCampaignById: async (campaignId: string) => {
  try {
    await deleteCampaign(campaignId);
    set((state) => ({
      campaigns: state.campaigns.filter(
        (c) => c.campaign_id !== campaignId
      ),
    }));
  } catch (err) {
       set({ error: err });
    throw err;
  }
    },     
    createCampaignById: async (campaignData: any) => {
  try {
    await createCampaign(campaignData);
  } catch (err) {
       set({ error: err });
    throw err;
  }
    },
    fetchHistoryById: async (campaignId: string) => {
      set({
        isFetchingHistory: true,
        error: null,
      })

      try {
        const data = await getCampaignHistoryById(
          campaignId
        );

        set({
          history: data,
          isFetchingHistory: false,
        });
      } catch (err) {
        set({
          isFetchingHistory: false,
          error: err,
        });
      }
    },
  }),  


);

