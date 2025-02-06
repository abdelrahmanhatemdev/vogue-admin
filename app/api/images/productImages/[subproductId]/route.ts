import { NextResponse } from "next/server";
import { collectionRef } from "@/app/api/images/route";
import { getDocs, query, where } from "firebase/firestore";
import { getSubproducts } from "@/actions/Subproduct";

export const dynamic = "force-static";

export async function GET(
  req: Request,
  props: { params: Promise<{ subproductId: string }> }
) {
  const params = await props.params;

  try {
    const { subproductId } = await params;

    const q = query(collectionRef, where("subproductId", "==", subproductId));

    const snapShot = (await getDocs(q)).docs;

    const data =
      snapShot.length > 0
        ? (
            snapShot.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            })) as Brand[]
          ).filter((doc) => !doc.deletedAt)
        : [];

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something Wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function generateStaticParams() {
  const list: Subproduct[] = await getSubproducts();
  return list.map(({ uuid }: { uuid: string }) => ({ uuid }));
}
