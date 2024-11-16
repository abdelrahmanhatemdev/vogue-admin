import DataContext, { type DataContextKeyType } from "@/context/DataContext";
import { useContext } from "react";

export const useData = (tag: DataContextKeyType) => {
  const context = useContext(DataContext);
  if (context) {
    if (context[`${tag}`]) {
      return {
        data: context[`${tag}`].data,
        loading: context[`${tag}`].loading,
      };
    }
  }
  return {
    data: [],
    loading: true,
  };
};
