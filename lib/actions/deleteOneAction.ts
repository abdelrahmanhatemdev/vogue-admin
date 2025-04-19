import api from "@/lib/api/axiosClient";
import { revalidateTag } from "next/cache";

interface deleteOneActionOptions {
  url: string;
  data: { id: string };
  tag: string;
  secondTag?: string
}

interface DeleteResponse {
  status: "success" | "error";
  message: string;
}

export async function deleteOneAction({
  url,
  data,
  tag,
  secondTag
}: deleteOneActionOptions): Promise<DeleteResponse> {
  try {
    const res = await api.delete(url, { data });

    if (res?.statusText === "OK" && res?.data?.message) {
      revalidateTag(tag);
      if (secondTag) {
        revalidateTag(secondTag);
      }
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
