import { ProductSchema } from "@/lib/validation/productSchema";
import { NextResponse } from "next/server";
import { adminDB } from "@/database/firebase-admin";
import redis from "@/lib/redis";
import { fetchAllActive } from "@/lib/api/fetchData";

export const collectionName = "products";
export const collectionRef = adminDB.collection(collectionName);

export async function GET() {
  console.log("Get Productttt");

  try {
    const snapShot = await collectionRef.get();

    const data = snapShot.empty
      ? []
      : snapShot.docs
          .map(
            (doc) =>
              ({
                id: doc.id,
                ...doc.data(),
              } as Product)
          )
          .filter((doc) => !doc.deletedAt || doc.deletedAt === "");

          console.log("route data", data);
          

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something Wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
  
  // return fetchAllActive({collectionRef})
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
  try {
    const { id } = await request.json();

    const productDoc = await adminDB.collection("products").doc(id).get();

    if (!productDoc.exists) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const productData = productDoc.data() as Product;
    const productUUID = productData.uuid;

    const subproductsSnap = await adminDB
      .collection("subproducts")
      .where("productId", "==", productUUID)
      .get();

    const deletedAt = new Date().toISOString();
    const batch = adminDB.batch();

    subproductsSnap.forEach((subproductDoc) => {
      batch.update(subproductDoc.ref, { deletedAt });
    });

    batch.update(adminDB.collection("products").doc(id), { deletedAt });

    await batch.commit();

    return NextResponse.json(
      { message: "Product and related subproducts are deleted" },
      { status: 200 }
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Something went wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
