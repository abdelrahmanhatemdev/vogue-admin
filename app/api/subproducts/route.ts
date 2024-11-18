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
        await updateDoc(productRef, {
          subproducts: [...prductDocSnap.data()?.subproducts, { ...rest }],
        });

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
  const data = await request.json();

  try {
    if (data?.productId) {
      const { productId, ...rest } = data;

      const productRef = doc(db, collectoinName, productId);
      const prductDocSnap = await getDoc(productRef);

      if (prductDocSnap.exists()) {
        const oldSubproducts = prductDocSnap.data()?.subproducts;

        const newSubproducts = [
          ...oldSubproducts.filter((sub: Subproduct) => sub.id !== rest.id),
          {...rest}
        ];

        console.log("newSubproducts", newSubproducts);
        

        await updateDoc(productRef, {
          subproducts: newSubproducts,
        });

        return NextResponse.json(
          { message: "Subproduct Updated" },
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

export async function DELETE(request: Request) {
  const data = await request.json();

  try {
    if (data?.productId) {
      const { productId, id } = data;

      const productRef = doc(db, collectoinName, productId);
      const prductDocSnap = await getDoc(productRef);

      if (prductDocSnap.exists()) {
        const oldSubproducts = prductDocSnap.data()?.subproducts;

        const newSubproducts = [
          ...oldSubproducts.filter((sub: Subproduct) => sub.id !== id),
        ];

        await updateDoc(productRef, {
          subproducts: newSubproducts,
        });

        return NextResponse.json(
          { message: "Subproduct Deleted" },
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
