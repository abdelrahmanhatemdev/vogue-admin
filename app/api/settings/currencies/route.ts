import { currencySchema } from "@/lib/validation/settings/currencySchema";
import { NextResponse } from "next/server";
import { adminDB } from "@/database/firebase-admin";
// import redis from "@/lib/redis";
import { isProtected } from "@/lib/api/isProtected";
import { getAllActive } from "@/lib/api/getAllActive";
import { softDelete } from "@/lib/api/softDelete";

export const collectionName = "currencies";
export const collectionRef = adminDB.collection(collectionName);

export async function GET() {
  return await getAllActive({ collectionRef });
}

export async function POST(request: Request) {
  try {
    const { uuid, code } = await request.json();

    await currencySchema.parseAsync({ uuid, code });

    const date = new Date().toISOString();

    const data = {
      uuid,
      code,
      isActive: true,
      isProtected: false,
      createdAt: date,
      updatedAt: date,
    };

    const docRef = await collectionRef.add(data);

    if (docRef.id) {
      return NextResponse.json({ message: "Currency added" }, { status: 200 });
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

    await isProtected({ reqData, collectionRef, modelName: "Currency" });

    const { id, uuid, code } = reqData;

    await currencySchema.parseAsync({ uuid, code });

    const docRef = collectionRef.doc(id);

    if (docRef?.id) {
      await docRef.update({
        code,
        updatedAt: new Date().toISOString(),
      });
      return NextResponse.json(
        { message: "Currency Updated" },
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
  return softDelete({ request, collectionRef, modelName: "Currency" });
}
