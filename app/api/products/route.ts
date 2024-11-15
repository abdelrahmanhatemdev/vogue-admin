import { NextResponse } from "next/server";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "@/firebase/firebaseClient.config";

export const collectoinName = "products";
export const dataCollection = collection(db, collectoinName);

export const dynamic = "force-static";

export async function GET() {
  try {
    const querySnapshot = await getDocs(dataCollection);

    const data: Product[] = [];

    querySnapshot.forEach((doc) => {
      if (doc?.id) {
        const {
          name,
          slug,
          brand,
          categories,
          descriptionBrief,
          descriptionDetails,
          createdAt,
          updatedAt,
        } = doc.data();
        data.push({
          id: doc.id,
          name,
          slug,
          brand,
          categories,
          descriptionBrief,
          descriptionDetails,
          createdAt,
          updatedAt,
        });
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
      return NextResponse.json({ message: "Product Added" }, { status: 200 });
    }

    return new Error("Something Wrong");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something Wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request) {



"Solid213"
updatedAt
: 
"2024-11-15T16:12:37.473Z"
  const {
    id,
    name,
    slug,
    brand,
    categories,
    descriptionBrief,
    descriptionDetails,
    updatedAt
  } = await request.json();

  try {
    const docRef = doc(db, collectoinName, id);

    if (docRef?.id) {
      await updateDoc(docRef, {
        name,
        slug,
        brand,
        categories,
        descriptionBrief,
        descriptionDetails,
        updatedAt
      });
      return NextResponse.json({ message: "Product Updated" }, { status: 200 });
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
      return NextResponse.json({ message: "Product Deleted" }, { status: 200 });
    }

    return new Error("Something Wrong");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something Wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
