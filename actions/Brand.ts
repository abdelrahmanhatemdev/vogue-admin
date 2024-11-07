"use server";
import axios from "axios";
import { revalidateTag } from "next/cache";

const apiURL = `${process.env.NEXT_PUBLIC_APP_API}/brands`;
const tag: string = "brands";

export const getBrands = async () => {
  try {
    const res = await fetch(apiURL, {
      next: { tags: [tag] },
      cache: "force-cache",
    });
    let data: Brand[] = [];

    if (res) {
      const { data } = await res.json();

      const sortedData = data.sort((a: Brand, b: Brand) =>
        b.updatedAt.localeCompare(a.updatedAt)
      );

      return sortedData;
    }
    return data;
  } catch (error) {
    return console.log(error);
  }
}

export async function getBrandById(id: string) {
  try {
    const res = await fetch(`${apiURL}/${id}`, {
      next: { tags: ["brands"] },
      cache: "force-cache",
    });

    const { data } = await res.json();
    return data;
  } catch (error) {
    return console.log(error);
  }
}

export async function addBrand(data: Partial<Brand>) {
  return axios
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

export async function editBrand(data: Partial<Brand>) {
  return axios
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

export async function deleteBrand(data: { id: string }) {
  return axios
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
