"use server";
import { fetchWithAuth } from "@/lib/api/fetchWithAuth";
import api from "@/lib/api/axiosClient";
import { revalidateTag } from "next/cache";

const apiURL = `${process.env.NEXT_PUBLIC_APP_API}/labels`;
const tag: string = "labels";

export const getLabels = async () => {
  try {
    const res = await fetchWithAuth({ url: apiURL, tag });
    if (res?.ok) {
      const { data } = await res.json();

      if (data) {

        return data.sort((a: Label, b: Label) =>
          b.updatedAt.localeCompare(a.updatedAt)
        );
      }
    }
    return [];
  } catch (error) {
    return console.log(error);
  }
};

export async function getLabelById(id: string) {
  try {
    const res = await fetchWithAuth({ url: `${apiURL}/${id}`, tag });
    
    const { data } = await res.json();
    return data;
  } catch (error) {
    return console.log(error);
  }
}

export async function addLabel(data: Partial<Label>) {
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

export async function editLabel(data: Partial<Label>) {
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

export async function deleteLabel(data: { id: string }) {
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
