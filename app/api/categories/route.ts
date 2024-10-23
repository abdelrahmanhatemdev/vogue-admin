import { NextResponse } from "next/server";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/firebase.config";

interface ResponseData {
  message: string;
}

// export  function GET() {

//   return NextResponse.json("Categories GET Here")
// }

export async function POST(request: Request) {
  const data = await request.json();

  try {
    const docRef = await addDoc(collection(db, "categories"), data);
    if (docRef?.id) {
      return NextResponse.json({ message: "Category Added" }, { status: 200 });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something Wrong"
    return NextResponse.json({ error: message}, { status: 500 });
  }
}
