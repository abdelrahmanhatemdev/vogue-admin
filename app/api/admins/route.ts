import { adminAddSchema, adminEditSchema } from "@/lib/validation/adminSchema";
import { NextResponse } from "next/server";
import { adminAuth } from "@/database/firebase-admin";
import { adminDB } from "@/database/firebase-admin";
// import redis from "@/lib/redis";
import { isProtected } from "@/lib/api/isProtected";
import { getAllActivePaginated } from "@/lib/api/getAllActivePaginated";
import { softDelete } from "@/lib/api/softDelete";

export const collectionName = "admins";
export const collectionRef = adminDB.collection(collectionName);

export async function GET() {
  return await getAllActivePaginated({ collectionRef });
}

export async function POST(request: Request) {
  try {
    const { uuid, name, email, password } = await request.json();

    await adminAddSchema.parseAsync({ uuid, name, email, password });

    const user = await adminAuth.createUser({
      email,
      password,
      emailVerified: true,
      disabled: false,
      displayName: name,
    });

    await adminAuth.setCustomUserClaims(user.uid, {
      admin: true,
      role: "admin",
    });

    if (user.uid) {
      const date = new Date().toISOString();

      const data = {
        uuid,
        uid: user.uid,
        name,
        email,
        createdAt: date,
        updatedAt: date,
        isActive: true,
        isProtected: false,
      };

      await collectionRef.add(data);

      return NextResponse.json({ message: "Admin added" }, { status: 200 });
    }

    return new Error("Something Wrong");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something Wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {

    const reqData= await request.json();

    await isProtected({ reqData, collectionRef, modelName: "Admin" });
    
    const { id, uuid, uid, name, email, password } = reqData;

    await adminEditSchema.parseAsync({ uuid, name, email, password });

    await adminAuth.updateUser(uid, { email, password, displayName: name });

    const docRef = collectionRef.doc(id);

    if (docRef?.id) {
      await docRef.update({
        name,
        email,
        updatedAt: new Date().toISOString(),
      });
      return NextResponse.json({ message: "Admin Updated" }, { status: 200 });
    }
    return new Error("Something Wrong");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something Wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  return softDelete({request, collectionRef, modelName: "Admin", isAdmin: true})
}
