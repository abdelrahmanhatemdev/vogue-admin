import { adminAuth, adminDB } from "@/database/firebase-admin";
import { NextResponse } from "next/server";

export async function fetchAllActive<T extends Record<string, string>>({
  collectionRef,
  limit = 10,
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

    return NextResponse.json(
      { data, nextCursor, limit },
      { status: 200 }
    );
  } catch (error) {
    console.log("error", error );
    const message = error instanceof Error ? error.message : "Something went wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


export async function isProtected({
  reqData,
  collectionRef,
  modelName,
}: {
  reqData: { id: string };
  collectionRef: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>;
  modelName: string;
}) {
  const { id } = reqData;

  const docRef = collectionRef.doc(id);
  const docSnap = await docRef.get();

  if (!docSnap.exists) {
    throw new Error(`${modelName} not found`);
  }

  if (docSnap.data()?.isProtected) {
    throw new Error(`${modelName} is protected`);
  }
}

export async function softDelete({
  request,
  collectionRef,
  modelName,
  isAdmin,
  isProduct,
}: {
  request: Request;
  collectionRef: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>;
  modelName: string;
  isAdmin?: boolean;
  isProduct?: boolean;
}) {
  try {
    const params = await request.json();

    const { id } = params;

    const docRef = collectionRef.doc(id);

    const docData = await docRef?.get();

    const isProtected = docData.exists ? docData.data()?.isProtected : true;

    if (isProtected) {
      throw new Error(`${modelName} is Protected`);
    }

    let message = `${modelName} Deleted`;

    const deletedAt = new Date().toISOString();

    if (isAdmin) {
      const { uid } = params;
      await adminAuth.deleteUser(uid);
    }

    if (isProduct) {
      const { uuid } = params;
      const subproductsSnap = await adminDB
        .collection("subproducts")
        .where("productId", "==", uuid)
        .get();

      const batch = adminDB.batch();

      const data = { deletedAt, isActive: false };

      subproductsSnap.forEach((subproductDoc) => {
        batch.update(subproductDoc.ref, data);
      });

      batch.update(adminDB.collection("products").doc(id), data);

      await batch.commit();
      message = "Product and related subproducts are deleted";
    }

    if (!isProduct) {
      await docRef.update({
        deletedAt,
        isActive: false,
      });
    }

    return NextResponse.json({ message }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something Wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
