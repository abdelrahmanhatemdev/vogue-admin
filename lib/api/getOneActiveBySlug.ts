import { NextResponse } from "next/server";

export async function getOneActiveBySlug<T extends Record<string, any>>({
  collectionRef,
  slug,
}: {
  collectionRef: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>;
  slug: string;
}) {
  try {
    const query = collectionRef
      .where("isActive", "==", true)
      .where("slug", "==", slug);

    const snapshot = await query.get();

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
