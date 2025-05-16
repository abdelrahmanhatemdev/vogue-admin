import { NextResponse } from "next/server";

export async function getAllActive<T extends Record<string, string>>({
  collectionRef,
  limit = 1,
  cursor,
}: {
  collectionRef: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>;
  limit?: number;
  cursor?: string;
}) {
  try {
    let query = collectionRef
      .where("isActive", "==", true)
      .orderBy("updatedAt", "desc")
      .limit(limit);

    if (cursor) {
      const cursorDoc = await collectionRef.doc(cursor).get();
      if (!cursorDoc.exists) {
        return NextResponse.json({ error: "Invalid cursor" }, { status: 400 });
      }
      query = query.startAfter(cursorDoc);
    }

    const snapshot = await query.get();

    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as T),
    }));

    const nextCursor = snapshot.docs.length
      ? snapshot.docs[snapshot.docs.length - 1].id
      : null;

    const countSnapshot = await collectionRef.where("isActive", "==", true).count().get();
    const total = countSnapshot.data().count;

    return NextResponse.json(
      { data, nextCursor, limit, total },
      { status: 200 }
    );
  } catch (error) {
    console.log("error", error);
    const message =
      error instanceof Error ? error.message : "Something went wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
