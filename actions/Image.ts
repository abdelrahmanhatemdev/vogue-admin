"use server";
import api from "@/lib/axiosClient";
import { revalidateTag } from "next/cache";

const apiURL = `${process.env.NEXT_PUBLIC_APP_API}/images`;
const tag: string = "productImages";

export const getProductImages = async () => {
  try {
    const res = await fetch(apiURL, {
      next: { tags: [tag] },
      cache: "force-cache",
    });

    if (res?.ok) {
      const { data } = await res.json();

      if (data) {
        return data.sort((a: ProductImage, b: ProductImage) =>
          b.updatedAt.localeCompare(a.updatedAt)
        );
      }
    }
    return [];
  } catch (error) {
    return console.log(error);
  }
};

export async function getSubproductImages(id: string) {
  try {
    const res = await fetch(`${apiURL}/productImages/${id}`, {
      next: { tags: [tag] },
      cache: "force-cache",
    });

    if (res?.ok) {
      const { data } = await res.json();

      if (data) {
        return data.sort(
          (a: ProductImage, b: ProductImage) => {
            if (a.sortOrder === b.sortOrder ) {
              return b.updatedAt.localeCompare(a.updatedAt)
            }
            return a.sortOrder - b.sortOrder;
          }
        );
      }
    }

    return [];
  } catch (error) {
    return console.log(error);
  }
}

export async function addProductImage(data: FormData) {
  return fetch(apiURL, {
    method: "POST",
    body: data,
  })
    .then((res) => res.json())
    .then((res) => {
      if (res?.data?.message) {
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

export async function editProductImage(data: string[]) {
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

export async function deleteProductImage(data: { id: string; url: string }) {
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
