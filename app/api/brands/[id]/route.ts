import { NextResponse } from "next/server";
import { getDoc, doc } from "firebase/firestore";
import { collectoinName } from "../route";
import { db } from "@/firebase.config";
import { getCategories } from "@/actions/Brand";

export const dynamic = 'force-static'

export async function GET(req: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  const {
    id
  } = params;

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
  const list: Brand[] = await getCategories();

  return list.map(({ id }: { id: string }) => ({id}));
}
