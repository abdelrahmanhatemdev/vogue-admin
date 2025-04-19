import { fetchWithAuth } from "@/lib/api/fetchWithAuth";
import { getOneActiveByKey } from "@/lib/api/getOneActiveByKey";


interface GetOneBySlugOptions<T> {
    url: string;
    tag: string;
    slug?: string;
}

export async function getOneBySlug<T>({url, tag, slug}:GetOneBySlugOptions) {
  try {
    const res = await getOneActiveByKey({ url: `${url}/${slug}`, tag });

    const { data } = await res.json();
    return data;
  } catch (error) {
    return console.log(error);
  }
}