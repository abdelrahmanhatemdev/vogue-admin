"use server";
import { fetchWithAuth } from "@/lib/api/fetchWithAuth";
import { getAllAction } from "@/lib/actions/getAllAction";
import { deleteOneAction } from "@/lib/actions/deleteOneAction";
import { getOneByKeyAction } from "@/lib/actions/getOneByKeyAction";
import { addOneAction } from "@/lib/actions/addOneAction";
import { EditOneAction } from "@/lib/actions/EditOneAction";

const url = `${process.env.NEXT_PUBLIC_APP_API}/products`;
const tag: string = "products";

export const getProducts = async () => {
  return getAllAction<Product>({ url, tag });
};

export async function getProductBySlug(slug: string) {
  return getOneByKeyAction<Product>({
    url: `${url}/slug/${slug}/product`,
    tag,
  });
}

export async function getProductById(id: string) {
  return getOneByKeyAction<Product>({ url: `${url}/id/${id}`, tag });
}

export async function getProducSubproducts(slug: string) {
  try {
    const res = await fetchWithAuth({
      url: `${url}/slug/${slug}/subproducts`,
      tag,
    });

    if (res?.ok) {
      const { data } = await res.json();

      if (data) {
        return data.sort((a: Product, b: Product) =>
          b.updatedAt.localeCompare(a.updatedAt)
        );
      }
    }
    return [];
  } catch (error) {
    return console.log(error);
  }
}

export async function addProduct(data: Partial<Product>) {
  return addOneAction<Product>({ url, tag, data });
}

export async function editProduct(
  data: Partial<
    Product & {
      uuid: string;
      property: string;
      value: string | boolean | number | string[];
    }
  >
) {
  return EditOneAction<
    Product & {
      uuid: string;
      property: string;
      value: string | boolean | number | string[];
    }
  >({ url, tag, data });
}

export async function deleteProduct(data: { id: string; uuid: string }) {
  return deleteOneAction({ url, tag, data });
}
