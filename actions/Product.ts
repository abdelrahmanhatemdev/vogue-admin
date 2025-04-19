"use server";
import { fetchWithAuth } from "@/lib/api/fetchWithAuth";
import api from "@/lib/api/axiosClient";
import { revalidateTag } from "next/cache";
import { getAll } from "@/lib/actions/getAll";

const url = `${process.env.NEXT_PUBLIC_APP_API}/products`;
const tag: string = "products";

export const getProducts = async () => {
 return getAll<Product>({url, tag})
};

export async function getProductBySlug(slug: string) {
  try {
    const res = await fetchWithAuth({ url: `${url}/slug/${slug}/product`, tag });
    

    if (res?.ok) {
      const { data } = await res.json();

      if (data) {
        return data
      }
    }
    return [];
  } catch (error) {
    return console.log(error);
  }
}

export async function getProductById(id: string) {
  try {
    const res = await fetchWithAuth({ url: `${url}/id/${id}`, tag });
    

    if (res?.ok) {
      const { data } = await res.json();

      if (data) {
        return data
      }
    }
    return [];
  } catch (error) {
    return console.log(error);
  }
}

export async function getProducSubproducts(slug: string) {
  try {
  
    const res = await fetchWithAuth({ url: `${url}/slug/${slug}/subproducts`, tag });

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
  return api
    .post(url, data)
    .then((res) => {
      if (res?.statusText === "OK" && res?.data?.message) {
        revalidateTag(tag);
        return { status: "success", message: res.data.message };
      }
      if (res?.data?.error) {
        return { status: "error", message: res.data.error };
      }
    })
    .catch((error) => {
      const message = error?.response?.data?.error || "Something Wrong";
      return { status: "error", message };
    });
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
  return api
    .put(url, data)
    .then((res) => {
      if (res?.statusText === "OK" && res?.data?.message) {
        revalidateTag(tag);
        return { status: "success", message: res.data.message };
      }
      if (res?.data?.error) {
        return { status: "error", message: res.data.error };
      }
    })
    .catch((error) => {
      const message = error?.response?.data?.error || "Something Wrong";
      return { status: "error", message };
    });
}

export async function deleteProduct(data: { id: string, uuid: string }) {
  return api
    .delete(url, { data })
    .then((res) => {
      if (res?.statusText === "OK" && res?.data?.message) {
        revalidateTag(tag);
        return { status: "success", message: res.data.message };
      }
      if (res?.data?.error) {
        return { status: "error", message: res.data.error };
      }
    })
    .catch((error) => {
      const message = error?.response?.data?.error || "Something Wrong";
      return { status: "error", message };
    });
}
