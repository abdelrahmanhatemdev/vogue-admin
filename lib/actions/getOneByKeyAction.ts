import { fetchWithAuth } from "@/lib/api/fetchWithAuth";

interface GetOneByKeyOptions<T> {
  url: string;
  tag: string;
  key: "slug" | "sku";
}

export async function getOneByKeyAction<T>({
  url,
  tag,
  key = "slug",
}: GetOneByKeyOptions<T>) {
  try {
    const res = await fetchWithAuth({ url: `${url}/${key}`, tag });
    const { data } = await res.json();
    return data;
  } catch (error) {
    return console.log(error);
  }
}
