import { NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";
import { ZodError } from "zod";
import { Readable } from "stream";
import { ReadableStream } from "stream/web";

export const tableName = "product_images";

// export async function POST(req: Request) {
//   try {
   
//     const files: string[] = [];

//     if (files.length > 0) {

//       return NextResponse.json({
//         message: `Photo${files.length > 1 ? "s" : ""} uploaded`,
//         status: "200",
//       });
//     }
//     return NextResponse.json({
//       message: `No photos uploaded`,
//       status: "400",
//     });
//   } catch (error) {
//     if (error instanceof ZodError) {
//       return NextResponse.json(
//         { error: error.errors[0].message },
//         { status: 500 }
//       );
//     }
//     const message = error instanceof Error ? error.message : "Something Wrong";
//     return NextResponse.json({ error: message }, { status: 500 });
//   }
// }

// export async function PUT(req: Request) {
//   try {
//     const orderArray = await req.json();

//     const updatedOrder = orderArray.map((orderID: number, index: number) => {
//       db.execute(`UPDATE ${tableName} SET sortOrder=? WHERE id = ?`, [
//         index,
//         orderID,
//       ]);
//     });

//     await Promise.all(updatedOrder);

//     return NextResponse.json({ message: "Photos are sorted" }, { status: 200 });
//   } catch (error) {
//     if (error instanceof ZodError) {
//       return NextResponse.json(
//         { error: error.errors[0].message },
//         { status: 500 }
//       );
//     }
//     const message = error instanceof Error ? error.message : "Something Wrong";
//     return NextResponse.json({ error: message }, { status: 500 });
//   }
// }

// export async function DELETE(request: Request) {
//   try {
//     const { id } = await request.json();

//     const [result]: [ResultSetHeader, FieldPacket[]] = await db.execute(
//       `UPDATE ${tableName} SET deletedAt = CURRENT_TIMESTAMP WHERE id = ?`,
//       [id]
//     );

//     if (result.affectedRows) {
//       return NextResponse.json(
//         { message: "Photo Deleted", result },
//         { status: 200 }
//       );
//     }
//     return new Error("Something Wrong");
//   } catch (error) {
//     const message = error instanceof Error ? error.message : "Something Wrong";
//     return NextResponse.json({ error: message }, { status: 500 });
//   }
// }
