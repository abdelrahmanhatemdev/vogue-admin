import { fetchWithAuth } from "@/lib/api/fetchWithAuth";

interface GetOneByKeyOptions {
  url: string;
  tag: string;
}

export async function getOneByKeyAction<T>({
  url,
  tag,
}: GetOneByKeyOptions & { revalidate?: number | false }): Promise<T | null> {
  try {
    const res = await fetchWithAuth({
      url,
      tag,
    });
    console.log("url", url);
    const { data }: { data: T } = await res.json();
    console.log("data", data);
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
}
