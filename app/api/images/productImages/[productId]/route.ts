import { NextResponse } from "next/server";
import { getProducts } from "@/actions/Product";
import db from "@/lib/db";
import { tableName } from "@/app/api/images/route";

export const dynamic = "force-static";

export async function GET(
  req: Request,
  props: { params: Promise<{ productId: string }> }
) {
  const params = await props.params;

  const { productId } = await params;

  try {
    const [rows] = await db.query(
      `SELECT * FROM ${tableName} WHERE deletedAt IS NULL AND subproduct_id = ? Order By sortOrder ASC, updatedAt DESC`,
      [productId]
    );

    const images = rows as ProductImage[];
    
    if (images.length > 0) {
      return NextResponse.json(images , { status: 200 });
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