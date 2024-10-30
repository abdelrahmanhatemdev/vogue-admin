type ActionResponse = {
  status: string;
  message: string;
} | undefined

interface Category {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}
