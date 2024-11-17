import { NextResponse } from "next/server";
import { query, where, getDocs } from "firebase/firestore";
import { dataCollection } from "../route";
import { getSubproducts } from "@/actions/Subproduct";

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
        sku,
        colors,
        sizes,
        price,
        discount,
        qty,
        sold,
        featured,
        inStock,
        createdAt,
        updatedAt,
      } = doc.data();
      const data: Subproduct = {
        id: doc.id,
        sku,
        colors,
        sizes,
        price,
        discount,
        qty,
        sold,
        featured,
        inStock,
        createdAt,
        updatedAt,
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
  const list: Subproduct[] = await getSubProducts();

  return list.map(({ sku }: { sku: string }) => ({ sku }));
}
