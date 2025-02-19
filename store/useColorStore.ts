import { getColors } from "@/actions/Color";
import { create } from "zustand";

interface DataType {
  data: Color[];
  loading: boolean;
  fetchData: () => void;
  setData: (data: Color[]) => void;
  setLoading: (loading: boolean) => void;
}

const useColorStore = create<DataType>((set) => ({
  data: [],
  loading: false,
  fetchData: async () => {
    const data = await getColors();
    set({ data });
  },
  setData: (data) => set({ data }),
  setLoading: (loading) => set({ loading }),
}));

export default useColorStore;
