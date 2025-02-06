import { NextRequest, NextResponse } from "next/server";
import { Readable } from "stream";
import { v4 as uuidv4 } from "uuid";
import { Formidable } from "formidable";
import { adminDB, adminStorage } from "@/database/firebase-admin";
import { promises as fs } from "fs";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "@/database/firebase";
import { collection, doc, writeBatch } from "firebase/firestore";

export const collectionName = "images";
export const collectionRef = collection(db, collectionName);

export const config = {
  api: {
    bodyParser: false, // Important for file uploads
  },
};

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files");
    const subproductId = formData.get("subproductId") as string;

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    if (!subproductId) {
      return NextResponse.json({ error: "Missing subp roductId" }, { status: 400 });
    }

    const downloadUrls: string[] = [];

    for (const file of files) {
      if (!(file instanceof File)) continue;

      const fileRef = ref(storage, `uploads/${file.name}`);

      await uploadBytes(fileRef, file);

      const downloadURL = await getDownloadURL(fileRef);

      downloadUrls.push(downloadURL);
    }

    const batch = writeBatch(db);
    const date = new Date().toISOString();

    downloadUrls.forEach((url) => {
      const imageDocRef = doc(collectionRef);
      batch.set(imageDocRef, {
        subproductId,
        url,
        uuid: uuidv4(),
        createdAt: date,
        updatedAt: date,
      });
    });

    await batch.commit();

    return NextResponse.json({ message: "Photos added" }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something Wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

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
