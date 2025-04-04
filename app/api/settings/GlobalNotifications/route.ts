import { globalNotificationSchema } from "@/lib/validation/settings/globalNotificationSchema";
import { NextResponse } from "next/server";
import { adminDB } from "@/database/firebase-admin";
// import redis from "@/lib/redis";
import { softDelete, fetchAllActive, isProtected } from "@/lib/api/handlers";

export const collectionName = "globalNotifications";
export const collectionRef = adminDB.collection(collectionName);

export async function GET() {
  return await fetchAllActive({ collectionRef });
}

export async function POST(request: Request) {
  try {
    const { uuid, text, anchorText, anchorLink } = await request.json();

    await globalNotificationSchema.parseAsync({
      uuid,
      text,
      anchorText,
      anchorLink,
    });

    const date = new Date().toISOString();

    const data = {
      uuid,
      text,
      anchorText,
      anchorLink,
      isActive: true,
      isProtected: false,
      createdAt: date,
      updatedAt: date,
    };

    const docRef = await collectionRef.add(data);

    if (docRef.id) {
      return NextResponse.json(
        { message: "GlobalNotification added" },
        { status: 200 }
      );
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

    const { id, uuid, text, anchorText, anchorLink } = reqData;

    await globalNotificationSchema.parseAsync({
      uuid,
      text,
      anchorText,
      anchorLink,
    });

    const docRef = collectionRef.doc(id);

    if (docRef?.id) {
      await docRef.update({
        text,
        anchorText,
        anchorLink,
        updatedAt: new Date().toISOString(),
      });
      return NextResponse.json(
        { message: "GlobalNotification Updated" },
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
  return softDelete({
    request,
    collectionRef,
    modelName: "Global Notification",
  });
}
