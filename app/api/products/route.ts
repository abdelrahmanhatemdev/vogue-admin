import { NextResponse } from "next/server";
import db from "@/lib/db";
import { ResultSetHeader } from "mysql2";
import { ProductSchema } from "@/lib/validation/productSchema";

export const tableName = "products";

export async function GET() {
  try {
    const [rows] = await db.query(
      `SELECT * FROM ${tableName} WHERE deletedAt IS NULL ORDER BY updatedAt DESC`
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
      brand,
      categories,
      descriptionBrief,
      descriptionDetails,
    } = await request.json();

    // Ensure Server Validation
    ProductSchema.parseAsync({
      uuid,
      name,
      slug,
      brand,
      categories,
      descriptionBrief,
      descriptionDetails,
    });

    const [slugCheck] = await db.execute(
      `SELECT * FROM ${tableName} WHERE slug = ?`,
      [slug]
    );

    const existedItems = slugCheck as Product[];

    if (existedItems.length > 0) {
      return NextResponse.json(
        { error: `${slug} slug is already used!` },
        { status: 400 }
      );
    }

    const [result]: [ResultSetHeader, any] = await db.execute(
      `INSERT INTO ${tableName} ( 
      uuid,
      name,
      slug,
      brand,
      categories,
      descriptionBrief,
      descriptionDetails,
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        uuid,
        name,
        slug,
        brand,
        categories,
        descriptionBrief,
        descriptionDetails,
      ]
    );

    if (result.insertId) {
      return NextResponse.json(
        { message: "Product added", result },
        { status: 200 }
      );
    }

    return new Error("Something Wrong");
  } catch (error) {
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
      brand,
      categories,
      descriptionBrief,
      descriptionDetails,
    } = await request.json();

    // Ensure Server Validation
    ProductSchema.parseAsync({
      uuid,
      name,
      slug,
      brand,
      categories,
      descriptionBrief,
      descriptionDetails,
    });

    const [slugCheck] = await db.execute(
      `SELECT * FROM ${tableName} WHERE slug = ? AND uuid != ?`,
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
      `UPDATE ${tableName} SET name = ?, slug = ?, brand = ?, categories=?, descriptionBrief=?, descriptionDetails=?  WHERE uuid = ?`,
      [
        name,
        slug,
        brand,
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
