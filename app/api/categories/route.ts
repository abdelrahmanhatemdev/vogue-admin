import { NextResponse } from "next/server";
import db from "@/lib/db";
import { ResultSetHeader } from "mysql2";
import { CategorySchema } from "@/lib/validation/categorySchema";

export const tableName = "categories";

export const dynamic = "force-static";

export async function GET() {
  try {
    const [rows] = await db.query(
      `SELECT * FROM ${tableName} WHERE deletedAt IS NULL ORDER BY updatedAt DESC`
    );

    const data = rows as Category[];

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something Wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { uuid, name, slug } = await request.json();

    // Ensure Server Validation
    CategorySchema.parseAsync({ name, slug });

    const [slugCheck] = await db.execute(
      `SELECT * FROM ${tableName} WHERE slug = ?`,
      [slug]
    );

    const existedItems = slugCheck as Category[];

    if (existedItems.length > 0) {
      return NextResponse.json(
        { error: `${slug} slug is already used!` },
        { status: 400 }
      );
    }

    const [result]: [ResultSetHeader, any] = await db.execute(
      `INSERT INTO ${tableName} (uuid, name, slug) VALUES (?, ?, ?)`,
      [uuid, name, slug]
    );

    if (result.insertId) {
      return NextResponse.json(
        { message: "Category added", result },
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
    const { uuid, name, slug } = await request.json();

    // Ensure Server Validation
    CategorySchema.parseAsync({ name, slug, uuid });

    const [slugCheck] = await db.execute(
      `SELECT * FROM ${tableName} WHERE slug = ? AND uuid != ?`,
      [slug, uuid]
    );

    const existedItems = slugCheck as Category[];

    if (existedItems.length > 0) {
      return NextResponse.json(
        { error: `${slug} slug is already used!` },
        { status: 400 }
      );
    }

    const [result]: [ResultSetHeader, any] = await db.execute(
      `UPDATE ${tableName} SET name = ? , slug = ? WHERE uuid = ?`,
      [name, slug, uuid]
    );

    if (result.affectedRows) {
      return NextResponse.json(
        { message: "Category updated", result },
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
        { message: "Category Deleted", result },
        { status: 200 }
      );
    }
    return new Error("Something Wrong");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something Wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
