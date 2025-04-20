"use server";
import { fetchWithAuth } from "@/lib/api/fetchWithAuth";
import api from "@/lib/api/axiosClient";
import { revalidateTag } from "next/cache";
import { getAllAction  } from "@/lib/actions/getAllAction";
import { deleteOneAction } from "@/lib/actions/deleteOneAction";
import { getOneByKeyAction } from "@/lib/actions/getOneByKeyAction";

const url = `${process.env.NEXT_PUBLIC_APP_API}/brands`;
const tag: string = "brands";

export const getBrands = async () => {
  return getAllAction <Brand>({url, tag})
};

export async function getBrandBySlug(slug: string) {
  return getOneByKeyAction({ url: `${url}/${slug}`, tag})
}

export async function addBrand(data: Partial<Brand>) {
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

export async function editBrand(data: Partial<Brand>) {
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

export async function deleteBrand(data: { id: string }) {
  return deleteOneAction({url, tag, data})
}
