import { NextResponse } from "next/server";
import { collectionRef } from "@/app/api/images/route";

export const dynamic = "force-static";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const subproductId = url.pathname.split("/").pop();
    const imagesLimit = 6;

    const query = collectionRef
      .where("subproductId", "==", subproductId)
      .where("isActive", "==", true)
      .orderBy("updatedAt", "desc")
      .limit(imagesLimit);

    const snapshot = await query.get();

    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ data }, { status: 200 });

  } catch (error) {
    
    const message = error instanceof Error ? error.message : "Something Wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
