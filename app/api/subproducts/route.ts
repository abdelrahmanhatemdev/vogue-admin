import { subproductSchema } from "@/lib/validation/subproductSchema";
import { NextResponse } from "next/server";
import { adminDB } from "@/database/firebase-admin";
import { softDelete, fetchAllActive, isProtected } from "@/lib/api/isProtected";
// import redis from "@/lib/redis";

export const collectionName = "subproducts";
export const collectionRef = adminDB.collection(collectionName);

export async function GET() {
  return await fetchAllActive({ collectionRef });
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

    await subproductSchema.parseAsync({
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

    const q = collectionRef.where("sku", "==", sku);

    const snapShot = await q.get();

    const existed = snapShot.empty
      ? false
      : snapShot.docs.some((doc) => !doc.data().deletedAt);

    if (existed) {
      return NextResponse.json(
        { error: `${sku} sku is already used!` },
        { status: 400 }
      );
    }

    const nonEmptyColors = colors.filter((cat: string) => cat.trim() !== "");

    if (nonEmptyColors.length === 0) {
      throw new Error("Choose at least one Color");
    }

    const nonEmptySizes = sizes.filter((cat: string) => cat.trim() !== "");

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
      isActive: true,
      isProtected: false,
      createdAt: date,
      updatedAt: date,
    };

    const docRef = await collectionRef.add(data);

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
  try {
    const reqData = await request.json();

    await isProtected({ reqData, collectionRef, modelName: "Subproduct" });

    if (reqData?.property) {
      const { property, id, value } = reqData;
      const docRef = collectionRef.doc(id);

      if (docRef?.id) {
        await docRef.update({
          [property]: value,
          updatedAt: new Date().toISOString(),
        });

        return NextResponse.json(
          { message: "Subproduct updated" },
          { status: 200 }
        );
      }
    }

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

    await subproductSchema.parseAsync({
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

    const q = collectionRef.where("sku", "==", sku);
    const snapShot = await q.get();

    const existed = snapShot.empty
      ? false
      : snapShot.docs.some((doc) => doc.id !== id && doc.data().sku === sku);

    if (existed) {
      return NextResponse.json(
        { error: `${sku} sku is already used!` },
        { status: 400 }
      );
    }

    const nonEmptyColors = colors.filter((cat: string) => cat.trim() !== "");

    if (nonEmptyColors.length === 0) {
      throw new Error("Choose at least one Color");
    }

    const nonEmptySizes = sizes.filter((cat: string) => cat.trim() !== "");

    if (nonEmptySizes.length === 0) {
      throw new Error("Choose at least one Size");
    }

    const docRef = collectionRef.doc(id);

    if (docRef?.id) {
      await docRef.update({
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
  return softDelete({ request, collectionRef, modelName: "Subproduct" });
}
