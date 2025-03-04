import { BrandSchema } from "@/lib/validation/brandSchema";
import { NextResponse } from "next/server";
import { adminDB } from "@/database/firebase-admin";
import { fetchAllActive } from "@/lib/api/fetchData";

export const collectionName = "brands";
export const collectionRef = adminDB.collection(collectionName);

export async function GET() {
  fetchAllActive<Brand>({collectionRef})
}

export async function POST(request: Request) {
  try {
    const { uuid, name, slug } = await request.json();

    await BrandSchema.parseAsync({ uuid, name, slug });

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
    const { id, uuid, name, slug } = await request.json();

    await BrandSchema.parseAsync({ uuid, name, slug });

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
  try {
    const { id } = await request.json();

    const docRef = collectionRef.doc(id);

    await docRef.update({ deletedAt: new Date().toISOString() });

    return NextResponse.json({ message: "Brand Deleted" }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something Wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
