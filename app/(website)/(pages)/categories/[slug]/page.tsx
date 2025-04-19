import { getCategories, getCategoryBySlug } from "@/actions/Category";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { title } from "@/app/(website)/(pages)/categories/page";

import Loading from "@/components/custom/Loading";

const Category = dynamic(
  () => import("@/components/modules/categories/Category"),
  { loading: Loading }
);

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const { slug } = await params;

  if (slug) {
    const data = await getCategoryBySlug(slug);

    if (data.name) {
      return {
        title: `${title} - ${data.name}`,
      };
    }
  }
  return {
    title: "Not Found",
  };
}

export default async function CatergoryPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;

  const { slug } = await params;
  
  const data: Category = await getCategoryBySlug(slug);

  if (!data) {
    notFound();
  }

  return <Category data={data} />;
}


export async function generateStaticParams() {
  const list: Category[] = await getCategories();

  return list?.length > 0
    ? list.map(({ slug }: { slug: string }) => ({ slug }))
    : [];
}