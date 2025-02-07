import { NextResponse } from "next/server";
import { getProducts } from "@/actions/Product";
import { adminDB } from "@/database/firebase-admin"; // ✅ Firestore Admin SDK

export const dynamic = "force-static";

export async function GET(
  req: Request,
  props: { params: Promise<{ slug: string }> }
) {
  try {
    const params = await props.params;
    const { slug } = await params;

    const productSnap = await adminDB
      .collection("products")
      .where("slug", "==", slug)
      .get();

    if (productSnap.empty) {
      throw new Error("No Product Found!");
    }

    const product = productSnap.docs
      .map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as Product)
      )
      .filter((doc) => !doc.deletedAt)[0];

    if (!product || !product.uuid) {
      throw new Error("Invalid Product Data!");
    }

    const subproductsSnap = await adminDB
      .collection("subproducts")
      .where("productId", "==", product.uuid)
      .get();

    const subproducts = subproductsSnap.empty
      ? []
      : (subproductsSnap.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          } as Subproduct))
          .filter((doc) => !doc.deletedAt));

    return NextResponse.json({ product, subproducts }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something Wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function generateStaticParams() {
  const list: Product[] = await getProducts();
  return list.map(({ slug }: { slug: string }) => ({ slug }));
}
