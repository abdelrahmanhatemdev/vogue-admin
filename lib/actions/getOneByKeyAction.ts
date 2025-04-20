import { fetchWithAuth } from "@/lib/api/fetchWithAuth";

interface GetOneByKeyOptions<T> {
  url: string;
  tag: string;
}

export async function getOneByKeyAction<T>({
  url,
  tag,
}: GetOneByKeyOptions<T>): Promise<T | null> {
  try {
    const res = await fetchWithAuth({ url, tag });
    const { data } : {data: T} = await res.json();
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
}
