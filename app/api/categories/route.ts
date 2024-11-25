import { NextResponse } from "next/server";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import db from "@/lib/db";
import {QueryResult, ResultSetHeader } from "mysql2"
// import { db } from "@/firebase/firebaseClient.config";

import z from "zod";
import { CategorySchema } from "@/lib/validation/categorySchema";

export const tableName = "categories";
// export const dataCollection = collection(db, tableName);

export const dynamic = 'force-static'

export async function GET() {
  
  try {

    const [rows]: [QueryResult, any] = await db.query(`SELECT * FROM ${tableName} ORDER BY updatedAt DESC`);

    const data = rows as Category[];

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something Wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {

  try {
    const {uuid, name, slug} = await request.json();

    // Ensure Server Validation
    CategorySchema.parseAsync({name, slug})

    const [slugCheck]: [QueryResult, any] = await db.execute(`SELECT * FROM ${tableName} WHERE slug = ?`, [slug]) 

    const existedItems = slugCheck as Category[]

    if (existedItems.length > 0) {
      return NextResponse.json({ error: `${slug} slug is already used!` }, { status: 400 });
    }
    
    const [result]: [ResultSetHeader, any] = await db.execute(`INSERT INTO ${tableName} (uuid, name, slug) VALUES (?, ?, ?)`, [uuid, name, slug]);
  
    if (result.insertId ) {
      return NextResponse.json({ message: "Category added", result }, { status: 200 });
    }

    return new Error("Something Wrong");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something Wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request) {

  try {
    const {uuid, name, slug} = await request.json();

    // Ensure Server Validation
    CategorySchema.parseAsync({name, slug, uuid})

    const [slugCheck]: [QueryResult, any] = await db.execute(`SELECT * FROM ${tableName} WHERE slug = ? AND uuid != ?`, [slug, uuid]) 

    const existedItems = slugCheck as Category[]

    if (existedItems.length > 0) {
      return NextResponse.json({ error: `${slug} slug is already used!` }, { status: 400 });
    }
    
    const [result]: [ResultSetHeader, any] = await db.execute(`UPDATE ${tableName} SET name = ? , slug = ? WHERE uuid = ?`, [name, slug, uuid]);
    
    if (result.affectedRows) {
      return NextResponse.json({ message: "Category updated", result }, { status: 200 });
    }

    return new Error("Something Wrong");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something Wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// export async function PUT(request: Request) {
//   const { id, name, slug } = await request.json();

//   try {
//     const docRef = doc(db, tableName, id);

//     if (docRef?.id) {
//       const date = new Date().toISOString();
//       await updateDoc(docRef, {
//         name,
//         slug,
//         updatedAt: date,
//       });
//       return NextResponse.json(
//         { message: "Category Updated" },
//         { status: 200 }
//       );
//     }

//     return new Error("Something Wrong");
//   } catch (error) {
//     const message = error instanceof Error ? error.message : "Something Wrong";
//     return NextResponse.json({ error: message }, { status: 500 });
//   }
// }

// export async function DELETE(request: Request) {
//   const { id } = await request.json();

//   try {
//     const docRef = doc(db, tableName, id);

//     if (docRef?.id) {
//       await deleteDoc(docRef);
//       return NextResponse.json(
//         { message: "Category Deleted" },
//         { status: 200 }
//       );
//     }

//     return new Error("Something Wrong");
//   } catch (error) {
//     const message = error instanceof Error ? error.message : "Something Wrong";
//     return NextResponse.json({ error: message }, { status: 500 });
//   }
// }