import { getBrandBySlug } from "@/actions/Brand";
import dynamic from "next/dynamic";
import Loading from "@/components/custom/Loading";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { title } from "@/app/(website)/(pages)/brands/page";

const Brand = dynamic(
  () => import("@/components/modules/brands/Brand"),
  { loading: Loading }
);


export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const { slug } = await params;

  if (slug) {
    const data = await getBrandBySlug(slug);

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

  const data: Brand = await getBrandBySlug(slug);

   if (!data) {
      notFound();
    }

  return <Brand data={data} />;
}
