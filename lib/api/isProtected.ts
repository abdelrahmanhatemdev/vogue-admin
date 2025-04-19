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


