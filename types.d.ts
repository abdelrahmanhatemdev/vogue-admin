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
  brand: Brand;
  description: Paragraph[]
  categories: Category[];
  subProducts: SupProduct[];
  createdAt: string;
  updatedAt: string;
  isPending?: !isPending;
  reviews?: Review[];
  // tags: Tag[];
}

interface SupProduct {
  sku: string;
  color: Color;
  images: ProductImage[];
  size: Size;
  price: number;
  discount: number;
  qty: number;
  sold: number;
  featured: boolean;
  inStock: boolean;
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
