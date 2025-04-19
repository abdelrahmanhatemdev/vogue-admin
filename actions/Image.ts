"use server";
import { fetchWithAuth } from "@/lib/api/fetchWithAuth";
import api from "@/lib/api/axiosClient";
import { revalidateTag } from "next/cache";
import { getAll } from "@/lib/actions/getAll";

const url = `${process.env.NEXT_PUBLIC_APP_API}/images`;
const tag = "productImages";
const subproductTag = "subproducts";

export const getProductImages = async () => {
  return getAll<ProductImage>({url, tag})
};

export async function getSubproductImages(id: string) {
  try {
    const res = await fetchWithAuth({
      url: `${url}/productImages/${id}`,
      tag,
    });

    if (res?.ok) {
      const { data } = await res.json();

      if (data) {
        return data.sort((a: ProductImage, b: ProductImage) => {
          if (a.sortOrder === b.sortOrder) {
            return b.updatedAt.localeCompare(a.updatedAt);
          }
          return a.sortOrder - b.sortOrder;
        });
      }
    }

    return [];
  } catch (error) {
    return console.log(error);
  }
}

export async function addProductImage(data: {subproductId: string; urls:string[]}) {
  return api
    .post(url, data)
    .then((res) => {
      if (res?.statusText === "OK" && res?.data?.message) {
        revalidateTag(tag);
        revalidateTag(subproductTag);
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

export async function editProductImage(data: string[]) {
  return api
    .put(url, data)
    .then((res) => {
      
      if (res?.statusText === "OK" && res?.data?.message) {
        revalidateTag(tag);
        revalidateTag(subproductTag);
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

export async function deleteProductImage(data: { id: string }) {
  return api
    .delete(url, { data })
    .then((res) => {
      if (res?.statusText === "OK" && res?.data?.message) {
        revalidateTag(tag);
        revalidateTag(subproductTag);
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
