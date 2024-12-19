import { NextResponse } from "next/server";
import db from "@/lib/db";
import { FieldPacket, ResultSetHeader } from "mysql2";
import { ProductSchema } from "@/lib/validation/productSchema";
import { ZodError } from "zod";
import { tableName as subproductsTable } from "../subproducts/route";

export const tableName = "products";

export async function GET() {
  try {
    const [rows] = await db.query(
      `SELECT ${tableName}.*, 
      brands.name as brand_name, brands.slug as brand_slug, 
      GROUP_CONCAT(c.name," - ", c.slug, " - ", c.uuid) as categories
      FROM ${tableName} 
      JOIN brands
      ON ${tableName}.brand_id = brands.uuid 
      LEFT JOIN product_categories pc
      ON ${tableName}.uuid = pc.product_id
      LEFT JOIN categories c
      ON c.uuid = pc.category_id
      WHERE ${tableName}.deletedAt IS NULL 
      GROUP BY ${tableName}.uuid
      ORDER BY updatedAt DESC
      `
    );

    const data = rows as Product[];

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something Wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
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

    //Ensure Server Validation
    await ProductSchema.parseAsync({
      uuid,
      name,
      slug,
      brand_id,
      categories,
      descriptionBrief,
      descriptionDetails,
    });

    const [slugCheck] = await db.execute(
      `SELECT * FROM ${tableName} WHERE deletedAt IS NULL AND slug = ?`,
      [slug]
    );

    const existedItems = slugCheck as Product[];

    if (existedItems.length > 0) {
      return NextResponse.json(
        { error: `${slug} slug is already used!` },
        { status: 400 }
      );
    }

    const nonEmptyCategories = categories.filter(
      (cat: string) => cat.trim() !== ""
    );

    if (nonEmptyCategories.length === 0) {
      throw new Error("Choose at least one category");
    }

    const [result]: [ResultSetHeader, FieldPacket[]] = await db.execute(
      `INSERT INTO ${tableName} ( 
      uuid,
      name,
      slug,
      brand_id,
      descriptionBrief,
      descriptionDetails
      ) VALUES (?, ?, ?, ?, ?, ?)`,
      [uuid, name, slug, brand_id, descriptionBrief, descriptionDetails]
    );

    const catArray = nonEmptyCategories.map((c: string) => [uuid, c]);
    const placeholders = catArray.map(() => "(?, ?)").join(", ");
    const flattenedValues = catArray.flat();

    await db.execute(
      `INSERT INTO product_categories (product_id, category_id) VALUES ${placeholders}`,
      flattenedValues
    );

    return NextResponse.json({ message: "Product added" }, { status: 200 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 500 }
      );
    }
    const message = error instanceof Error ? error.message : "Something Wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
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

    // // Ensure Server Validation
    await ProductSchema.parseAsync({
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

    const nonEmptyCategories = categories.filter(
      (cat: string) => cat.trim() !== ""
    );

    if (nonEmptyCategories.length === 0) {
      throw new Error("Choose at least one category");
    }

    await db.execute(`DELETE FROM product_categories WHERE product_id = ?`, [
      uuid,
    ]);

    const catArray = nonEmptyCategories.map((c: string) => [uuid, c]);
    const placeholders = catArray.map(() => "(?, ?)").join(", ");
    const flattenedValues = catArray.flat();

    await db.execute(
      `INSERT INTO product_categories (product_id, category_id) VALUES ${placeholders}`,
      flattenedValues
    );

    const [result]: [ResultSetHeader, FieldPacket[]] = await db.execute(
      `UPDATE ${tableName} SET name = ?, slug = ?, brand_id = ?, descriptionBrief = ?, descriptionDetails = ?  WHERE uuid = ?`,
      [name, slug, brand_id, descriptionBrief, descriptionDetails, uuid]
    );

    if (result.affectedRows) {
      return NextResponse.json({ message: "Product updated" }, { status: 200 });
    }
  } catch (error) {
     if (error instanceof ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 500 }
      );
    }
    const message = error instanceof Error ? error.message : "Something Wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { uuid } = await request.json();

    const [result]: [ResultSetHeader, FieldPacket[]] = await db.execute(
      `UPDATE ${tableName} SET deletedAt = CURRENT_TIMESTAMP WHERE uuid = ?`,
      [uuid]
    );

    const [subProductResult]: [ResultSetHeader, FieldPacket[]] = await db.execute(
      `UPDATE ${subproductsTable} SET deletedAt = CURRENT_TIMESTAMP WHERE product_id = ?`,
      [uuid]
    );

    if (result.affectedRows) {
      return NextResponse.json({ message: "Product Deleted" }, { status: 200 });
    }
  } catch (error) {

    const message = error instanceof Error ? error.message : "Something Wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
