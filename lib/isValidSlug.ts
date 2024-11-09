const apiURL = process.env.NEXT_PUBLIC_APP_API;
const isValidSlug = async ({
  slug,
  collection,
  id,
}: {
  slug: string;
  collection: string;
  id?: string;
}) => {
  try {
    const res = await fetch(`${apiURL}/${collection}`, {
      next: { tags: [collection] },
      cache: "force-cache",
    });

    if (res) {
      const { data } = await res.json();
      const check = data.some((item: { id: string; slug: string }) => {
        if (item.id === id) {
          return false
        }
        return item.slug === slug;
      });

      return !check;
    }
    return true;
  } catch (error) {
    return true;
  }
};
export default isValidSlug;
