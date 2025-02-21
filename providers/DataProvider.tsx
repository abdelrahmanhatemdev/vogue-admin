"use client";
import { useEffect } from "react";
import { getCategories } from "@/actions/Category";
import { getColors } from "@/actions/Color";
import { getBrands } from "@/actions/Brand";
import { getSizes } from "@/actions/Size";
import { getLabels } from "@/actions/Label";
import useCategoryStore from "@/store/useCategoryStore";
import useColorStore from "@/store/useColorStore";
import useBrandStore from "@/store/useBrandStore";
import useSizeStore from "@/store/useSizeStore";
import useLabelStore from "@/store/useLabelStore";

const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const setCategories = useCategoryStore((state) => state.setData);
  const setCategoriesLoading = useCategoryStore((state) => state.setLoading);

  const setColors = useColorStore((state) => state.setData);
  const setColorsLoading = useColorStore((state) => state.setLoading);

  const setBrands = useBrandStore((state) => state.setData);
  const setBrandsLoading = useBrandStore((state) => state.setLoading);

  const setSizes = useSizeStore((state) => state.setData);
  const setSizesLoading = useSizeStore((state) => state.setLoading);

  const setLabels = useLabelStore((state) => state.setData);
  const setLabelsLoading = useLabelStore((state) => state.setLoading);

  const fetchData = async () => {
    try {
      setCategoriesLoading(true);
      const categories = await getCategories();
      setCategories(categories);
      setCategoriesLoading(false);

      setColorsLoading(true);
      const colors = await getColors();
      setColors(colors);
      setColorsLoading(false);

      setBrandsLoading(true);
      const brands = await getBrands();
      setBrands(brands);
      setBrandsLoading(false);

      setSizesLoading(true);
      const sizes = await getSizes();
      setSizes(sizes);
      setSizesLoading(false);

      setLabelsLoading(true);
      const labels = await getLabels();
      setLabels(labels);
      setLabelsLoading(false);
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
