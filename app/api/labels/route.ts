import { labelSchema } from "@/lib/validation/labelSchema";
import { NextResponse } from "next/server";
import { adminDB } from "@/database/firebase-admin";
import { isProtected } from "@/lib/api/isProtected";
import { fetchAllActive } from "@/lib/api/fetchAllActive";
import { softDelete } from "@/lib/api/softDelete";
// // import redis from "@/lib/redis";

export const collectionName = "labels";
export const collectionRef = adminDB.collection(collectionName);

export async function GET() {
    return await fetchAllActive({collectionRef})
}

export async function POST(request: Request) {
  try {
    const { uuid, title, hex } = await request.json();

    await labelSchema.parseAsync({ uuid, title, hex });

    const date = new Date().toISOString();

    const data = {
      uuid,
      title,
      hex,
      isActive: true,
      isProtected: false,
      createdAt: date,
      updatedAt: date,
    };

    const docRef = await collectionRef.add(data);

    if (docRef.id) {
      return NextResponse.json({ message: "Label added" }, { status: 200 });
    }

    return new Error("Something Wrong");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something Wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const reqData = await request.json();
    
    await isProtected({ reqData, collectionRef, modelName: "Label" });

    const { id, uuid, title, hex } = reqData;

    await labelSchema.parseAsync({ uuid, title, hex });

    const docRef = collectionRef.doc(id);

    if (docRef?.id) {
      await docRef.update({
        title,
        hex,
        updatedAt: new Date().toISOString(),
      });
      return NextResponse.json({ message: "Label Updated" }, { status: 200 });
    }
    return new Error("Something Wrong");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something Wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  return softDelete({request, collectionRef, modelName: "Label"})
}
