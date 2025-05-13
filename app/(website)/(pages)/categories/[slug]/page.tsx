import { 
  // getCategories, 
  getCategoryBySlug } from "@/actions/Category";
import nextDynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { title } from "@/app/(website)/(pages)/categories/page";

import Loading from "@/components/custom/Loading";

const Category = nextDynamic(
  () => import("@/components/modules/categories/Category"),
  { loading: Loading }
);

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const { slug } = await params;

  if (slug) {
    const data = await getCategoryBySlug(slug);

    if (data?.name) {
      return {
        title: `${title} - ${data.name}`,
      };
    }
  }
  return {
    title: "Not Found",
  };
}

export default async function CatergoryPage( {
  params: {slug},
}: {
  params: { slug: string };
}) {



 
  
  
  const data = await getCategoryBySlug(slug);


  

  if (!data) {
    notFound();
  }

  return <Category data={data} />;
}


// export async function generateStaticParams() {
//   try {
//     const list: Category[] = await getCategories();

//   return list?.length > 0
//     ? list.map(({ slug }: { slug: string }) => ({ slug }))
//     : [];
//   } catch (error) {
//     console.log("error", error);
//     return []
    
//   }
  
// }