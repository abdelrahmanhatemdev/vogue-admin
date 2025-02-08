import { NextResponse } from "next/server";
import { collectionRef } from "@/app/api/images/route";
import { getSubproducts } from "@/actions/Subproduct";

export const dynamic = "force-static";

export async function GET(
  req: Request,
  props: { params: Promise<{ subproductId: string }> }
) {
  const params = await props.params;

  try {
    const { subproductId } = await params;

    const q = collectionRef.where("subproductId", "==", subproductId);

    const snapShot = await q.get();

    const data = snapShot.empty
      ? []
      : snapShot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
            })
        );

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
