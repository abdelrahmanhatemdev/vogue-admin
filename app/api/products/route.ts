import { productSchema } from "@/lib/validation/productSchema";
import { NextResponse } from "next/server";
import { adminDB } from "@/database/firebase-admin";
// import redis from "@/lib/redis";
import { fetchAllActive, softDelete } from "@/lib/api/handlers";

export const collectionName = "products";
export const collectionRef = adminDB.collection(collectionName);

export async function GET() {
    return await fetchAllActive({collectionRef})
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

    await productSchema.parseAsync({
      uuid,
      name,
      slug,
      brandId,
      categories,
      descriptionBrief,
      descriptionDetails,
      trending,
    });

    const q = collectionRef.where("slug", "==", slug);

    const snapShot = await q.get();

    const existed = snapShot.empty
      ? false
      : snapShot.docs.some((doc) => !doc.data().deletedAt);

    if (existed) {
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
      isActive: true,
      isProtected: false,
      createdAt: date,
      updatedAt: date,
    };

    const docRef = await collectionRef.add(data);

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
    const docRef = collectionRef.doc(id);

    if (docRef?.id) {
      await docRef.update({
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

    await productSchema.parseAsync({
      uuid,
      name,
      slug,
      brandId,
      categories,
      descriptionBrief,
      descriptionDetails,
      trending,
    });

    const q = collectionRef.where("slug", "==", slug);
    const snapShot = await q.get();

    const existed = snapShot.empty
      ? false
      : snapShot.docs.some((doc) => doc.id !== id && doc.data().slug === slug);

    if (existed) {
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

    const docRef = collectionRef.doc(id);

    if (docRef?.id) {
      await docRef.update({
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
 return softDelete({request, collectionRef, modelName: "Product", isProduct: true})
}
