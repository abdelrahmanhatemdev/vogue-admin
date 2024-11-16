import { createContext } from "react";

interface DataContextType {
  categories: { data: Category[]; loading: boolean };
  colors: { data: Color[]; loading: boolean };
  brands: { data: Brand[]; loading: boolean };
}

export type DataContextKeyType = "categories" | "colors" | "brands";

const DataContext = createContext<DataContextType | undefined>(undefined);

export default DataContext;
