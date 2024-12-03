import { NextResponse } from "next/server";
import db from "@/lib/db";
import { ResultSetHeader } from "mysql2";
import { BrandSchema } from "@/lib/validation/brandSchema";

export const tableName = "brands";

export async function GET() {
  try {
    const [rows] = await db.query(
      `SELECT * FROM ${tableName} WHERE deletedAt IS NULL ORDER BY updatedAt DESC`
    );

    const data = rows as Brand[];

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
    BrandSchema.parseAsync({ uuid, name, slug });

    const [slugCheck] = await db.execute(
      `SELECT * FROM ${tableName} WHERE deletedAt IS NULL AND slug = ?`,
      [slug]
    );

    const existedItems = slugCheck as Brand[];

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
        { message: "Brand added", result },
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
    BrandSchema.parseAsync({ uuid, name, slug });

    const [slugCheck] = await db.execute(
      `SELECT * FROM ${tableName} WHERE deletedAt IS NULL AND slug = ? AND uuid != ?`,
      [slug, uuid]
    );

    const existedItems = slugCheck as Brand[];

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
        { message: "Brand updated", result },
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
        { message: "Brand Deleted", result },
        { status: 200 }
      );
    }
    return new Error("Something Wrong");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something Wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
