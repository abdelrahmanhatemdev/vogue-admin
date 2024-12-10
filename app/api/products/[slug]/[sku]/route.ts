import { NextResponse } from "next/server";
import { getSubproducts } from "@/actions/Subproduct";
import db from "@/lib/db";
import { tableName } from "@/app/api/subproducts/route";

export const dynamic = "force-static";

export async function GET(
  req: Request,
  props: { params: Promise<{ sku: string }> }
) {
  const params = await props.params;

  const { sku } = params;

  try {

    const [subproductsRows] = await db.execute(
      ` SELECT 
          sp.*, 
          GROUP_CONCAT(c.color_id) AS colors,
          GROUP_CONCAT(s.size_id) AS sizes
        FROM 
          ${tableName} sp
        LEFT JOIN 
          subproduct_colors c
        ON 
          sp.uuid = c.subproduct_id 
        LEFT JOIN 
          subproduct_sizes s
        ON
          sp.uuid = s.subproduct_id 
        WHERE 
          sp.deletedAt IS NULL 
        AND 
          sp.sku = ?
        GROUP BY 
          sp.uuid
        ORDER BY 
          sp.updatedAt DESC
        LIMIT 
          1  
          `,
      [sku]
    );
    
    const subproducts = subproductsRows as Subproduct[];
    const subproduct = subproducts[0]

    const data = { subproduct };

    if (data) {
      return NextResponse.json({ data }, { status: 200 });
    }

    throw new Error("No Data Found!");
  } catch (error) {
    console.log("error", error);
    
    const message = error instanceof Error ? error.message : "Something Wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function generateStaticParams() {
  const list: Subproduct[] = await getSubproducts();
  return list.map(({ sku }: { sku: string }) => ({ sku }));
}
