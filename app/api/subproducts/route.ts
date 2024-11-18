import { NextResponse } from "next/server";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "@/firebase/firebaseClient.config";
import { collectoinName } from "../products/route";

export const dataCollection = collection(db, collectoinName);

export const dynamic = "force-static";

export async function GET() {
  try {
    const querySnapshot = await getDocs(dataCollection);

    const data: Subproduct[] = [];

    querySnapshot.forEach((doc) => {
      if (doc?.id) {
        const {
          sku,
          colors,
          sizes,
          price,
          discount,
          qty,
          sold,
          featured,
          inStock,
          createdAt,
          updatedAt,
        } = doc.data();

        data.push({
          id: doc.id,
          sku,
          colors,
          sizes,
          price,
          discount,
          qty,
          sold,
          featured,
          inStock,
          createdAt,
          updatedAt,
        });
      }
    });

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something Wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const data = await request.json();

  try {
    if (data?.productId) {
      const { productId, ...rest } = data;

      const productRef = doc(db, collectoinName, productId);
      const prductDocSnap = await getDoc(productRef);

      if (prductDocSnap.exists()) {

        console.log([...prductDocSnap.data()?.subproducts, { ...rest }]);
        
        await updateDoc(productRef, {
          subproducts: [...prductDocSnap.data()?.subproducts, { ...rest }],
        });

        // console.log("checkUpdate",checkUpdate);

        return NextResponse.json(
          { message: "Subproduct Added" },
          { status: 200 }
        );
      }
    }

    throw new Error("Something Wrong");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something Wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const {
    id,
    sku,
    colors,
    sizes,
    price,
    discount,
    qty,
    sold,
    featured,
    inStock,
    updatedAt,
  } = await request.json();

  try {
    const docRef = doc(db, collectoinName, id);

    if (docRef?.id) {
      await updateDoc(docRef, {
        sku,
        colors,
        sizes,
        price,
        discount,
        qty,
        sold,
        featured,
        inStock,
        updatedAt,
      });
      return NextResponse.json(
        { message: "Subproduct Updated" },
        { status: 200 }
      );
    }

    return new Error("Something Wrong");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something Wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { id } = await request.json();

  try {
    const docRef = doc(db, collectoinName, id);

    if (docRef?.id) {
      await deleteDoc(docRef);
      return NextResponse.json(
        { message: "Subproduct Deleted" },
        { status: 200 }
      );
    }

    return new Error("Something Wrong");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something Wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
