import { NextResponse } from "next/server";
import db from "@/lib/db";
import { ResultSetHeader } from "mysql2";
import { ColorSchema } from "@/lib/validation/colorSchema";

export const tableName = "colors";

export async function GET() {
  try {
    const [rows] = await db.query(
      `SELECT * FROM ${tableName} WHERE deletedAt IS NULL ORDER BY updatedAt DESC`
    );

    const data = rows as Color[];

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something Wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { uuid, name, hex } = await request.json();

    // Ensure Server Validation
    ColorSchema.parseAsync({ uuid, name, hex });

    const [result]: [ResultSetHeader, any] = await db.execute(
      `INSERT INTO ${tableName} (uuid, name, hex) VALUES (?, ?, ?)`,
      [uuid, name, hex]
    );

    if (result.insertId) {
      return NextResponse.json(
        { message: "Color added", result },
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
    const { uuid, name, hex } = await request.json();

    // Ensure Server Validation
    ColorSchema.parseAsync({ uuid, name, hex });
      
    const [result]: [ResultSetHeader, any] = await db.execute(
      `UPDATE ${tableName} SET name = ?, hex = ? WHERE uuid = ?`,
      [name, hex, uuid]
    );

    if (result.affectedRows) {
      return NextResponse.json(
        { message: "Color updated", result },
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
        { message: "Color Deleted", result },
        { status: 200 }
      );
    }
    return new Error("Something Wrong");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something Wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
