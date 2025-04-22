export async function isProtected({
  reqData,
  collectionRef,
  modelName,
  uuidKey = false,
}: {
  reqData: { id: string };
  collectionRef: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>;
  modelName: string;
  uuidKey?: boolean;
}) {
  const { id } = reqData;

  let data;

  if (uuidKey) {
    const querySnap = await collectionRef.where("uuid", "==", id).limit(1).get();
    if (querySnap.empty) {
      throw new Error(`${modelName} not found`);
    }
    data = querySnap.docs[0].data();
  } else {
    const docSnap = await collectionRef.doc(id).get();
    if (!docSnap.exists) {
      throw new Error(`${modelName} not found`);
    }
    data = docSnap.data();
  }

  if (data?.isProtected) {
    throw new Error(`${modelName} is protected`);
  }
}


