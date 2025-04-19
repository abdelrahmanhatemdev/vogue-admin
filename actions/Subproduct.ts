"use server";
import { fetchWithAuth } from "@/lib/api/fetchWithAuth";
import api from "@/lib/api/axiosClient";
import { revalidatePath, revalidateTag } from "next/cache";
import { getAll  } from "@/lib/actions/getAll";

const url = `${process.env.NEXT_PUBLIC_APP_API}/subproducts`;
const tag: string = "subproducts";
const productTag = "products";

export const getSubproducts = async () => {
  return getAll <Subproduct>({url, tag})
};

export async function getSubproductBySku(sku: string) {
  try {
    const res = await fetchWithAuth({ url: `${url}/${sku}`, tag });
    const { data } = await res.json();
    return data;
  } catch (error) {
    return console.log(error);
  }
}

export async function addSubproduct(data: Partial<Subproduct>) {
  return api
    .post(url, data)
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
    .put(url, data)
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
    .delete(url, { data })
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
