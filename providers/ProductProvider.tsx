"use client";
import { getBrands } from "@/actions/Brand";
import { getCategories } from "@/actions/Category";
import { getColors } from "@/actions/Color";
import ProductContext from "@/context/DataContext";
import { ReactNode, useEffect, useState } from "react";

const ProductProvider = ({ children }: { children: ReactNode }) => {
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
    <ProductContext.Provider
      value={{
        categories: { data: categories, loading: categoriesLoading },
        brands: { data: brands, loading: brandsLoading },
        colors: { data: colors, loading: colorsLoading },
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
export default ProductProvider;
