import { NextResponse } from "next/server";
import { adminDB } from "@/database/firebase-admin";

export const dynamic = "force-static";

export async function GET(
  req: Request,
  props: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await props.params;
    
    const productSnap = await adminDB
      .collection("products")
      .where("slug", "==", slug)
      .where("isActive", "==", true)
      .limit(1)
      .get();

    if (productSnap.empty) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const productDoc = productSnap.docs[0];
    const product = { id: productDoc.id, ...productDoc.data() } as Product;

    if (!product.uuid) {
      return NextResponse.json({ error: "Invalid product data" }, { status: 400 });
    }

    // Fetch subproducts for this product
    const subproductsSnap = await adminDB
      .collection("subproducts")
      .where("productId", "==", product.uuid)
      .where("isActive", "==", true)
      .get();

    const subproducts: Subproduct[] = subproductsSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Subproduct[];

    return NextResponse.json({ data: subproducts }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something went wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
