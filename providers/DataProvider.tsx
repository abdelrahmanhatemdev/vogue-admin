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
  // const setCategories = useCategoryStore((state) => state.setData);
  // const setCategoriesLoading = useCategoryStore((state) => state.setLoading);

  // const setColors = useColorStore((state) => state.setData);
  // const setColorsLoading = useColorStore((state) => state.setLoading);

  // const setBrands = useBrandStore((state) => state.setData);
  // const setBrandsLoading = useBrandStore((state) => state.setLoading);

  // const setSizes = useSizeStore((state) => state.setData);
  // const setSizesLoading = useSizeStore((state) => state.setLoading);

  // const setLabels = useLabelStore((state) => state.setData);
  // const setLabelsLoading = useLabelStore((state) => state.setLoading);

  // const fetchData = async () => {
  //   try {
  //     setCategoriesLoading(true);
  //     setColorsLoading(true);
  //     setBrandsLoading(true);
  //     setSizesLoading(true);
  //     setLabelsLoading(true);
  
  //     const [categories, colors, brands, sizes, labels] = await Promise.all([
  //       getCategories(),
  //       getColors(),
  //       getBrands(),
  //       getSizes(),
  //       getLabels(),
  //     ]);
  
  //     setCategories(categories);
  //     setColors(colors);
  //     setBrands(brands);
  //     setSizes(sizes);
  //     setLabels(labels);
  
  //     setCategoriesLoading(false);
  //     setColorsLoading(false);
  //     setBrandsLoading(false);
  //     setSizesLoading(false);
  //     setLabelsLoading(false);
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };
  

  // useEffect(() => {
  //   fetchData();
  // }, []);

  return <>{children}</>;
};

export default DataProvider;
