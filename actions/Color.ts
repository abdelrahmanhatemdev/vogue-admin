"use server";
import { fetchWithAuth } from "@/lib/api/fetchWithAuth";
import api from "@/lib/api/axiosClient";
import { revalidateTag } from "next/cache";
import { getAllAction  } from "@/lib/actions/getAllAction";
import { deleteOneAction } from "@/lib/actions/deleteOneAction";

const url = `${process.env.NEXT_PUBLIC_APP_API}/colors`;
const tag: string = "colors";

export const getColors = async () => {
  return getAllAction <Color>({url, tag})
};

export async function addColor(data: Partial<Color>) {
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

export async function editColor(data: Partial<Color>) {
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

export async function deleteColor(data: { id: string }) {
  return deleteOneAction({url, tag, data})
}
