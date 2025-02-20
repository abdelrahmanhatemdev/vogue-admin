import { getProducts } from "@/actions/Product";
import { create } from "zustand";

interface DataType {
  data: Product[];
  loading: boolean;
  fetchData: () => void;
  setData: (data: Product[]) => void;
  setLoading: (loading: boolean) => void;
}

const useProductStore = create<DataType>((set) => ({
  data: [],
  loading: false,
  fetchData: async () => {
    const data = await getProducts();
    set({ data });
  },
  setData: (data) => set({ data }),
  setLoading: (loading) => set({ loading }),
}));

export default useProductStore;
