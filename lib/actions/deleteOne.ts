import api from "@/lib/api/axiosClient";
import { revalidateTag } from "next/cache";

interface DeleteOneOptions {
  url: string;
  tag: string;
  data: { id: string };
}

interface DeleteResponse {
  status: "success" | "error";
  message: string;
}

export async function deleteOne({
  url,
  tag,
  data,
}: DeleteOneOptions): Promise<DeleteResponse> {
  try {
    const res = await api.delete(url, { data });

    if (res?.statusText === "OK" && res?.data?.message) {
      revalidateTag(tag);
      return { status: "success", message: res.data.message };
    }

    return {
      status: "error",
      message: res?.data?.error || "Something went wrong",
    };
  } catch (error: any) {
    return {
      status: "error",
      message: error?.response?.data?.error || "Something went wrong",
    };
  }
}
