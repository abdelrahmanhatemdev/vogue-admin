import { NextResponse } from "next/server";
import { getCategories } from "@/actions/Category";
import { adminDB } from "@/database/firebase-admin"; // ✅ Use Firestore Admin SDK
import { collectionName } from "@/app/api/categories/route";

export const dynamic = "force-static";

export async function GET(
  req: Request,
  props: { params: { slug: string } }
) {
  try {
    const { slug } = props.params;

    const snapShot = await adminDB
      .collection(collectionName)
      .where("slug", "==", slug)
      .get();

    const items =
      !snapShot.empty
        ? snapShot.docs
            .map((doc) => ({
              id: doc.id,
              ...doc.data() ,
            } as Category))
            .filter((doc) => !doc.deletedAt)
        : [];

    if (items.length > 0) {
      return NextResponse.json({ data: items[0] }, { status: 200 });
    }

    throw new Error("No Data Found!");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something Wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function generateStaticParams() {
  const list: Category[] = await getCategories();

  return list.map(({ slug }) => ({ slug }));
}
