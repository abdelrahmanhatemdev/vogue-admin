import { getCategories } from "@/actions/Category";
import { create } from "zustand";

interface DataType {
  data: Category[];
  loading: boolean;
  fetchData: () => void;
  setData: (data: Category[]) => void;
  setLoading: (loading: boolean) => void;
}

const useCategoryStore = create<DataType>((set) => ({
  data: [],
  loading: false,
  fetchData: async () => {
    const data = await getCategories();
    set({ data });
  },
  setData: (data) => set({ data }),
  setLoading: (loading) => set({ loading }),
}));

export default useCategoryStore;
