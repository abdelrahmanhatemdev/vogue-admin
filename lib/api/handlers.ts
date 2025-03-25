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
    console.log("err", error);

    const message = error instanceof Error ? error.message : "Something Wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function deleteInactive<T extends Record<string, string>>({
  request,
  collectionRef,
  modelName,
}: {
  request: Request;
  collectionRef: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>;
  modelName: string;
}) {
  try {
    const { id } = await request.json();

    const docRef = collectionRef.doc(id);

    const docData = await docRef?.get();

    const isProtected = docData.exists ? docData.data()?.isProtected : true;

    if (isProtected) {
      throw new Error("Admin is Protected");
    }

    await docRef.update({ deletedAt: new Date().toISOString(), isActive: false });

    return NextResponse.json(
      { message: `${modelName} Deleted` },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something Wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
