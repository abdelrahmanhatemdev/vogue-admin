import { NextResponse } from "next/server";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  getDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "@/firebase.config";

export const collectoinName = "categories";
export const dataCollection = collection(db, collectoinName);

export async function GET() {
  try {
    const querySnapshot = await getDocs(dataCollection);

    let data: Category[] = [];

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
      return NextResponse.json({ message: "Category Added" }, { status: 200 });
    }

    return new Error("Something Wrong");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something Wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const { id, name } = await request.json();
  console.log(id);

  try {
    const docRef = doc(db, collectoinName, id);

    if (docRef?.id) {
      const date = new Date().toISOString();
      await updateDoc(docRef, {
        name,
        updatedAt: date,
      });
      return NextResponse.json(
        { message: "Category Updated" },
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
  console.log(id);

  try {
    const docRef = doc(db, collectoinName, id);

    if (docRef?.id) {
      await deleteDoc(docRef);
      return NextResponse.json(
        { message: "Category Deleted" },
        { status: 200 }
      );
    }

    return new Error("Something Wrong");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something Wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
  
  return NextResponse.json({ message: "Hello" }, { status: 200 });
}