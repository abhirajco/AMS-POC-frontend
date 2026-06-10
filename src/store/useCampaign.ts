import { create } from "zustand";
import { getAllCampaign, getSelectedCampaign,  updateCampaign, deleteCampaign, createCampaign,getCampaignHistoryById ,getTeamMembers, filterCampaigns as filterCampaignsApi  } from "@/api/CampaignHub";

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

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  initials: string;
}



interface CampaignStore {
    teamMembers: TeamMember[];
   fetchTeamMembers: (
  query: string
) => Promise<void>;

  campaigns: any[];
  selectedCampaign: any | null;

  isLoading: boolean;
  isFetchingCampaignDetails: boolean;
  isFetchingHistory:boolean;

  history:any[];

  error: any;

  fetchCampaigns: () => Promise<void>;
  filterCampaigns: (params: Record<string, any>) => Promise<void>;
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
  teamMembers: [],
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
    fetchTeamMembers: async (
  query: string
) => {
  try {
    const data =
      await getTeamMembers(query);

    set({
      teamMembers: data,
    });
  } catch (err) {
    set({ error: err });
  }
},
  }),  


);

