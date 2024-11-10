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
  // categories: Category[];
  // description: Paragraph[]
  // brand: Brand;
  // subProducts: SupProduct[];
  // reviews: Review[];
  // featured: boolean;
  // inStock: boolean;
  // tags: Tag[];
  createdAt: string;
  updatedAt: string;
  isPending: !isPending;
}

interface Paragraph {
  id: string;
  content: string;
}

interface SupProduct {
  sku: string;
  images: ProductImage[];
  sizes: Size;
  colors: Color;
  price: number;
  discount: number;
  qty: number;
  sold: number;
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
