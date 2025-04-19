import { NextResponse } from "next/server";

export async function getOneActiveByKey<T extends Record<string, any>>({
  collectionRef,
  key = "slug", 
  value,
}: {
  collectionRef: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>;
  key?: "slug" | "sku"
  value: string | undefined;
}) {
  try {

    if (!value) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    const query = collectionRef
      .where("isActive", "==", true)
      .where(key, "==", value);

    const snapshot = await query.get();

    console.log("value", value);
    

    if (snapshot.empty) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const doc = snapshot.docs[0];

    return NextResponse.json(
      {
        data: {
          id: doc.id,
          ...(doc.data() as T),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("error", error);
    const message =
      error instanceof Error ? error.message : "Something went wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
