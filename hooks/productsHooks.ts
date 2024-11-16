import ProductContext from "@/context/ProductContext";
import { useContext } from "react";

export const useCategories = () => {
  const context = useContext(ProductContext);
  
  return {
    data: context?.categories ? context.categories.data : [],
    loading: context?.categories ? context.categories.loading : true,
  };
};
export const useColors = () => {
  const context = useContext(ProductContext);
  return {
    data: context?.colors ? context.colors.data : [],
    loading: context?.colors ? context.colors.loading : true,
  };
};
export const useBrands = () => {
  const context = useContext(ProductContext);
  return {
    data: context?.brands ? context.brands.data : [],
    loading: context?.brands ? context.brands.loading: true,
  };
};
