type ActionResponse =
  | {
      status: string;
      message: string;
    }
  | undefined;

interface Category {
  id: string;
  slug: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  isPending?: boolean;
}

interface Brand {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  isPending?: boolean;
}

interface Size {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  isPending?: boolean;
  guide: SizeGuide;
}

interface SizeGuide {
  id: string;
  inches: string;
  cm: string;
}

interface Color {
  id: string;
  name: string;
  hex: string;
  createdAt: string;
  updatedAt: string;
  isPending?: boolean;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  brand: Brand | string;
  categories: Category[] | string[];
  descriptionBrief: string;
  descriptionDetails: string;
  createdAt: string;
  updatedAt: string;
  subproducts?: Subproduct[] | number;
  isPending?: !isPending;
  reviews?: Review[];
  // tags: Tag[];
}

interface Subproduct {
  id: string;
  sku: string;
  colors: Color[] | string[];
  sizes: Size[] | string[];
  price: number;
  discount: number;
  qty: number;
  sold: number;
  featured: boolean;
  inStock: boolean;
  createdAt: string;
  updatedAt: string;
  isPending?: !boolean;
  // images: ProductImage[];
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
