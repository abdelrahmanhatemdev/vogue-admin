type ActionResponse = {
  status: string;
  message: string;
} | undefined

interface Category {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  isPending?: boolean
}

interface Brand {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  isPending?: boolean
}

interface Size {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  isPending?: boolean
}

interface Color {
  id: string;
  name: string;
  hex: string;
  createdAt: string;
  updatedAt: string;
  isPending?: boolean
}
