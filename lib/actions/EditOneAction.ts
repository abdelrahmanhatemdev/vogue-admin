import api from "@/lib/api/axiosClient";
import { revalidateTag } from "next/cache";

interface EditOneActionOptions<T> {
  url: string;
  data: Partial<T>;
  tag: string;
  secondTag?: string;
}

interface EditResponse {
  status: "success" | "error";
  message: string;
}

export async function EditOneAction<T>({
  url,
  data,
  tag,
  secondTag,
}: EditOneActionOptions<T>): Promise<EditResponse> {
  try {
    const res = await api.put(url, data);

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
    const message = error?.response?.data?.error || "Something went wrong";
    return { status: "error", message };
  }
}
