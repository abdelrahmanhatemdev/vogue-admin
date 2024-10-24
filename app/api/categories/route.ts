import { NextResponse } from "next/server";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "@/firebase.config";

export const dataCollection = collection(db, "categories");

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
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something Wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
