import { createContext } from "react";

interface ProductContextType {
  categories: { data: Category[]; loading: boolean };
  colors: { data: Color[]; loading: boolean };
  brands: { data: Brand[]; loading: boolean };
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export default ProductContext;
