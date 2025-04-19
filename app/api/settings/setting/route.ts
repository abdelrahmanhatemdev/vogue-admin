import { settingSchema } from "@/lib/validation/settings/settingSchema";
import { NextResponse } from "next/server";
import { adminDB } from "@/database/firebase-admin";
// import redis from "@/lib/redis";
import { isProtected } from "@/lib/api/isProtected";
import { fetchAllActive } from "@/lib/api/fetchAllActive";

export const collectionName = "settings";
export const collectionRef = adminDB.collection(collectionName);

export async function GET() {
    return await fetchAllActive({collectionRef})
}

export async function PUT(request: Request) {
  try {
    const reqData = await request.json();
    
    await isProtected({ reqData, collectionRef, modelName: "Setting item" });

    const { id, uuid, key, value} = reqData;

    await settingSchema.parseAsync({ uuid, key, value});

    const docRef = collectionRef.doc(id);

    if (docRef?.id) {
      await docRef.update({
        key, value,
        updatedAt: new Date().toISOString(),
      });
      return NextResponse.json({ message: "Setting Updated" }, { status: 200 });
    }
    return new Error("Something Wrong");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something Wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

