import { getBrands } from "@/actions/Brand";
import { create } from "zustand";

interface DataType {
  data: Brand[];
  loading: boolean;
  fetchData: () => void;
  setData: (data: Brand[]) => void;
  setLoading: (loading: boolean) => void;
}

const useBrandStore = create<DataType>((set) => ({
  data: [],
  loading: false,
  fetchData: async () => {
    const data = await getBrands();
    set({ data });
  },
  setData: (data) => set({ data }),
  setLoading: (loading) => set({ loading }),
}));

export default useBrandStore;
