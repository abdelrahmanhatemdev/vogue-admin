import { fetchWithAuth } from "@/lib/api/fetchWithAuth";

interface GetAllOptions {
  url: string;
  tag: string;
  sortKey?: string;
}

interface GetAllResult<T> {
  data: T[];
  nextCursor: string | null;
  limit: number;
  total: number;
}

export async function getAllAction<T>({
  url,
  tag,
  sortKey = "updatedAt",
}: GetAllOptions): Promise<GetAllResult<T> | null> {
  try {
    const res = await fetchWithAuth({ url, tag });

    if (res?.ok) {
      const { data = [], nextCursor = null, limit = 10, total = 0 } = await res.json();

      const sortedData = sortKey
        ? [...data].sort((a, b) =>
            String(b[sortKey]).localeCompare(String(a[sortKey]))
          )
        : data;

      return { data: sortedData, nextCursor, limit, total };
    }

    return null;
  } catch (error) {
    console.error("getAllAction error:", error);
    return null;
  }
}