import { colorSchema } from "@/lib/validation/colorSchema";
import { NextResponse } from "next/server";
import { adminDB } from "@/database/firebase-admin";
// import redis from "@/lib/redis";
import { isProtected } from "@/lib/api/isProtected";
import { getAllActive } from "@/lib/api/routes/getAllActive";
import { softDelete } from "@/lib/api/routes/softDelete";

export const collectionName = "colors";
export const collectionRef = adminDB.collection(collectionName);

export async function GET() {
  return await getAllActive({ collectionRef });
}

export async function POST(request: Request) {
  try {
    const { uuid, name, hex } = await request.json();

    await colorSchema.parseAsync({ uuid, name, hex });

    const date = new Date().toISOString();

    const data = {
      uuid,
      name,
      hex,
      isActive: true,
      isProtected: false,
      createdAt: date,
      updatedAt: date,
    };

    const docRef = await collectionRef.add(data);

    if (docRef.id) {
      return NextResponse.json({ message: "Color added" }, { status: 200 });
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

    await isProtected({ reqData, collectionRef, modelName: "Color" });

    const { id, uuid, name, hex } = reqData;

    await colorSchema.parseAsync({ uuid, name, hex });

    const docRef = collectionRef.doc(id);

    if (docRef?.id) {
      await docRef.update({
        name,
        hex,
        updatedAt: new Date().toISOString(),
      });
      return NextResponse.json({ message: "Color Updated" }, { status: 200 });
    }
    return new Error("Something Wrong");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something Wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  return softDelete({ request, collectionRef, modelName: "Color" });
}
