"use client";
import { getBrands } from "@/actions/Brand";
import { getCategories } from "@/actions/Category";
import { getColors } from "@/actions/Color";
import DataContext from "@/context/DataContext";
import { ReactNode, useEffect, useState } from "react";

const DataProvider = ({ children }: { children: ReactNode }) => {
  const [categories, setCategories] = useState([]);
  const [colors, setColors] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [colorsLoading, setColorsLoading] = useState(true);
  const [brandsLoading, setbrandsLoading] = useState(true);

  useEffect(() => {
    getCategories().then((res) => {
      setCategories(res);
      setCategoriesLoading(false);
    });
    getColors().then((res) => {
      setColors(res);
      setColorsLoading(false);
    });
    getBrands().then((res) => {
      setBrands(res);
      setbrandsLoading(false);
    });
  }, []);

  return (
    <DataContext.Provider
      value={{
        categories: { data: categories, loading: categoriesLoading },
        brands: { data: brands, loading: brandsLoading },
        colors: { data: colors, loading: colorsLoading },
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
export default DataProvider;
