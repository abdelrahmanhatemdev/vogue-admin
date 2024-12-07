import { NextResponse } from "next/server";
import db from "@/lib/db";
import { FieldPacket, ResultSetHeader } from "mysql2";
import { AdminAddSchema, AdminEditSchema } from "@/lib/validation/adminSchema";
import bcrypt from "bcrypt";

export const tableName = "admins";

export async function GET() {
  try {
    const [rows] = await db.query(
      `SELECT * FROM ${tableName} WHERE deletedAt IS NULL ORDER BY updatedAt DESC`
    );

    const data = rows as Admin[];

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something Wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { uuid, name, email, password } = await request.json();

    // Ensure Server Validation
    AdminAddSchema.parseAsync({ name, uuid, email, password });

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result]: [ResultSetHeader, FieldPacket[] ] = await db.execute(
      `INSERT INTO ${tableName} (uuid, name, email, password) VALUES (?, ?, ?, ?)`,
      [uuid, name, email, hashedPassword]
    );

    if (result.insertId) {
      return NextResponse.json(
        { message: "Admin added", result },
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
    const { uuid, name, email, password } = await request.json();

    // Ensure Server Validation
    AdminEditSchema.parseAsync({ name, uuid, email, password });

    console.log("password", password);

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);

      await db.execute(
        `UPDATE ${tableName} SET password=? WHERE uuid = ?`,
        [hashedPassword, uuid]
      );
    }

    const [result]: [ResultSetHeader, FieldPacket[]] = await db.execute(
      `UPDATE ${tableName} SET name = ?, email=? WHERE uuid = ?`,
      [name, email, uuid]
    );

    if (result.affectedRows) {
      return NextResponse.json(
        { message: "Admin updated", result },
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
        { message: "Admin Deleted", result },
        { status: 200 }
      );
    }
    return new Error("Something Wrong");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something Wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
