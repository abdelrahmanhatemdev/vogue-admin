import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { adminDB } from "@/database/firebase-admin";
import { fetchAllActive, softDelete } from "@/lib/api/handlers";

export const collectionName = "images";
export const collectionRef = adminDB.collection(collectionName);

export async function GET() {
  return await fetchAllActive({collectionRef})
}

export async function POST(request: Request) {
  try {
    const { subproductId, urls } = await request.json();

    const date = new Date().toISOString();

    urls.forEach(async (url: string) => {
      const data = {
        subproductId,
        url,
        sortOrder: 0,
        uuid: uuidv4(),
        isActive: true,
        isProtected: false,
        createdAt: date,
        updatedAt: date,
      };
      await collectionRef.add(data); 
    });

    return NextResponse.json({ message: "Photo added" }, { status: 200 });
    
  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Something went wrong",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    
    const orderArray = await request.json();

    const updatedOrder = orderArray.map(async (id: string, index: number) => {
      const docRef = collectionRef.doc(id);

      if (docRef?.id) {
        await docRef.update({
          sortOrder: index,
          updatedAt: new Date().toISOString(),
        });
      }
    });

    await Promise.all(updatedOrder);

    return NextResponse.json({ message: "Photos are sorted" }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something Wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  return softDelete({ request, collectionRef, modelName: "Photo" });
}
