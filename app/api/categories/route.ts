import { CategorySchema } from "@/lib/validation/categorySchema";
import { NextRequest, NextResponse } from "next/server";

import { db } from "@/database/firebase";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { adminAuth } from "@/database/firebase-admin";

export const collectionName = "categories";
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
            })) as Category[]
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

    const q = query(collectionRef, where("slug", "==", slug));

    const snapShot = (await getDocs(q)).docs;
    const existedItems =
      snapShot.length > 0
        ? (
            snapShot.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            })) as Category[]
          ).filter((doc) => !doc.deletedAt)
        : [];

    if (existedItems.length > 0) {
      return NextResponse.json(
        { error: `${slug} slug is already used!` },
        { status: 400 }
      );
    }
    const date = new Date().toISOString();

    const data = {
      uuid,
      name,
      slug,
      additional,
      parent,
      label,
      createdAt: date,
      updatedAt: date,
    };

    const docRef = await addDoc(collectionRef, data);

    if (docRef.id) {
      return NextResponse.json({ message: "Category added" }, { status: 200 });
    }

    return new Error("Something Wrong");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something Wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, uuid, name, slug, additional, parent, label } =
      await request.json();

    await CategorySchema.parseAsync({
      uuid,
      name,
      slug,
      additional,
      parent,
      label,
    });

    const list = (await getDocs(collectionRef)).docs.filter(
      (doc) => doc.id !== id && doc.data().slug === slug
    );

    const existedItems =
      list.length > 0
        ? list.filter((doc) => doc.id === id && doc.data().slug !== slug)
        : [];
    if (existedItems.length > 0) {
      return NextResponse.json(
        { error: `${slug} slug is already used!` },
        { status: 400 }
      );
    }

    const docRef = doc(db, collectionName, id);

    if (docRef?.id) {
      await updateDoc(docRef, {
        name,
        slug,
        additional,
        parent,
        label,
        updatedAt: new Date().toISOString(),
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
  try {
    const { id } = await request.json();

    const docRef = doc(db, collectionName, id);

    const data = { deletedAt: new Date().toISOString() };

    const result = await updateDoc(docRef, data);

    return NextResponse.json(
      { message: "Category Deleted", result },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something Wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
