import { AdminAddSchema, AdminEditSchema } from "@/lib/validation/adminSchema";
import { NextResponse } from "next/server";

import { auth, db } from "@/database/firebase";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";

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

    await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const date = new Date().toISOString();

    const data = {
      uuid,
      name,
      email,
      createdAt: date,
      updatedAt: date,
    };

    const docRef = await addDoc(collectionRef, data);

    if (docRef.id) {
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
    const { id, uuid, name, email, password } = await request.json();

    await AdminEditSchema.parseAsync({ uuid, name, email, password });

    const docRef = doc(db, collectionName, id);

    if (docRef?.id) {
      await updateDoc(docRef, {
        name,
        email,
        password,
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
    const { id } = await request.json();

    const docRef = doc(db, collectionName, id);

    const data = { deletedAt: new Date().toISOString() };

    const result = await updateDoc(docRef, data);

    return NextResponse.json(
      { message: "Admin Deleted", result },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something Wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
