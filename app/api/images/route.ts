import { NextRequest, NextResponse } from "next/server";
import { Readable } from "stream";
import { v4 as uuidv4 } from "uuid";
import { Formidable } from "formidable";
import { adminDB, adminStorage } from "@/database/firebase-admin";
import { promises as fs } from "fs";

export const config = {
  api: { bodyParser: false }, // Required for file uploads
};

async function parseForm(req: NextRequest) {
  const formData = await req.formData(); // ✅ Correctly parse form data

  const files: any[] = [];
  const fields: Record<string, any> = {};

  for (const [key, value] of formData.entries()) {
    if (value instanceof Blob) {
      // ✅ Convert Blob to a file-like object
      const buffer = Buffer.from(await value.arrayBuffer());
      files.push({
        fieldName: key,
        buffer,
        originalFilename: value.name,
        mimetype: value.type,
      });
    } else {
      fields[key] = value;
    }
  }

  return { fields, files };
}


// export async function POST(req: NextRequest) {
//   try {
//     // ✅ Parse form data
//     const { fields, files } = await parseForm(req);

    
    

//     if (files.length === 0) {
//       return NextResponse.json({ error: "No images uploaded" }, { status: 400 });
//     }

//     const uploadedImages: string[] = [];

//     for (const file of files) {
//       const uniqueFileName = `${uuidv4()}-${file.originalFilename}`;
//       const fileUpload = adminStorage.file(`images/${uniqueFileName}`);

//       console.log("fileUpload",fileUpload );

//       // ✅ Upload file from buffer
//       const uploaded = await fileUpload.save(file.buffer, {
//         metadata: { contentType: file.mimetype },
//         public: true,
//       });

//       console.log("uploaded", uploaded);

//       const publicUrl = `https://storage.googleapis.com/${adminStorage.name}/uploads/${uniqueFileName}`;
//       uploadedImages.push(publicUrl);

//       // ✅ Save metadata in Firestore
//       await adminDB.collection("uploads").add({
//         url: publicUrl,
//         createdAt: new Date(),
//       });
//     }

//     return NextResponse.json({ urls: uploadedImages }, { status: 200 });
//   } catch (error) {
//     const message = error instanceof Error ? error.message : "Something went wrong";
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
