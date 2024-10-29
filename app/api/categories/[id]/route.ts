import { NextResponse } from "next/server";
import { getDoc, doc } from "firebase/firestore";
import { collectoinName } from "../route";
import { db } from "@/firebase.config";
import { getCategories } from "@/actions/Category";

export async function GET(
  req: Request,
  { params: { id } }: { params: { id: string } }
) {
  try {
    const docRef = doc(db, collectoinName, id);
    const querySnapshot = await getDoc(docRef);
    const docData = querySnapshot.data();
    const data = { id: id, ...docData };
    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something Wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function generateStaticParams() {
  const list: Category[] = await getCategories();

  return list.map(({ id }: { id: string }) => ({id}));
}
