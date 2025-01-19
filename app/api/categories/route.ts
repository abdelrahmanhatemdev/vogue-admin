import { NextResponse } from "next/server";
import db from "@/lib/db";
import { FieldPacket, ResultSetHeader } from "mysql2";
import { CategorySchema } from "@/lib/validation/categorySchema";

export const tableName = "categories";

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
    const { uuid, name, slug, additional, parent, label  } = await request.json();
    
    // Ensure Server Validation
    CategorySchema.parseAsync({ uuid, name, slug, additional, parent, label});

    const [slugCheck] = await db.execute(
      `SELECT * FROM ${tableName} WHERE deletedAt IS NULL AND slug = ?`,
      [slug]
    );

    const existedItems = slugCheck as Category[];

    if (existedItems.length > 0) {
      return NextResponse.json(
        { error: `${slug} slug is already used!` },
        { status: 400 }
      );
    }

    const [result]: [ResultSetHeader, FieldPacket[]] = await db.execute(
      `INSERT INTO ${tableName} (uuid, name, slug, additional, parent, label ) VALUES (?, ?, ?, ?, ?, ?)`,
      [uuid, name, slug, additional, parent, label ]
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
  const reqData = await request.json();
  if (reqData?.property) {
    const { property, uuid, value } = reqData;
    const [result]: [ResultSetHeader, FieldPacket[]] = await db.execute(
      `UPDATE ${tableName} SET 
      ${property} = ?
      WHERE 
      uuid = ?`,
      [value, uuid]
    );

    if (result.affectedRows) {
      return NextResponse.json({ message: "Product updated" }, { status: 200 });
    }
    return NextResponse.json({ message: "Something wrong" }, { status: 500 });
  }

  try {
    const { uuid, name, slug, additional, parent, label } = reqData;
   

    // Ensure Server Validation
    CategorySchema.parseAsync({ uuid, name, slug, additional, parent, label });

    const [slugCheck] = await db.execute(
      `SELECT * FROM ${tableName} WHERE deletedAt IS NULL AND slug = ? AND uuid != ?`,
      [slug, uuid]
    );

    const existedItems = slugCheck as Category[];

    if (existedItems.length > 0) {
      return NextResponse.json(
        { error: `${slug} slug is already used!` },
        { status: 400 }
      );
    }

    const [result]: [ResultSetHeader, FieldPacket[]] = await db.execute(
      `UPDATE ${tableName} SET name = ? ,slug = ?, additional = ?, parent = ?, label = ? WHERE uuid = ?`,
      [name, slug, additional, parent, label , uuid]
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

    const [result]: [ResultSetHeader, FieldPacket[]] = await db.execute(
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
