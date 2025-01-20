import { NextResponse } from "next/server";
import db from "@/lib/db";
import { FieldPacket, ResultSetHeader } from "mysql2";
import { SocialMediaSchema } from "@/lib/validation/settings/SocialMediaSchema";

export const tableName = "settings_social_media";

export async function GET() {
  try {
    const [rows] = await db.query(
      `SELECT * FROM ${tableName} WHERE deletedAt IS NULL ORDER BY updatedAt DESC`
    );

    const data = rows as SocialMedia[];

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something Wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { uuid, link, platform, followers } = await request.json();

    console.log(uuid, link, platform, followers);
    

    // Ensure Server Validation
    SocialMediaSchema.parseAsync({ uuid, link, platform, followers });

    const [result]: [ResultSetHeader, FieldPacket[]] = await db.execute(
      `INSERT INTO ${tableName} (uuid, link, platform, followers) VALUES (?, ?, ?, ?)`,
      [uuid, link, platform, followers]
    );

    if (result.insertId) {
      return NextResponse.json(
        { message: "Social Media added", result },
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
    const { uuid, link, platform, followers  } = await request.json();

    // Ensure Server Validation
    SocialMediaSchema.parseAsync({ uuid, link, platform, followers  });
      
    const [result]: [ResultSetHeader, FieldPacket[]] = await db.execute(
      `UPDATE ${tableName} SET link = ?, platform = ?, followers = ? WHERE uuid = ?`,
      [ link, platform, followers , uuid]
    );

    if (result.affectedRows) {
      return NextResponse.json(
        { message: "Social Media updated", result },
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
        { message: "Social Media Deleted", result },
        { status: 200 }
      );
    }
    return new Error("Something Wrong");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something Wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
