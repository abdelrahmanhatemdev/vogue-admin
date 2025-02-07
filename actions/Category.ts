"use server";
import { fetchWithAuth } from "@/lib/api/fetchWithAuth";
import api from "@/lib/axiosClient";
import { revalidateTag } from "next/cache";

const apiURL = `${process.env.NEXT_PUBLIC_APP_API}/categories`;
const tag: string = "categories";

export const getCategories = async () => {
  try {
    const res = await fetchWithAuth({ url: apiURL, tag });

    if (res?.ok) {
      const { data } = await res.json();

      if (data) {
        return data.sort((a: Category, b: Category) =>
          b.updatedAt.localeCompare(a.updatedAt)
        );
      }
    }

    return [];
  } catch (error) {
    return console.log(error);
  }
};

export async function getCategoryBySlug(slug: string) {
  try {
    const res = await fetchWithAuth({ url: `${apiURL}/${slug}`, tag });

    const { data } = await res.json();
    return data;
  } catch (error) {
    return console.log(error);
  }
}

export async function addCategory(data: Partial<Category>) {
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

export async function editCategory(
  data: Partial<
    Category & {
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

export async function deleteCategory(data: { id: string }) {
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
