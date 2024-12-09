"use client";
import { getBrands } from "@/actions/Brand";
import { getCategories } from "@/actions/Category";
import { getColors } from "@/actions/Color";
import { getSizes } from "@/actions/Size";
import DataContext from "@/context/DataContext";
import { memo, ReactNode, useEffect, useState } from "react";

const DataProvider = ({ children }: { children: ReactNode }) => {
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [colors, setColors] = useState([]);
  const [colorsLoading, setColorsLoading] = useState(true);
  const [brands, setBrands] = useState([]);
  const [brandsLoading, setbrandsLoading] = useState(true);
  const [sizes, setSizes] = useState([]);
  const [sizesLoading, setSizesLoading] = useState(true);

  const fetchData = async () => {
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
    getSizes().then((res) => {
      setSizes(res);
      setSizesLoading(false);
    });
  };

  const refresh = async () => {
    await fetchData()
  }

  useEffect(() => {
    fetchData()
  }, []);

  return (
    <DataContext.Provider
      value={{
        categories: { data: categories, loading: categoriesLoading },
        brands: { data: brands, loading: brandsLoading },
        colors: { data: colors, loading: colorsLoading },
        sizes: { data: sizes, loading: sizesLoading },
        refresh 
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
export default DataProvider;
