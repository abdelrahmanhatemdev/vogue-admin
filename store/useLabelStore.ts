import { getLabels } from "@/actions/Label";
import { create } from "zustand";

interface DataType {
  data: Label[];
  loading: boolean;
  fetchData: () => void;
  setData: (data: Label[]) => void;
  setLoading: (loading: boolean) => void;
}

const useLabelStore = create<DataType>((set) => ({
  data: [],
  loading: false,
  fetchData: async () => {
    const data = await getLabels();
    set({ data });
  },
  setData: (data) => set({ data }),
  setLoading: (loading) => set({ loading }),
}));

export default useLabelStore;
