"use server";
import axios from "axios";
import { revalidateTag } from "next/cache";

const apiURL = `${process.env.NEXT_PUBLIC_APP_API}/categories`;
const tag: string = "categories";

export async function getCategories() {
  try {
    const res = await fetch(apiURL, {
      next: { tags: [tag] },
    });
    let data: Category[] = [];

    if (res) {
      const { data } = await res.json();

      const sortedData = data.sort((a: Category, b: Category) =>
        b.updatedAt.localeCompare(a.updatedAt)
      );

      return sortedData;
    }
    return data;
  } catch (error) {
    return console.log(error);
  }
}

export async function getCategoryById(id: string) {
  try {
    const res = await fetch(`${apiURL}/${id}`, {
      next: { tags: ["categories"] },
    });

    const { data } = await res.json();
    return data;
  } catch (error) {
    return console.log(error);
  }
}

export async function addCategory(data: Partial<Category>) {
  return axios
    .post(`${process.env.NEXT_PUBLIC_APP_API}/categories`, data)
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

export async function editCategory(data: Partial<Category>) {
  return axios
    .put(`${process.env.NEXT_PUBLIC_APP_API}/categories`, data)
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
  return axios
    .delete(`${process.env.NEXT_PUBLIC_APP_API}/categories`, { data })
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
