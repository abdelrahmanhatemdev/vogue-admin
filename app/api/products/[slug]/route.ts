import { NextResponse } from "next/server";
import { getProducts } from "@/actions/Product";
import db from "@/lib/db";
import { tableName } from "../route";

export const dynamic = "force-static";

export async function GET(
  req: Request,
  props: { params: Promise<{ slug: string }> }
) {
  const params = await props.params;

  const { slug } = params;

  try {
    const [rows] = await db.query(
      `SELECT * FROM ${tableName} WHERE deletedAt IS NULL AND slug = ? LIMIT 1`,
      [slug]
    );

    const products = rows as Product[];
    const product = products[0] ?  products[0] : null;

    const [subproductsRows] = await db.query(
      `SELECT * FROM subproducts WHERE deletedAt IS NULL AND product_id = ?`,
      [product?.uuid]
    );

    const subproducts = subproductsRows as Subproduct[];

    const data = { product, subproducts };

    if (data) {
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
