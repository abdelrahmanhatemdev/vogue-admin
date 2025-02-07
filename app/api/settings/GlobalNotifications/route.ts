import { GlobalNotificationSchema } from "@/lib/validation/settings/globalNotificationSchema";
import { NextResponse } from "next/server";
import { adminDB } from "@/database/firebase-admin";

export const collectionName = "globalNotifications";
export const collectionRef = adminDB.collection(collectionName);

export async function GET() {
  try {
    const snapShot = await collectionRef.get();

    const data = snapShot.empty
      ? []
      : snapShot.docs
          .map((doc) => ({
              id: doc.id,
              ...doc.data(),
            } as GlobalNotification))
          .filter((doc) => !doc.deletedAt)

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something Wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { uuid, text, anchorText, anchorLink} = await request.json();

    await GlobalNotificationSchema.parseAsync({ uuid, text, anchorText, anchorLink});

    const date = new Date().toISOString();

    const data = {
      uuid,
      text, anchorText, anchorLink,
      createdAt: date,
      updatedAt: date,
    };

    const docRef = await collectionRef.add(data);

    if (docRef.id) {
      return NextResponse.json({ message: "GlobalNotification added" }, { status: 200 });
    }

    return new Error("Something Wrong");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something Wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, uuid, text, anchorText, anchorLink} = await request.json();

    await GlobalNotificationSchema.parseAsync({ uuid, text, anchorText, anchorLink});

    const docRef = collectionRef.doc(id);

    if (docRef?.id) {
      await docRef.update({
        text, anchorText, anchorLink,
        updatedAt: new Date().toISOString(),
      });
      return NextResponse.json({ message: "GlobalNotification Updated" }, { status: 200 });
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

    const data = { deletedAt: new Date().toISOString() };

    await docRef.update({ deletedAt: new Date().toISOString() });

    return NextResponse.json(
      { message: "GlobalNotification Deleted"},
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something Wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
