import { CategorySchema } from "@/lib/validation/categorySchema";
import { NextResponse } from "next/server";

import { adminDB } from "@/database/firebase-admin"; // Use Firebase Admin SDK
import { addDoc, getDocs, query, updateDoc, where } from "firebase/firestore";

export const collectionName = "categories";
export const collectionRef = adminDB.collection(collectionName); // ✅ Correct Firestore Admin collection reference

export async function GET() {
  try {
    const snapShot = await collectionRef.get();

    const data =
      snapShot.empty
        ? []
        : snapShot.docs
            .map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }))
            .filter((doc) => !doc.deletedAt);

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something Wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { uuid, name, slug, additional, parent, label } =
      await request.json();

    await CategorySchema.parseAsync({
      uuid,
      name,
      slug,
      additional,
      parent,
      label,
    });

    // Check if the slug is already used
    const q = collectionRef.where("slug", "==", slug);
    const snapShot = await q.get();

    if (!snapShot.empty) {
      return NextResponse.json(
        { error: `${slug} slug is already used!` },
        { status: 400 }
      );
    }

    const date = new Date().toISOString();
    const data = { uuid, name, slug, additional, parent, label, createdAt: date, updatedAt: date };

    const docRef = await collectionRef.add(data); // ✅ Correct Firestore Admin SDK usage

    if (docRef.id) {
      return NextResponse.json({ message: "Category added" }, { status: 200 });
    }

    throw new Error("Something Wrong");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something Wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, uuid, name, slug, additional, parent, label } = await request.json();

    await CategorySchema.parseAsync({ uuid, name, slug, additional, parent, label });

    const list = (await collectionRef.get()).docs.filter(
      (doc) => doc.id !== id && doc.data().slug === slug
    );

    if (list.length > 0) {
      return NextResponse.json(
        { error: `${slug} slug is already used!` },
        { status: 400 }
      );
    }

    const docRef = collectionRef.doc(id); // ✅ Correct Firestore Admin SDK usage

    await docRef.update({
      name,
      slug,
      additional,
      parent,
      label,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ message: "Category Updated" }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something Wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();

    const docRef = collectionRef.doc(id); // ✅ Correct Firestore Admin SDK usage

    await docRef.update({ deletedAt: new Date().toISOString() });

    return NextResponse.json({ message: "Category Deleted" }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something Wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
