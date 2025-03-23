"use server";
import { fetchWithAuth } from "@/lib/api/fetchData";
import api from "@/lib/api/axiosClient";
import { revalidatePath, revalidateTag } from "next/cache";

const apiURL = `${process.env.NEXT_PUBLIC_APP_API}/subproducts`;
const tag: string = "subproducts";
const productTag = "products";

export const getSubproducts = async () => {
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

export async function getSubproductBySku(sku: string) {
  try {
    const res = await fetchWithAuth({ url: `${apiURL}/${sku}`, tag });

    
    const { data } = await res.json();
    console.log("data", data);
    return data;
  } catch (error) {
    return console.log(error);
  }
}

export async function addSubproduct(data: Partial<Subproduct>) {
  return api
    .post(apiURL, data)
    .then((res) => {
      if (res?.statusText === "OK" && res?.data?.message) {
        revalidateTag(tag);
        revalidateTag(productTag);
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

export async function editSubproduct(
  data: Partial<
    Subproduct & {
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
        const {productId} = data
        revalidateTag(tag);
        revalidateTag(productTag);
        revalidatePath('/products');
        revalidatePath(`/products/${productId}`);
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

export async function deleteSubproduct(data: { id: string }) {
  return api
    .delete(apiURL, { data })
    .then((res) => {
      if (res?.statusText === "OK" && res?.data?.message) {
        revalidateTag(tag);
        revalidateTag(`${productTag}`);
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
