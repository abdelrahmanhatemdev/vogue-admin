import { NextResponse } from "next/server";
import db from "@/lib/db";
import { FieldPacket, ResultSetHeader } from "mysql2";
import { GlobalNotificationSchema } from "@/lib/validation/settings/GlobalNotificationSchema";

export const tableName = "settings_global_notifications";

export async function GET() {
  try {
    const [rows] = await db.query(
      `SELECT * FROM ${tableName} WHERE deletedAt IS NULL ORDER BY updatedAt DESC`
    );

    const data = rows as GlobalNotification[];

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something Wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { uuid, text, anchorText, anchorLink } = await request.json();

    // Ensure Server Validation
    GlobalNotificationSchema.parseAsync({ uuid, text, anchorText, anchorLink });

    const [result]: [ResultSetHeader, FieldPacket[]] = await db.execute(
      `INSERT INTO ${tableName} (uuid, text, anchorText, anchorLink) VALUES (?, ?, ?, ?)`,
      [uuid, text, anchorText, anchorLink]
    );

    if (result.insertId) {
      return NextResponse.json(
        { message: "Global Notification added", result },
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
    const { uuid, text, anchorText, anchorLink  } = await request.json();

    // Ensure Server Validation
    GlobalNotificationSchema.parseAsync({ uuid, text, anchorText, anchorLink  });
      
    const [result]: [ResultSetHeader, FieldPacket[]] = await db.execute(
      `UPDATE ${tableName} SET text = ?, anchorText = ?, anchorLink = ? WHERE uuid = ?`,
      [ text, anchorText, anchorLink  , uuid]
    );

    if (result.affectedRows) {
      return NextResponse.json(
        { message: "Global Notification updated", result },
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
        { message: "Global Notification Deleted", result },
        { status: 200 }
      );
    }
    return new Error("Something Wrong");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something Wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
