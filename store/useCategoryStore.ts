import { getCategories } from "@/actions/Category";
import { create } from "zustand";

interface CategoryStore {
  data: Category[];
  loading: boolean;
  nextCursor: string | null;
  cursors: (string | null)[];
  pageIndex: number;
  pageSize: number;
  limit: number;
  total: number;
  fetchData: (override?: {
    pageIndex?: number;
    pageSize?: number;
  }) => Promise<void>;
  setData: (data: Category[]) => void;
  setLoading: (loading: boolean) => void;
  setPageIndex: (index: number) => void;
  setPageSize: (size: number) => void;
}

const useCategoryStore = create<CategoryStore>((set, get) => ({
  data: [],
  loading: false,
  nextCursor: null,
  cursors: [],
  pageIndex: 0,
  pageSize: 10,
  limit: 10,
  total: 0,

  fetchData: async (override = {}) => {
    const state = get();
    const pageIndex = override.pageIndex ?? state.pageIndex;
    const pageSize = override.pageSize ?? state.pageSize;
    const cursors = state.cursors;

    const cursor =
      pageIndex === 0
        ? undefined
        : (cursors[pageIndex - 1] as string | undefined);

    set({ loading: true });

    try {
      const res = await getCategories({ limit: pageSize, cursor });

      const newCursors = [...cursors];
      if (res?.nextCursor) {
        newCursors[pageIndex] = res.nextCursor;
      }

      set({
        data: res?.data || [],
        total: res?.total || 0,
        nextCursor: res?.nextCursor || null,
        cursors: newCursors,
        pageIndex,
        pageSize,
      });
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      set({ loading: false });
    }
  },

  setData: (data) => set({ data }),
  setLoading: (loading) => set({ loading }),

  setPageIndex: (index) => {
    const { fetchData, pageSize } = get();
    set({ pageIndex: index });
    fetchData({ pageIndex: index, pageSize });
  },

  setPageSize: (size) => {
    const { fetchData, pageIndex } = get();
    set({ pageSize: size, pageIndex: 0 });
    fetchData({ pageIndex: 0, pageSize: size });
  },
}));

export default useCategoryStore;
