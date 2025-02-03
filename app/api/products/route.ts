import { ProductSchema } from "@/lib/validation/productSchema";
import { NextResponse } from "next/server";

import { db } from "@/database/firebase";
import {
  doc,
  getDocs,
  query,
  where,
  updateDoc,
  collection,
  writeBatch,
  getDoc,
} from "firebase/firestore";

import { collectionName as spCollectionName, collectionRef as spCollectionRef } from "@/app/api/subproducts/route";

export const collectionName = "products";
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
            })) as Product[]
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
      name,
      slug,
      brandId,
      categories,
      descriptionBrief,
      descriptionDetails,
      trending,
    } = await request.json();

    await ProductSchema.parseAsync({
      uuid,
      name,
      slug,
      brandId,
      categories,
      descriptionBrief,
      descriptionDetails,
      trending,
    });

    const q = query(collectionRef, where("slug", "==", slug));

    const snapShot = (await getDocs(q)).docs;
    const existedItems =
      snapShot.length > 0
        ? (
            snapShot.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            })) as Product[]
          ).filter((doc) => !doc.deletedAt)
        : [];

    if (existedItems.length > 0) {
      return NextResponse.json(
        { error: `${slug} slug is already used!` },
        { status: 400 }
      );
    }

    const nonEmptyCategories = categories.filter(
      (cat: string) => cat.trim() !== ""
    );

    if (nonEmptyCategories.length === 0) {
      throw new Error("Choose at least one Category");
    }

    const date = new Date().toISOString();

    const data = {
      uuid,
      name,
      slug,
      brandId,
      categories,
      descriptionBrief,
      descriptionDetails,
      trending,
      createdAt: date,
      updatedAt: date,
    };

    const docRef = await addDoc(collectionRef, data);

    if (docRef.id) {
      return NextResponse.json({ message: "Product added" }, { status: 200 });
    }

    return new Error("Something Wrong");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something Wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const reqData = await request.json();

  if (reqData?.property) {
    const { property, id, value } = reqData;
    const docRef = doc(db, collectionName, id);

    if (docRef?.id) {
      await updateDoc(docRef, {
        [property]: value,
        updatedAt: new Date().toISOString(),
      });

      return NextResponse.json({ message: "Product updated" }, { status: 200 });
    }
  }

  try {
    const {
      id,
      uuid,
      name,
      slug,
      brandId,
      categories,
      descriptionBrief,
      descriptionDetails,
      trending,
    } = reqData;

    await ProductSchema.parseAsync({
      uuid,
      name,
      slug,
      brandId,
      categories,
      descriptionBrief,
      descriptionDetails,
      trending,
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
    const nonEmptyCategories = categories.filter(
      (cat: string) => cat.trim() !== ""
    );

    if (nonEmptyCategories.length === 0) {
      throw new Error("Choose at least one Category");
    }

    const docRef = doc(db, collectionName, id);

    if (docRef?.id) {
      await updateDoc(docRef, {
        name,
        slug,
        brandId,
        categories,
        descriptionBrief,
        descriptionDetails,
        trending,
        updatedAt: new Date().toISOString(),
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
  try {
    const { id } = await request.json();

    // Fetch the product document
    const productDoc = doc(db, "products", id);
    const productSnap = await getDoc(productDoc);

    if (!productSnap.exists()) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const productData = productSnap.data() as Product;
    const productUUID = productData.uuid; // Get UUID since subproducts use it as productId

    const subproductsQuery = query(collection(db, spCollectionName), where("productId", "==", productUUID));
    const subproductsSnap = await getDocs(subproductsQuery);

    const batch = writeBatch(db);
    const deletedAt = new Date().toISOString();

    subproductsSnap.forEach((subproductDoc) => {
      batch.update(subproductDoc.ref, { deletedAt });
    });

    batch.update(productDoc, { deletedAt });

    await batch.commit();

    return NextResponse.json(
      { message: "Product and related subproducts are deleted" },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something went wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
