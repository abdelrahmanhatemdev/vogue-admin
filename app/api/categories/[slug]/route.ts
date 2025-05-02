import { getCategories } from "@/actions/Category";
import { collectionRef } from "@/app/api/categories/route";
import { getOneActiveByKey } from "@/lib/api/routes/getOneActiveByKey";

export const dynamic = "force-static";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const slug = url.pathname.split("/").pop();

  return getOneActiveByKey<Category>({ collectionRef, value: slug });
}

export async function generateStaticParams() {
  const list: Category[] = await getCategories();

  return list?.length > 0 ? list.map(({ slug }: { slug: string }) => ({ slug })) : [];
}