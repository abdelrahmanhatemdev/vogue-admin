"use server";
import api from "@/lib/axiosClient";
import { revalidateTag } from "next/cache";

const apiURL = `${process.env.NEXT_PUBLIC_APP_API}/colors`;
const tag: string = "colors";

export const getColors = async () => {
  try {
    const res = await fetch(apiURL, {
      next: { tags: [tag] },
      cache: "force-cache",
    });
    if (res?.ok) {
      const { data } = await res.json();

      if (data) {
        data.forEach((item: Color) => {
          revalidateTag(`${tag}:${item?.uuid}`);
        });

        return data.sort((a: Color, b: Color) =>
          b.updatedAt.localeCompare(a.updatedAt)
        );
      }
    }
    return [];
  } catch (error) {
    return console.log(error);
  }
};

export async function getColorById(id: string) {
  try {
    const res = await fetch(`${apiURL}/${id}`, {
      next: { tags: [tag] },
      cache: "force-cache",
    });

    const { data } = await res.json();
    return data;
  } catch (error) {
    return console.log(error);
  }
}

export async function addColor(data: Partial<Color>) {
  return api
    .post(apiURL, data)
    .then((res) => {
      if (res?.statusText === "OK" && res?.data?.message) {
        revalidateTag(tag);
        revalidateTag(`${tag}:${data?.uuid}`);
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
    .put(apiURL, data)
    .then((res) => {
      if (res?.statusText === "OK" && res?.data?.message) {
        revalidateTag(`${tag}:${data?.uuid}`);
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

export async function deleteColor(data: { uuid: string }) {
  return api
    .delete(apiURL, { data })
    .then((res) => {
      if (res?.statusText === "OK" && res?.data?.message) {
        revalidateTag(tag);
        revalidateTag(`${tag}:${data?.uuid}`);
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
