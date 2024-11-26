import { NextResponse } from "next/server";
import { getProducts } from "@/actions/Product";
import db from "@/lib/db";
import { tableName } from "../../route";

export const dynamic = "force-static";

export async function GET(
  req: Request,
  props: { params: Promise<{ uuid: string }> }
) {
  const params = await props.params;

  const { uuid } = params;

  try {
    const [rows] = await db.query(
      `SELECT * FROM ${tableName} WHERE deletedAt IS NULL AND uuid = ? LIMIT 1`, [uuid]
    );

    const items = rows as Product[];

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
  const list: Product[] = await getProducts();

  return list.map(({ uuid }: { uuid: string }) => ({ uuid }));
}
