import { NextResponse } from "next/server";
import db from "@/lib/db";
import { ResultSetHeader } from "mysql2";
import { ProductSchema } from "@/lib/validation/productSchema";

export const tableName = "products";

export async function GET() {
  try {
    const [rows] = await db.query(
      `SELECT ${tableName}.* , 
      brands.name as brand_name, brands.slug as brand_slug, 
      GROUP_CONCAT(c.name," - ", c.slug) as categories
      FROM ${tableName} 
      JOIN brands
      ON ${tableName}.brand_id = brands.uuid 
      LEFT JOIN product_categories pc
      ON ${tableName}.uuid = pc.product_id
      LEFT JOIN categories c
      ON c.uuid = pc.category_id
      GROUP BY ${tableName}.uuid
      `
    );

    // console.log("rows", rows);
    

    const data = rows as Product[];

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something Wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  return NextResponse.json(
    { message: "Product added" },
    { status: 200 }
  );
  // try {
  //   // const {
  //   //   uuid,
  //   //   name,
  //   //   slug,
  //   //   brand_id,
  //   //   categories,
  //   //   descriptionBrief,
  //   //   descriptionDetails,
  //   // } = await request.json();

    

  //   // Ensure Server Validation
  //   // ProductSchema.parseAsync({
  //   //   uuid,
  //   //   name,
  //   //   slug,
  //   //   brand_id,
  //   //   categories,
  //   //   descriptionBrief,
  //   //   descriptionDetails,
  //   // });

  //   // const [slugCheck] = await db.execute(
  //   //   `SELECT * FROM ${tableName} WHERE deletedAt IS NULL AND slug = ?`,
  //   //   [slug]
  //   // );

  //   // const existedItems = slugCheck as Product[];

  //   // if (existedItems.length > 0) {
  //   //   return NextResponse.json(
  //   //     { error: `${slug} slug is already used!` },
  //   //     { status: 400 }
  //   //   );
  //   // }

  //   // console.log({
  //   //   uuid,
  //   //   name,
  //   //   slug,
  //   //   brand_id,
  //   //   categories,
  //   //   descriptionBrief,
  //   //   descriptionDetails,
  //   // });

   

    

  //   // const [result]: [ResultSetHeader, any] = await db.execute(
  //   //   `INSERT INTO ${tableName} ( 
  //   //   uuid,
  //   //   name,
  //   //   slug,
  //   //   brand_id,
  //   //   descriptionBrief,
  //   //   descriptionDetails
  //   //   ) VALUES (?, ?, ?, ?, ?, ?)`,
  //   //   [uuid, name, slug, brand_id, descriptionBrief, descriptionDetails]
  //   // );

    
  //   // if (categories.length > 0) {
  //   //   const catArray = categories.map((c: string) => [uuid, c]);

  //   //    // Insert into products_categories using a single query
  //   //    const placeholders = catArray.map(() => '(?, ?)').join(', ');
  //   //    const flattenedValues = catArray.flat();
 
  //   //    const [result] = await db.execute(
  //   //      `INSERT INTO product_categories (product_id, category_id) VALUES ${placeholders}`,
  //   //      flattenedValues
  //   //    );

       
       
  //   // }

    

    

    
      
      


  //     // return NextResponse.json(
  //     //   { message: "Product added" },
  //     //   { status: 200 }
  //     // );
    

  //   // throw new Error("Something Wrong");
  // } catch (error) {
  //   console.log(error);
    
  //   const message = error instanceof Error ? error.message : "Something Wrong";
  //   return NextResponse.json({ error: message }, { status: 500 });
  // }
}

export async function PUT(request: Request) {
  try {
    const {
      uuid,
      name,
      slug,
      brand_id,
      categories,
      descriptionBrief,
      descriptionDetails,
    } = await request.json();

    // Ensure Server Validation
    ProductSchema.parseAsync({
      uuid,
      name,
      slug,
      brand_id,
      categories,
      descriptionBrief,
      descriptionDetails,
    });

    const [slugCheck] = await db.execute(
      `SELECT * FROM ${tableName} WHERE deletedAt IS NULL AND slug = ? AND uuid != ?`,
      [slug, uuid]
    );

    const existedItems = slugCheck as Product[];

    if (existedItems.length > 0) {
      return NextResponse.json(
        { error: `${slug} slug is already used!` },
        { status: 400 }
      );
    }

    const [result]: [ResultSetHeader, any] = await db.execute(
      `UPDATE ${tableName} SET name=?, slug=?, brand_id = ?, categories=?, descriptionBrief=?, descriptionDetails=?  WHERE uuid = ?`,
      [
        name,
        slug,
        brand_id,
        categories,
        descriptionBrief,
        descriptionDetails,
        uuid,
      ]
    );

    if (result.affectedRows) {
      return NextResponse.json(
        { message: "Product updated", result },
        { status: 200 }
      );
    }

    return new Error("Something Wrong");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something Wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { uuid } = await request.json();

    console.log("uuid", uuid);

    const [result]: [ResultSetHeader, any] = await db.execute(
      `UPDATE ${tableName} SET deletedAt = CURRENT_TIMESTAMP WHERE uuid = ?`,
      [uuid]
    );

    if (result.affectedRows) {
      return NextResponse.json(
        { message: "Product Deleted", result },
        { status: 200 }
      );
    }
    return new Error("Something Wrong");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something Wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
