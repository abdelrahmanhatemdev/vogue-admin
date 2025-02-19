"use client";
import { useEffect } from "react";
import { getCategories } from "@/actions/Category";
import { getColors } from "@/actions/Color";
import { getBrands } from "@/actions/Brand";
import { getSizes } from "@/actions/Size";
import { getLabels } from "@/actions/Label";
import { useDataStore } from "@/store/useDataStore";
import useCategoryStore from "@/store/useCategoryStore";

const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const setCategories = useCategoryStore((state) => state.setData);
  const setCategoriesLoading  = useCategoryStore(state => state.setLoading)
  const setColors = useDataStore((state) => state.setColors);
  const setBrands = useDataStore((state) => state.setBrands);
  const setSizes = useDataStore((state) => state.setSizes);
  const setLabels = useDataStore((state) => state.setLabels);
  const setLoadingState = useDataStore((state) => state.setLoadingState);

  const fetchData = async () => {
    try {
      setCategoriesLoading(true);
      const categories = await getCategories();
      setCategories(categories);
      setCategoriesLoading(false);

      setLoadingState("colors", true);
      const colors = await getColors();
      setColors(colors);
      setLoadingState("colors", false);

      setLoadingState("brands", true);
      const brands = await getBrands();
      setBrands(brands);
      setLoadingState("brands", false);

      setLoadingState("sizes", true);
      const sizes = await getSizes();
      setSizes(sizes);
      setLoadingState("sizes", false);

      setLoadingState("labels", true);
      const labels = await getLabels();
      setLabels(labels);
      setLoadingState("labels", false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return <>{children}</>;
};

export default DataProvider;
