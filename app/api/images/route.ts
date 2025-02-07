import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "@/database/firebase";
import { collection, deleteDoc, doc, updateDoc, writeBatch } from "firebase/firestore";

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
      return NextResponse.json(
        { error: "Missing subp roductId" },
        { status: 400 }
      );
    }

    const downloadUrls: string[] = [];

    for (const file of files) {
      if (!(file instanceof File)) continue;

      const date = new Date().toISOString()

      const fileRef = ref(storage, `uploads/${file.name}-${date}`);

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
        sortOrder: 0,
        uuid: uuidv4(),
        createdAt: date,
        updatedAt: date,
      });
    });

    await batch.commit();

    return NextResponse.json({ data: {message: "Photos added"} }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something Wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const orderArray = await req.json();

    const updatedOrder = orderArray.map(async (id: string, index: number) => {
      const docRef = doc(db, collectionName, id);

      if (docRef?.id) {
        await updateDoc(docRef, {
          sortOrder: index,
          updatedAt: new Date().toISOString(),
        });
      }
    });

    await Promise.all(updatedOrder);

    return NextResponse.json({ message: "Photos are sorted" }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something Wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id, url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "No image URL provided" }, { status: 400 });
    }

    const path = decodeURIComponent(url.split("/o/")[1].split("?")[0]);

    const fileRef = ref(storage, path);

    await deleteObject(fileRef);

    const docRef = doc(db, collectionName, id);

    const result = await deleteDoc(docRef);
  

    return NextResponse.json(
      { message: "Photo Deleted", result },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something Wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
