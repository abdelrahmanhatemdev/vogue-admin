import { NextResponse } from "next/server";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "@/firebase/firebase.config";

export const collectoinName = "brands";
export const dataCollection = collection(db, collectoinName);

export const dynamic = 'force-static'

export async function GET() {
  try {
    const querySnapshot = await getDocs(dataCollection);

    const data: Brand[] = [];

    querySnapshot.forEach((doc) => {
      if (doc?.id) {
        const { name, createdAt, updatedAt } = doc.data();
        data.push({ id: doc.id, name, createdAt, updatedAt });
      }
    });

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something Wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const data = await request.json();

  try {
    const docRef = await addDoc(dataCollection, data);
    if (docRef?.id) {
      return NextResponse.json({ message: "Brand Added" }, { status: 200 });
    }

    return new Error("Something Wrong");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something Wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const { id, name } = await request.json();

  try {
    const docRef = doc(db, collectoinName, id);

    if (docRef?.id) {
      const date = new Date().toISOString();
      await updateDoc(docRef, {
        name,
        updatedAt: date,
      });
      return NextResponse.json(
        { message: "Brand Updated" },
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
  const { id } = await request.json();

  try {
    const docRef = doc(db, collectoinName, id);

    if (docRef?.id) {
      await deleteDoc(docRef);
      return NextResponse.json(
        { message: "Brand Deleted" },
        { status: 200 }
      );
    }

    return new Error("Something Wrong");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something Wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}