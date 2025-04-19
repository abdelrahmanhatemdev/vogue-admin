import { categorySchema } from "@/lib/validation/categorySchema";
import { NextResponse } from "next/server";
import { adminDB } from "@/database/firebase-admin"; // Use Firebase Admin SDK
// import redis from "@/lib/redis";
import { softDelete, fetchAllActive, isProtected } from "@/lib/api/isProtected";

export const collectionName = "categories";
export const collectionRef = adminDB.collection(collectionName);

export async function GET() {
  return await fetchAllActive({ collectionRef});
}

export async function POST(request: Request) {
  try {
    const { uuid, name, slug, additional, parent, label } =
      await request.json();

    await categorySchema.parseAsync({
      uuid,
      name,
      slug,
      additional,
      parent,
      label,
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

    const date = new Date().toISOString();
    const data = {
      uuid,
      name,
      slug,
      additional,
      parent,
      label,
      isActive: true,
      isProtected: false,
      createdAt: date,
      updatedAt: date,
    };

    const docRef = await collectionRef.add(data);

    if (docRef.id) {
      // await redis.del(collectionName);
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
    const reqData = await request.json();

    await isProtected({ reqData, collectionRef, modelName: "Category" });

    if (reqData?.property) {
      const { property, id, value } = reqData;
      const docRef = collectionRef.doc(id);

      if (docRef?.id) {
        await docRef.update({
          [property]: value,
          updatedAt: new Date().toISOString(),
        });

        return NextResponse.json(
          { message: "Category updated" },
          { status: 200 }
        );
      }
    }

    const { id, uuid, name, slug, additional, parent, label } = reqData;

    await categorySchema.parseAsync({
      uuid,
      name,
      slug,
      additional,
      parent,
      label,
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

    const docRef = collectionRef.doc(id);

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
  return softDelete({ request, collectionRef, modelName: "Category" });
}
