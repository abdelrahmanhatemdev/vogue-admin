import { sizeSchema } from "@/lib/validation/sizeSchema";
import { NextResponse } from "next/server";
import { adminDB } from "@/database/firebase-admin";
// import redis from "@/lib/redis";
import { isProtected } from "@/lib/api/isProtected";
import { getAllActivePaginated } from "@/lib/api/getAllActivePaginated";
import { softDelete } from "@/lib/api/softDelete";

export const collectionName = "sizes";
export const collectionRef = adminDB.collection(collectionName);

export async function GET() {
  return await getAllActivePaginated({ collectionRef });
}

export async function POST(request: Request) {
  try {
    const { uuid, name, symbol, sortOrder } = await request.json();

    await sizeSchema.parseAsync({ uuid, name, symbol, sortOrder });

    const date = new Date().toISOString();

    const data = {
      uuid,
      name,
      symbol,
      sortOrder,
      isActive: true,
      isProtected: false,
      createdAt: date,
      updatedAt: date,
    };

    const docRef = await collectionRef.add(data);

    if (docRef.id) {
      return NextResponse.json({ message: "Size added" }, { status: 200 });
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

    await isProtected({ reqData, collectionRef, modelName: "Size" });

    const { id, uuid, name, symbol, sortOrder } = reqData;

    await sizeSchema.parseAsync({ uuid, name, symbol, sortOrder });

    const docRef = collectionRef.doc(id);

    if (docRef?.id) {
      await docRef.update({
        name,
        symbol,
        sortOrder,
        updatedAt: new Date().toISOString(),
      });
      return NextResponse.json({ message: "Size Updated" }, { status: 200 });
    }
    return new Error("Something Wrong");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something Wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  return softDelete({ request, collectionRef, modelName: "Size" });
}
