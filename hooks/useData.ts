import DataContext, { type DataContextType } from "@/context/DataContext";
import { useContext } from "react";

function useData<T extends keyof DataContextType>(tag: T): DataContextType[T] {
  const context = useContext(DataContext);
  if (context) {
    if (context[`${tag}`]) {
      return {
        data: context[`${tag}`].data,
        loading: context[`${tag}`].loading,
      } as DataContextType[T];
    }
  }
  return {
    data: [],
    loading: true,
  };
}

export default useData;
