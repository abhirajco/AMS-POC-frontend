import { create } from "zustand";
import { getAllContents, getContentById } from "@/api/ContentHub";


interface ContentFilters {
    search?: string;
    status?: string;
    content_type?: string;
    author_id?: string;
    campaign_id?: string;
    month?: number;
    quarter?: number;
    year?: number;
}


interface ContentStore {

    contents: any[];

    selectedContent: any | null;

    isLoading: boolean;

    isFetchingContentDetails: boolean;

    error: unknown;

    fetchContents: (filters?: ContentFilters) => Promise<void>;

    fetchContentById: (contentId: string) => Promise<void>;

    clearSelectedContent: () => void;
}


export const useContentStore = create<ContentStore>((set) => ({
    contents: [],

    selectedContent: null,

    isLoading: false,

    isFetchingContentDetails: false,

    error: null,

    fetchContents: async (filters) => {
        set({
            isLoading: true,
            error: null,
        });

        try {
            const data = await getAllContents(filters);

            set({
                contents: data.items,
                isLoading: false,
            });
        } catch (err) {
            set({
                isLoading: false,
                error: err,
            });
        }
    },

    fetchContentById: async (contentId: string) => {
        set({
            isFetchingContentDetails: true,
            error: null,
        });

        try {
            const data = await getContentById(contentId);

            set({
                selectedContent: data,
                isFetchingContentDetails: false,
            });
        } catch (err) {
            set({
                selectedContent: null,
                isFetchingContentDetails: false,
                error: err,
            });
        }
    },

    clearSelectedContent: () => {
        set({
            selectedContent: null,
        });
    },
}));