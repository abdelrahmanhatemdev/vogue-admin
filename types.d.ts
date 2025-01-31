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
  parent: string;
  additional: boolean;
  label: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

interface Brand {
  id: string;
  uuid: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
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
  deletedAt?: string;
}

interface Size {
  id: string;
  uuid: string;
  name: string;
  symbol: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

interface Color {
  id: string;
  uuid: string;
  name: string;
  hex: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

interface Label {
  id: string;
  uuid: string;
  title: string;
  hex: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

interface Product {
  id: string;
  uuid: string;
  name: string;
  slug: string;
  brandId: Brand | string;
  categories: Category[] | string | string[];
  descriptionBrief: string;
  descriptionDetails: string;
  trending: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  subproducts?: Subproduct[] | number | { sku: string; id: string }[];
  reviews?: Review[];
}

interface Subproduct {
  id: string;
  uuid: string;
  productId: string;
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
  deletedAt?: string;
}

interface Paragraph {
  id: string;
  content: string;
}

interface ProductImage {
  id: string;
  uuid: string;
  src: string;
  subproductId: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

interface Tag {
  id: string;
  name: string;
}
interface Review {
  id: string;
}

interface SocialMedia {
  id: string;
  uuid: string;
  platform: string;
  link: string;
  followers: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

interface GlobalNotification {
  id: string;
  uuid: string;
  text: string;
  anchorText: string;
  anchorLink: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

interface Currency {
  id: string;
  uuid: string;
  code: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

interface Setting {
  id: string;
  uuid: string;
  key: string;
  value: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

type Currency = {
  name: string;
  code: string;
};

