import { NextResponse } from "next/server";
import { getProducts } from "@/actions/Product";
import db from "@/lib/db";
import { getSubproducts } from "@/actions/Subproduct";

export const dynamic = "force-static";

export async function GET(
  req: Request,
  props: { params: Promise<{ sku: string }> }
) {
  try {
    const params = await props.params;

  const {sku } = params;

    const [rows] = await db.query(
      `SELECT sp.*, 
      p.name AS product_name, 
      p.slug AS product_slug
      FROM
      subproducts sp 
      JOIN 
      products p
      ON 
      sp.product_id = p.uuid
      WHERE 
      sp.deletedAt IS NULL 
      AND sku = ? LIMIT 1`,
      [sku]
    );

    const subproducts = rows as Product[];
    const subproduct = subproducts[0] ?  subproducts[0] : null;

    const data = { subproduct };
    
    if (subproduct) {
      return NextResponse.json({ data }, { status: 200 });
    }

    throw new Error("No Data Found!");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something Wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function generateStaticParams() {
  const list: Subproduct[] = await getSubproducts();
  return list.map(({ sku }: { sku: string }) => ({ sku }));
}