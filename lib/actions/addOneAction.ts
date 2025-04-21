import api from "@/lib/api/axiosClient";
import { revalidateTag } from "next/cache";

interface AddOneActionOptions<T> {
  url: string;
  data: Partial<T>;
  tag: string;
  secondTag?: string;
}

interface AddResponse {
  status: "success" | "error";
  message: string;
}

export async function addOneAction<T>({
  url,
  data,
  tag,
  secondTag,
}: AddOneActionOptions<T>): Promise<AddResponse> {
  try {
    const res = await api.post(url, data);

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
  } catch (error: unknown) {
    console.log("error", error);
    const message = "Something went wrong";
    return { status: "error", message };
  }
}
