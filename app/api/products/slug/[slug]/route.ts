import { NextResponse } from "next/server";
import { query, where, getDocs } from "firebase/firestore";
import { dataCollection } from "../../route";
import { getProducts } from "@/actions/Product";

export const dynamic = "force-static";

export async function GET(
  req: Request,
  props: { params: Promise<{ slug: string }> }
) {
  const params = await props.params;

  const { slug } = params;

  try {
    const q = query(dataCollection, where("slug", "==", slug));
    const querySnapshot = (await getDocs(q)).docs;
    const doc = querySnapshot[0];

    if (doc?.id) {
      const {
        name,
        slug,
        brand,
        categories,
        descriptionBrief,
        descriptionDetails,
        createdAt,
        updatedAt,
        subproducts
      } = doc.data();
      const data: Product = {
        id: doc.id,
        name,
        slug,
        brand,
        categories,
        descriptionBrief,
        descriptionDetails,
        createdAt,
        updatedAt,
        subproducts
      };
      return NextResponse.json({ data }, { status: 200 });
    }

    throw new Error("No Data Found!");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something Wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function generateStaticParams() {
  const list: Product[] = await getProducts();

  return list.map(({ slug }: { slug: string }) => ({ slug }));
}
