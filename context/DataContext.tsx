"use client"
import { createContext } from "react";

export interface DataContextType {
  categories: { data: Category[]; loading: boolean };
  colors: { data: Color[]; loading: boolean };
  brands: { data: Brand[]; loading: boolean };
  sizes: { data: Size[]; loading: boolean };
  refresh : () => void
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export default DataContext;
