"use server";
import { fetchWithAuth } from "@/lib/api/fetchWithAuth";
import api from "@/lib/api/axiosClient";
import { revalidateTag } from "next/cache";
import { getAllAction  } from "@/lib/actions/getAllAction";
import { deleteOneAction } from "@/lib/actions/deleteOneAction";

const url = `${process.env.NEXT_PUBLIC_APP_API}/settings/globalNotifications`;
const tag: string = "GlobalNotifications";

export const getGlobalNotification = async () => {
  return getAllAction <GlobalNotification>({url, tag})
};

export async function getGlobalNotificationById(id: string) {
  try {
    const res = await fetchWithAuth({ url: `${url}/${id}`, tag });

    const { data } = await res.json();
    return data;
  } catch (error) {
    return console.log(error);
  }
}

export async function addGlobalNotification(data: Partial<GlobalNotification>) {
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

export async function editGlobalNotification(
  data: Partial<GlobalNotification>
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

export async function deleteGlobalNotification(data: { id: string }) {
  return deleteOneAction({url, tag, data})
}
