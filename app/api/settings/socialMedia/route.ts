import { SocialMediaSchema } from "@/lib/validation/settings/socialMediaSchema";
import { NextResponse } from "next/server";
import { adminDB } from "@/database/firebase-admin";
import redis from "@/lib/redis";

export const collectionName = "socialMedia";
export const collectionRef = adminDB.collection(collectionName);

export async function GET() {
  try {
    const cached = (await redis.get(collectionName)) as string;

    if (cached) {
      return NextResponse.json({ data: JSON.parse(cached) }, { status: 200 });
    }

    const snapShot = await collectionRef.where("deletedAt", "==", "").get();

    const data = snapShot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    await redis.set(collectionName, JSON.stringify(data), { ex: 60 * 60 * 6 }); // 6 hrs

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something Wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { uuid, platform, link, followers} = await request.json();

    await SocialMediaSchema.parseAsync({ uuid, platform, link, followers});

    const date = new Date().toISOString();

    const data = {
      uuid,
      platform, link, followers,
      createdAt: date,
      updatedAt: date,
    };

    const docRef = await collectionRef.add(data);

    if (docRef.id) {
      return NextResponse.json({ message: "SocialMedia added" }, { status: 200 });
    }

    return new Error("Something Wrong");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something Wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, uuid, platform, link, followers} = await request.json();

    await SocialMediaSchema.parseAsync({ uuid, platform, link, followers});

    const docRef = collectionRef.doc(id);

    if (docRef?.id) {
      await docRef.update({
        platform, link, followers,
        updatedAt: new Date().toISOString(),
      });
      return NextResponse.json({ message: "SocialMedia Updated" }, { status: 200 });
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
      { message: "SocialMedia Deleted"},
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something Wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
