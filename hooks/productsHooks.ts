import ProductContext from "@/context/ProductContext";
import { useContext } from "react";

export const useCategories = () => {
  const context = useContext(ProductContext);
  return {
    data: context?.categories.data,
    loading: context?.categories.loading,
  };
};
export const useColors = () => {
  const context = useContext(ProductContext);
  return {
    data: context?.colors.data,
    loading: context?.colors.loading,
  };
};
export const useBrands = () => {
  const context = useContext(ProductContext);
  return {
    data: context?.brands.data,
    loading: context?.brands.loading,
  };
};
