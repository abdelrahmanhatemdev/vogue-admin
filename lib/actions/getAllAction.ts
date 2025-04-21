import { fetchWithAuth } from "@/lib/api/fetchWithAuth";

interface GetAllOptions {
  url: string;
  tag: string;
  sortKey?: string;
}

export async function getAllAction<T>({
  url,
  tag,
  sortKey = "updatedAt",
}: GetAllOptions): Promise<T[]> {
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
