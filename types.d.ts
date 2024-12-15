type ActionResponse =
  | {
      status?: string | number;
      message?: string;
      error?: string | null;
    }
  | undefined;

interface Category {
  id: string;
  uuid: string;
  slug: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  delatedAt?: string;
}

interface Brand {
  id: string;
  uuid: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  delatedAt?: string;
}

interface Admin {
  id: string;
  uuid: string;
  name: string;
  email: string;
  password?: string;
  provider: string;
  createdAt: string;
  updatedAt: string;
  provider_id?: string;
  delatedAt?: string;
}

interface Size {
  id: string;
  uuid: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  delatedAt?: string;
}

interface Color {
  id: string;
  uuid: string;
  name: string;
  hex: string;
  createdAt: string;
  updatedAt: string;
  delatedAt?: string;
}

interface Product {
  id: string;
  uuid: string;
  name: string;
  slug: string;
  brand_id: Brand | string;
  categories: Category[] | string | string[];
  descriptionBrief: string;
  descriptionDetails: string;
  createdAt: string;
  updatedAt: string;
  delatedAt?: string;
  subproducts?: Subproduct[] | number | { sku: string; id: string }[];
  reviews?: Review[];
}

interface Subproduct {
  id: string;
  uuid: string;
  product_id: string;
  sku: string;
  currency: string;
  price: number;
  discount: number;
  qty: number;
  sold: number;
  featured: boolean;
  inStock: boolean;
  colors: Color[] | string[] | string;
  sizes: Size[] | string[] | string;
  images?: ProductImage[] | string[] | string;
  createdAt: string;
  updatedAt: string;
  delatedAt?: string;
}

interface Paragraph {
  id: string;
  content: string;
}

interface ProductImage {
  id: string;
  uuid: string;
  src: string;
  alt: string;
  order: number;
  createdAt?: string;
  updatedAt?: string;
  delatedAt?: string;
}

interface Tag {
  id: string;
  name: string;
}
interface Review {
  id: string;
}

type Currency = {
  name: string;
  code: string;
};
