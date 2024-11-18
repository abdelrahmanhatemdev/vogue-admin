import { NextResponse } from "next/server";
import { doc, getDoc } from "firebase/firestore";
import { dataCollection, collectoinName } from "../../route";
import { getProducts } from "@/actions/Product";
import { db } from "@/firebase/firebaseClient.config";

export const dynamic = "force-static";

export async function GET(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;

  const { id } = params;

  try {
    const docRef = doc(db, collectoinName, id)
    const docSnap = await getDoc(docRef);
    

    if (docSnap.exists()) {
      const {
        name,
        slug,
        brand,
        categories,
        descriptionBrief,
        descriptionDetails,
        createdAt,
        updatedAt,
        subproducts
      } = docSnap.data();
      const data: Product = {
        id: docSnap.id,
        name,
        slug,
        brand,
        categories,
        descriptionBrief,
        descriptionDetails,
        createdAt,
        updatedAt,
        subproducts
      };
      return NextResponse.json({ data }, { status: 200 });
    }

    throw new Error("No Data Found!");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something Wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function generateStaticParams() {
  const list: Product[] = await getProducts();

  return list.map(({ slug }: { slug: string }) => ({ slug }));
}
