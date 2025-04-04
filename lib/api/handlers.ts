import { adminAuth, adminDB } from "@/database/firebase-admin";
import { NextResponse } from "next/server";

export async function fetchAllActive<T extends Record<string, string>>({
  collectionRef,
}: // collectionName,
{
  collectionRef: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>;
  // collectionName: string;
}) {
  try {
    // console.log(`Fetching ${collectionName} from Redis...`);

    // const cachedData = (await redis.get(`${collectionName}`)) as string;
    // if (cachedData) {
    //   console.log("Cache hit:", collectionName);
    //   return NextResponse.json(
    //     { data: JSON.parse(cachedData) },
    //     { status: 200 }
    //   );
    // }

    const snapShot = await collectionRef.where("isActive", "==", true).get();

    const data = snapShot.empty
      ? []
      : snapShot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as T) }));

    // const batch = collectionRef.firestore.batch();

    // data.forEach((item) => {
    //   const docRef = collectionRef.doc(item.id);
    //   batch.update(docRef, { isActive: true });
    // });

    // await batch.commit();

    // console.log(`Saving ${collectionName} to Redis with expiry...`);
    // await redis.set(collectionName, JSON.stringify(data), { ex: 3600 });

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something Wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function isProtected<T extends Record<string, string>>({
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

export async function softDelete<T extends Record<string, string>>({
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
