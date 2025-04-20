"use server";
import { fetchWithAuth } from "@/lib/api/fetchWithAuth";
import api from "@/lib/api/axiosClient";
import { revalidateTag } from "next/cache";
import { getAllAction } from "@/lib/actions/getAllAction";
import { deleteOneAction } from "@/lib/actions/deleteOneAction";
import { getOneByKeyAction } from "@/lib/actions/getOneByKeyAction";

const url = `${process.env.NEXT_PUBLIC_APP_API}/admins`;
const tag: string = "admins";

export const getAdmins = async () => {
  return getAllAction<Admin>({ url, tag });
};

export async function getAdminById(uuid: string) {
  return getOneByKeyAction<Admin>({ url: `${url}/${uuid}`, tag})
}

export async function addAdmin(data: Partial<Admin>) {
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

export async function editAdmin(data: Partial<Admin>) {
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

export async function deleteAdmin(data: { id: string; uid: string }) {
  return deleteOneAction({ url, tag, data });
}
