"use server";
import { fetchWithAuth } from "@/lib/api/fetchData";
import api from "@/lib/api/axiosClient";
import { revalidateTag } from "next/cache";

const apiURL = `${process.env.NEXT_PUBLIC_APP_API}/brands`;
const tag: string = "brands";

export const getBrands = async () => {
  try {
    const res = await fetchWithAuth({ url: apiURL, tag });
    if (res?.ok) {
      const { data } = await res.json();

      if (data?.length > 0) {
        return data.sort((a: Brand, b: Brand) =>
          b.updatedAt.localeCompare(a.updatedAt)
        );
      }
    }
    return [];
  } catch (error) {
    return console.log(error);
  }
};

export async function getBrandBySlug(slug: string) {
  try {
    const res = await fetchWithAuth({ url: `${apiURL}/${slug}`, tag });

    const { data } = await res.json();
    return data;
  } catch (error) {
    return console.log(error);
  }
}

export async function addBrand(data: Partial<Brand>) {
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

export async function editBrand(data: Partial<Brand>) {
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

export async function deleteBrand(data: { id: string }) {
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
