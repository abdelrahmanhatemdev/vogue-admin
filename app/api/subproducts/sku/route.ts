// import { NextResponse } from "next/server";
// import { dataCollection } from "@/app/api/subproducts/route";
// import { getSubproducts } from "@/actions/Subproduct";

// export const dynamic = "force-static";

// export async function GET(
//   req: Request,
//   props: { params: Promise<{ sku: string }> }
// ) {
//   const params = await props.params;

//   const { sku } = params;

//   try {
//     const q = query(dataCollection, where("sku", "==", sku));
//     const querySnapshot = (await getDocs(q)).docs;
//     const doc = querySnapshot[0];

//     if (doc?.id) {
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
//       } = doc.data();
//       const data: Subproduct = {
//         id: doc.id,
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

//   return list.map(({ sku }: { sku: string }) => ({ sku }));
// }
