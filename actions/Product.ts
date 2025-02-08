"use server";
import { fetchWithAuth } from "@/lib/api/fetchWithAuth";
import api from "@/lib/api/axiosClient";
import { revalidateTag } from "next/cache";

const apiURL = `${process.env.NEXT_PUBLIC_APP_API}/products`;
const tag: string = "products";

export const getProducts = async () => {
  try {
    const res = await fetchWithAuth({ url: apiURL, tag });
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
};

export async function getProductBySlug(slug: string) {
  try {
    const res = await fetchWithAuth({ url: `${apiURL}/${slug}/product`, tag });
    

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
  
    const res = await fetchWithAuth({ url: `${apiURL}/${slug}/subproducts`, tag });

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
    .post(apiURL, data)
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
    .put(apiURL, data)
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

export async function deleteProduct(data: { id: string }) {
  return api
    .delete(apiURL, { data })
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
