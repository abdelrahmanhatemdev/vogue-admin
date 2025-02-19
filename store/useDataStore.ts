// store/useDataStore.ts
import { create } from "zustand";

type DataState = {
  categories: Category[];
  colors: Color[];
  brands: Brand[];
  sizes: Size[];
  labels: Label[];
  categoriesLoading: boolean;
  colorsLoading: boolean;
  brandsLoading: boolean;
  sizesLoading: boolean;
  labelsLoading: boolean;
  setCategories: (categories: Category[]) => void;
  setColors: (colors: Color[]) => void;
  setBrands: (brands: Brand[]) => void;
  setSizes: (sizes: Size[]) => void;
  setLabels: (labels: Label[]) => void;
  setLoadingState: (key: string, state: boolean) => void;
};

export const useDataStore = create<DataState>((set) => ({
  categories: [],
  colors: [],
  brands: [],
  sizes: [],
  labels: [],
  categoriesLoading: true,
  colorsLoading: true,
  brandsLoading: true,
  sizesLoading: true,
  labelsLoading: true,
  setCategories: (categories) => set({ categories }),
  setColors: (colors) => set({ colors }),
  setBrands: (brands) => set({ brands }),
  setSizes: (sizes) => set({ sizes }),
  setLabels: (labels) => set({ labels }),
  setLoadingState: (key, state) => set({ [`${key}Loading`]: state }),
}));
