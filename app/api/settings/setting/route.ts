import { settingSchema } from "@/lib/validation/settings/settingSchema";
import { NextResponse } from "next/server";
import { adminDB } from "@/database/firebase-admin";
// import redis from "@/lib/redis";
import { fetchAllActive } from "@/lib/api/fetchData";

export const collectionName = "settings";
export const collectionRef = adminDB.collection(collectionName);

export async function GET() {
  return fetchAllActive({collectionRef})
}

export async function POST(request: Request) {
  try {
    const { uuid, key, value} = await request.json();

    await settingSchema.parseAsync({ uuid, key, value});

    const date = new Date().toISOString();

    const data = {
      uuid,
      key, value,
      createdAt: date,
      updatedAt: date,
    };

    const docRef = await collectionRef.add(data);

    if (docRef.id) {
      return NextResponse.json({ message: "Setting added" }, { status: 200 });
    }

    return new Error("Something Wrong");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something Wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, uuid, key, value} = await request.json();

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

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();

    const docRef = collectionRef.doc(id);

    await docRef.update({ deletedAt: new Date().toISOString() });

    return NextResponse.json(
      { message: "Setting Deleted"},
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something Wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
