// import { NextResponse } from "next/server";
// import { getDoc, doc } from "firebase/firestore";
// import { collectoinName } from "@/app/api/subproducts/route";
// import { getSubproducts } from "@/actions/Subproduct";
// import { db } from "@/firebase/firebaseClient.config";

// export const dynamic = "force-static";

// export async function GET(
//   req: Request,
//   props: { params: Promise<{ id: string }> }
// ) {
//   const params = await props.params;

//   const { id } = params;

//   try {
//     const docRef = doc(db, collectoinName, id);
//     const docSnap = await getDoc(docRef);

//     if (docSnap.exists()) {
//       const {
//         sku,
//         colors,
//         sizes,
//         price,
//         discount,
//         qty,
//         sold,
//         featured,
//         inStock,
//         createdAt,
//         updatedAt,
//       } = docSnap.data();
//       const data: Subproduct = {
//         id: docSnap.id,
//         sku,
//         colors,
//         sizes,
//         price,
//         discount,
//         qty,
//         sold,
//         featured,
//         inStock,
//         createdAt,
//         updatedAt,
//       };
//       return NextResponse.json({ data }, { status: 200 });
//     }

//     throw new Error("No Data Found!");
//   } catch (error) {
//     const message = error instanceof Error ? error.message : "Something Wrong";
//     return NextResponse.json({ error: message }, { status: 500 });
//   }
// }

// export async function generateStaticParams() {
//   const list: Subproduct[] = await getSubproducts();

//   return list.map(({ id }: { id: string }) => ({ id }));
// }
