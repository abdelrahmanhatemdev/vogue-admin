import { brandSchema } from "@/lib/validation/brandSchema";
import { NextResponse } from "next/server";
import { adminDB } from "@/database/firebase-admin";
import { isProtected } from "@/lib/api/isProtected";
import { getAllActivePaginated } from "@/lib/api/getAllActivePaginated";
import { softDelete } from "@/lib/api/softDelete";

export const collectionName = "brands";
export const collectionRef = adminDB.collection(collectionName);

export async function GET() {
  return await getAllActivePaginated({ collectionRef });
}

export async function POST(request: Request) {
  try {
    const { uuid, name, slug } = await request.json();

    await brandSchema.parseAsync({ uuid, name, slug });

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
      isActive: true,
      isProtected: false,
      createdAt: date,
      updatedAt: date,
    };

    const docRef = await collectionRef.add(data);

    if (docRef.id) {
      return NextResponse.json({ message: "Brand added" }, { status: 200 });
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

    await isProtected({ reqData, collectionRef, modelName: "Brand" });

    const { id, uuid, name, slug } = reqData;

    await brandSchema.parseAsync({ uuid, name, slug });

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

    if (docRef?.id) {
      await docRef.update({
        name,
        slug,
        updatedAt: new Date().toISOString(),
      });
      return NextResponse.json({ message: "Brand Updated" }, { status: 200 });
    }
    return new Error("Something Wrong");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something Wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  return softDelete({ request, collectionRef, modelName: "Brand" });
}
