import { socialMediaSchema } from "@/lib/validation/settings/socialMediaSchema";
import { NextResponse } from "next/server";
import { adminDB } from "@/database/firebase-admin";
// import redis from "@/lib/redis";
import { softDelete, fetchAllActive } from "@/lib/api/handlers";

export const collectionName = "socialMedia";
export const collectionRef = adminDB.collection(collectionName);

export async function GET() {
    return await fetchAllActive({collectionRef})
}

export async function POST(request: Request) {
  try {
    const { uuid, platform, link, followers} = await request.json();

    await socialMediaSchema.parseAsync({ uuid, platform, link, followers});

    const date = new Date().toISOString();

    const data = {
      uuid,
      platform, link, followers,
      isActive: true,
      isProtected: false,
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

    await socialMediaSchema.parseAsync({ uuid, platform, link, followers});

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
  return softDelete({request, collectionRef, modelName: "Social Media"})
}
