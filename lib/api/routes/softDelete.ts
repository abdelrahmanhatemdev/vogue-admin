import { adminAuth, adminDB } from "@/database/firebase-admin";
import { NextResponse } from "next/server";

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
