import { SubproductSchema } from "@/lib/validation/subproductSchema";
import { NextResponse } from "next/server";

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

export const collectionName = "subproducts";
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
            })) as Subproduct[]
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
    const {
      uuid,
      productId,
      sku,
      currency,
      price,
      discount,
      qty,
      sold,
      featured,
      inStock,
      colors,
      sizes,
    } = await request.json();

    await SubproductSchema.parseAsync({
      uuid,
      productId,
      sku,
      currency,
      price,
      discount,
      qty,
      sold,
      featured,
      inStock,
      colors,
      sizes,
    });

    const q = query(collectionRef, where("sku", "==", sku));
    const snapShot = (await getDocs(q)).docs;
    const existedItems =
      snapShot.length > 0
        ? (
            snapShot.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            })) as Subproduct[]
          ).filter((doc) => !doc.deletedAt)
        : [];

    if (existedItems.length > 0) {
      return NextResponse.json(
        { error: `${sku} sku is already used!` },
        { status: 400 }
      );
    }

    const nonEmptyColors = colors.filter(
      (cat: string) => cat.trim() !== ""
    );

    if (nonEmptyColors.length === 0) {
      throw new Error("Choose at least one Color");
    }

    const nonEmptySizes = sizes.filter(
      (cat: string) => cat.trim() !== ""
    );

    if (nonEmptySizes.length === 0) {
      throw new Error("Choose at least one Size");
    }

    const date = new Date().toISOString();

    const data = {
      uuid,
      productId,
      sku,
      currency,
      price,
      discount,
      qty,
      sold,
      featured,
      inStock,
      colors,
      sizes,
      createdAt: date,
      updatedAt: date,
    };

    const docRef = await addDoc(collectionRef, data);

    if (docRef.id) {
      return NextResponse.json(
        { message: "Subproduct added" },
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

  const reqData = await request.json();

  console.log("reqData", reqData);
  

  if (reqData?.property) {
    const { property, id, value } = reqData;
    const docRef = doc(db, collectionName, id);

    if (docRef?.id) {
      await updateDoc(docRef, {
        [property]: value,
        updatedAt: new Date().toISOString(),
      });

      return NextResponse.json(
        { message: "Subproduct updated" },
        { status: 200 }
      );
    }
  }

  try {
    const {
      id,
      uuid,
      productId,
      sku,
      currency,
      price,
      discount,
      qty,
      sold,
      featured,
      inStock,
      colors,
      sizes,
    } = reqData;

    await SubproductSchema.parseAsync({
      uuid,
      productId,
      sku,
      currency,
      price,
      discount,
      qty,
      sold,
      featured,
      inStock,
      colors,
      sizes,
    });

    const list = (await getDocs(collectionRef)).docs.filter(
      (doc) => doc.id !== id && doc.data().sku === sku
    );

    const existedItems =
      list.length > 0
        ? list.filter((doc) => doc.id === id && doc.data().sku !== sku)
        : [];

    if (existedItems.length > 0) {
      return NextResponse.json(
        { error: `${sku} sku is already used!` },
        { status: 400 }
      );
    }
    const nonEmptyColors = colors.filter(
      (cat: string) => cat.trim() !== ""
    );

    if (nonEmptyColors.length === 0) {
      throw new Error("Choose at least one Color");
    }

    const nonEmptySizes = sizes.filter(
      (cat: string) => cat.trim() !== ""
    );

    if (nonEmptySizes.length === 0) {
      throw new Error("Choose at least one Size");
    }

    const docRef = doc(db, collectionName, id);

    if (docRef?.id) {
      await updateDoc(docRef, {
        sku,
        currency,
        price,
        discount,
        qty,
        sold,
        featured,
        inStock,
        colors,
        sizes,
        updatedAt: new Date().toISOString(),
      });
      return NextResponse.json(
        { message: "Subproduct Updated" },
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
      { message: "Subproduct Deleted", result },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something Wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

