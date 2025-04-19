
interface GetOneBySlugOptions<T> {
    url: string;
    tag: string;
    slug?: string;
  }




export async function getOneBySlug<T>({url, tag, slug}:GetOneBySlugOptions) {
  try {
    const res = await fetchWithAuth({ url: `${url}/${slug}`, tag });

    const { data } = await res.json();
    return data;
  } catch (error) {
    return console.log(error);
  }
}