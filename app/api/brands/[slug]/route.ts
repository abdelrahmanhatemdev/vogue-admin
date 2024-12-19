import { NextResponse } from "next/server";
import { getBrands } from "@/actions/Brand";
import db from "@/lib/db";
import { tableName } from "@/app/api/brands/route";

export const dynamic = "force-static";

export async function GET(
  req: Request,
  props: { params: Promise<{ slug: string }> }
) {
  const params = await props.params;

  const { slug } = params;

  try {
    const [rows] = await db.query(
      `SELECT * FROM ${tableName} WHERE deletedAt IS NULL AND slug = ? LIMIT 1`, [slug]
    );

    const items = rows as Brand[];

    const data = items[0]

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
  const list: Brand[] = await getBrands();

  return list.map(({ slug }: { slug: string }) => ({ slug }));
}
