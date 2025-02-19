import { getSizes } from "@/actions/Size";
import { create } from "zustand";

interface DataType {
  data: Size[];
  loading: boolean;
  fetchData: () => void;
  setData: (data: Size[]) => void;
  setLoading: (loading: boolean) => void;
}

const useSizeStore = create<DataType>((set) => ({
  data: [],
  loading: false,
  fetchData: async () => {
    const data = await getSizes();
    set({ data });
  },
  setData: (data) => set({ data }),
  setLoading: (loading) => set({ loading }),
}));

export default useSizeStore;
