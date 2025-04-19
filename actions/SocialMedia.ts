"use server";
import { fetchWithAuth } from "@/lib/api/fetchWithAuth";
import api from "@/lib/api/axiosClient";
import { revalidateTag } from "next/cache";
import { getAll  } from "@/lib/actions/getAll";
import { deleteOne } from "@/lib/actions/deleteOne";

const url = `${process.env.NEXT_PUBLIC_APP_API}/settings/socialMedia`;
const tag: string = "SocialMedias";

export const getSocialMedia = async () => {
  return getAll <SocialMedia>({url, tag})
};

export async function getSocialMediaById(id: string) {
  try {
    const res = await fetchWithAuth({ url: `${url}/${id}`, tag });

    const { data } = await res.json();
    return data;
  } catch (error) {
    return console.log(error);
  }
}

export async function addSocialMedia(data: Partial<SocialMedia>) {
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

export async function editSocialMedia(data: Partial<SocialMedia>) {
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

export async function deleteSocialMedia(data: { id: string }) {
  return deleteOne({url, tag, data})
}
