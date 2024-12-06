type ActionResponse =
  | {
      status: string;
      message: string;
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
  isPending?: boolean;
}

interface Brand {
  id: string;
  uuid: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  delatedAt?: string;
  isPending?: boolean;
}

interface Admin {
  id: string;
  uuid: string;
  name: string;
  email: string;
  password: string;
  provider: string;
  createdAt: string;
  updatedAt: string;
  provider_id?: string;
  delatedAt?: string;
  isPending?: boolean;
}

interface Size {
  id: string;
  uuid: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  delatedAt?: string;
  isPending?: boolean;
}

interface Color {
  id: string;
  uuid: string;
  name: string;
  hex: string;
  createdAt: string;
  updatedAt: string;
  delatedAt?: string;
  isPending?: boolean;
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
  subproducts?: Subproduct[] | number | {sku:string; id: string;}[];
  isPending?: !isPending;
  reviews?: Review[];
  // tags: Tag[];
}

interface Subproduct {
  id: string;
  uuid: string;
  sku: string;
  colors: Color[] | string[];
  sizes: Size[] | string[];
  price: number;
  currency: string;
  discount: number;
  qty: number;
  sold: number;
  featured: boolean;
  inStock: boolean;
  createdAt: string;
  updatedAt: string;
  delatedAt?: string;
  isPending?: !boolean;
  images?: ProductImage[];
}

interface Paragraph {
  id: string;
  content: string;
}

interface ProductImage {
  id: string;
  src: string;
  alt: string;
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