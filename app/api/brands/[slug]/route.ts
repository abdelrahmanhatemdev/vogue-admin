import { NextResponse } from "next/server";
import { getBrands } from "@/actions/Brand";
import { collectionRef } from "@/app/api/brands/route";

export const dynamic = "force-static";

export async function GET(
  req: Request,
  props: { params: Promise<{ slug: string }> }
) {
  try {
    const params = await props.params;

    const { slug } = await params;

    const q = collectionRef.where("slug", "==", slug);
    const snapShot = await q.get();

    const items =
      snapShot.empty
      ? []
      : snapShot.docs
          .map(
            (doc) =>
              ({
              id: doc.id,
              ...doc.data(),
            } as Brand))
          .filter((doc) => !doc.deletedAt)

    if (items.length > 0) {
      const data = items[0];

      if (data) {
        return NextResponse.json({ data }, { status: 200 });
      }
    }

    throw new Error("No Data Found!");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something Wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function generateStaticParams() {
  const list: Brand[] = await getBrands();

  return list.map(({ slug }: { slug: string }) => ({ slug }));
}
