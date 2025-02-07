import { AdminAddSchema, AdminEditSchema } from "@/lib/validation/adminSchema";
import { NextResponse } from "next/server";

import { db } from "@/database/firebase";
import { adminAuth } from "@/database/firebase-admin";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";

export const collectionName = "admins";
export const collectionRef = collection(db, collectionName);

export async function GET() {
  try {
    const snapShot = (await getDocs(collectionRef)).docs;

    const data =
      snapShot.length > 0
        ? (
            snapShot.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            })) as Admin[]
          ).filter((doc) => !doc.deletedAt)
        : [];

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something Wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { uuid, name, email, password } = await request.json();

    await AdminAddSchema.parseAsync({ uuid, name, email, password });

    const user = await adminAuth.createUser({
      email,
      password,
      emailVerified: true,
      disabled: false,
      displayName: name
    });

    await adminAuth.setCustomUserClaims(user.uid, { admin: true});

    if (user.uid) {
      const date = new Date().toISOString();

      const data = {
        uuid,
        uid: user.uid,
        name,
        email,
        createdAt: date,
        updatedAt: date,
      };

      await addDoc(collectionRef, data);

      return NextResponse.json({ message: "Admin added" }, { status: 200 });
    }

    return new Error("Something Wrong");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something Wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, uuid, uid, name, email, password } = await request.json();

    await AdminEditSchema.parseAsync({ uuid, name, email, password });

    await adminAuth.updateUser(uid, { email, password, displayName: name });

    const docRef = doc(db, collectionName, id);

    if (docRef?.id) {
      await updateDoc(docRef, {
        name,
        email,
        updatedAt: new Date().toISOString(),
      });
      return NextResponse.json({ message: "Admin Updated" }, { status: 200 });
    }
    return new Error("Something Wrong");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something Wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id, uid } = await request.json();

    const docRef = doc(db, collectionName, id);

    const data = { deletedAt: new Date().toISOString() };

    await updateDoc(docRef, data);

    await adminAuth.deleteUser(uid);
    
    return NextResponse.json(
      { message: "Admin Deleted" },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something Wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
