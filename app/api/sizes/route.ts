import { NextResponse } from "next/server";
import db from "@/lib/db";
import { FieldPacket, ResultSetHeader } from "mysql2";
import { SizeSchema } from "@/lib/validation/sizeSchema";

export const tableName = "sizes";

export async function GET() {
  try {
    const [rows] = await db.query(
      `SELECT * FROM ${tableName} WHERE deletedAt IS NULL ORDER BY sort_order DESC`
    );

    const data = rows as Size[];

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something Wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { uuid, name, symbol, sort_order } = await request.json();

    // Ensure Server Validation
    SizeSchema.parseAsync({ name, uuid, symbol, sort_order });

    const [result]: [ResultSetHeader, FieldPacket[]] = await db.execute(
      `INSERT INTO ${tableName} (uuid, name, symbol, sort_order) VALUES (?, ?, ?, ?)`,
      [uuid, name, symbol, sort_order]
    );

    if (result.insertId) {
      return NextResponse.json(
        { message: "Size added", result },
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
    const { uuid, name, symbol, sort_order } = await request.json();

    // Ensure Server Validation
    SizeSchema.parseAsync({ name, uuid, symbol, sort_order });

    const [result]: [ResultSetHeader, FieldPacket[]] = await db.execute(
      `UPDATE ${tableName} SET name = ?, symbol = ?, sort_order = ? WHERE uuid = ?`,
      [name, , symbol, sort_order, uuid]
    );

    if (result.affectedRows) {
      return NextResponse.json(
        { message: "Size updated", result },
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
        { message: "Size Deleted", result },
        { status: 200 }
      );
    }
    return new Error("Something Wrong");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something Wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
