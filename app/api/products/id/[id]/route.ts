import { NextResponse } from "next/server";
import { getProducts } from "@/actions/Product";
import { collectionRef } from "@/app/api/products/route";


export const dynamic = "force-static";

export async function GET(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;

    const { id } = await params;

    const q = collectionRef.where("uuid", "==", id);
    const snapShot = await q.get();
  
    const items =
      snapShot.empty
      ? []
      : snapShot.docs
          .map(
            (doc) =>
              ({
              id: doc.id,
              ...doc.data(),
            } as Product)) 
          .filter((doc) => !doc.deletedAt)

    if (items.length > 0) {
      const product = items[0];

      if (product.uuid) {
        const data = product;

        return NextResponse.json({ data }, { status: 200 });
      }
    }

    throw new Error("No Data Found!");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something Wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function generateStaticParams() {
  const list: Product[] = await getProducts();

  return list?.length > 0 ? list.map(({ id }: { id: string }) => ({ id })) : [];
}
