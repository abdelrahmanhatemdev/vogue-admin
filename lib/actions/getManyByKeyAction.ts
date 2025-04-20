import { fetchWithAuth } from "@/lib/api/fetchWithAuth";

interface GetManyByKeyOptions<T> {
  url: string;
  tag: string;
  sortKey?: string;
}

export async function getManyByKeyAction<T>({
  url,
  tag,
  sortKey = "updatedAt",
}: GetManyByKeyOptions<T>): Promise<T[]> {
  try {
    const res = await fetchWithAuth({ url, tag });
    if (res?.ok) {
      const { data } = await res.json();
      if (data) {
        return sortKey
          ? [...data].sort((a, b) =>
              String(b[sortKey]).localeCompare(String(a[sortKey]))
            )
          : data;
      }
    }
    return [];
  } catch (error) {
    console.log(error);
    return [];
  }
}
