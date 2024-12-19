import { NextResponse } from "next/server";
import db from "@/lib/db";
import { FieldPacket, ResultSetHeader } from "mysql2";
import { SubproductPhotosSchema } from "@/lib/validation/subproductPhotosSchema";
import path from "path";
import { promises as fs } from "fs";
import { ZodError } from "zod";
import { Readable } from "stream";
import { ReadableStream } from "stream/web";
import { revalidateTag } from "next/cache";

export const tableName = "product_images";
const tag = "productImages";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: Request) {
  try {
    if (!req.body) {
      return NextResponse.json(
        { success: false, message: "No request body found" },
        { status: 400 }
      );
    }

    const contentType = req.headers.get("content-type") || "";
    const boundary = contentType.split("boundary=")?.[1];
    if (!boundary) {
      return NextResponse.json(
        { success: false, message: "Missing form-data boundary" },
        { status: 400 }
      );
    }

    const readable = Readable.fromWeb(req.body as ReadableStream);

    const chunks: Uint8Array[] = [];
    for await (const chunk of readable) {
      chunks.push(chunk);
    }

    const data = Buffer.concat(chunks).toString("binary");

    const parts = data.split(`--${boundary}`);
    let productId = "";
    const files: string[] = [];

    for (const part of parts) {
      if (part.includes('Content-Disposition: form-data; name="productId"')) {
        const valueStart = part.indexOf("\r\n\r\n") + 4;
        const valueEnd = part.lastIndexOf("\r\n");
        productId = part.substring(valueStart, valueEnd).trim();
      } else if (
        part.includes("Content-Disposition: form-data;") &&
        part.includes("filename=")
      ) {
        // Extract file data
        const filenameMatch = part.match(/filename="(.+?)"/);
        const filename = filenameMatch?.[1];
        if (!filename) continue;

        const fileStart = part.indexOf("\r\n\r\n") + 4;
        const fileEnd = part.lastIndexOf("\r\n");
        const fileBuffer = Buffer.from(
          part.substring(fileStart, fileEnd),
          "binary"
        );

        if (!productId) {
          return NextResponse.json(
            { success: false, message: "Missing product ID in form-data" },
            { status: 400 }
          );
        }

        // Ensure directory exists
        const uploadDir = path.join(
          process.cwd(),
          `uploads/images/${productId}`
        );
        await fs.mkdir(uploadDir, { recursive: true });

        // Save the file
        const filePath = path.join(uploadDir, filename);

        await fs.writeFile(filePath, fileBuffer);
        const [result]: [ResultSetHeader, FieldPacket[]] = await db.execute(
          `INSERT INTO ${tableName} (subproduct_id, src, sort_order) VALUES (?, ?, ?)`,
          [productId, `/uploads/images/${productId}/${filename}`, 0]
        );

        if (result.insertId) {
          files.push(`/uploads/images/${productId}/${filename}`);
        }
      }
    }

    if (files.length > 0) {
      console.log("files", files);

      revalidateTag(tag);
      return NextResponse.json({ message: "Files uploaded" }, { status: 200 });
    }
    return NextResponse.json(
      { success: false, message: "No files uploaded" },
      { status: 400 }
    );
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

export async function PUT(req: Request) {
  try {
    const orderArray = await req.json();

    const updatedOrder = orderArray.map((order: number, index: number) => {
      db.execute(`UPDATE ${tableName} SET sort_order=? WHERE id = ?`, [
        index,
        order,
      ]);
    });

    await Promise.all(updatedOrder);

    return NextResponse.json({ message: "Images are sorted" }, { status: 200 });
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
    const { id } = await request.json();

    const [result]: [ResultSetHeader, FieldPacket[]] = await db.execute(
      `UPDATE ${tableName} SET deletedAt = CURRENT_TIMESTAMP WHERE id = ?`,
      [id]
    );

    if (result.affectedRows) {
      return NextResponse.json(
        { message: "Image Deleted", result },
        { status: 200 }
      );
    }
    return new Error("Something Wrong");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something Wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
