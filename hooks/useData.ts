import DataContext, { type DataContextType } from "@/context/DataContext";
import { useContext } from "react";

function useData<T extends keyof Omit<DataContextType, "refresh">>(
  tag: T
): DataContextType[T] {
  const context = useContext(DataContext);

  if (!context) {
    throw new Error("useData must be used within a DataContext.Provider");
  }

  if (!(tag in context)) {
    throw new Error(`Invalid key "${tag}" provided to useData.`);
  }

  return context[tag];
}

export function useRefresh() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataContext.Provider");
  }

  return context["refresh"];
}

export default useData;
