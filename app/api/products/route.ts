import { ProductSchema } from "@/lib/validation/productSchema";
import { NextResponse } from "next/server";

import { db } from "@/database/firebase";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { snapshot } from "node:test";

export const collectionName = "products";
export const collectionRef = collection(db, collectionName);

export async function GET() {
  try {
    const snapShot = (await getDocs(collectionRef)).docs;

    const data =
      snapShot.length > 0
        ? (
            snapShot.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            })) as Product[]
          ).filter((doc) => !doc.deletedAt)
        : [];

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something Wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const {
      uuid,
      name,
      slug,
      brandId,
      categories,
      descriptionBrief,
      descriptionDetails,
      trending,
    } = await request.json();

    await ProductSchema.parseAsync({
      uuid,
      name,
      slug,
      brandId,
      categories,
      descriptionBrief,
      descriptionDetails,
      trending,
    });

    const q = query(collectionRef, where("slug", "==", slug));

    const snapShot = (await getDocs(q)).docs;
    const existedItems =
      snapShot.length > 0
        ? (
            snapShot.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            })) as Product[]
          ).filter((doc) => !doc.deletedAt)
        : [];

    if (existedItems.length > 0) {
      return NextResponse.json(
        { error: `${slug} slug is already used!` },
        { status: 400 }
      );
    }

    const nonEmptyCategories = categories.filter(
      (cat: string) => cat.trim() !== ""
    );

    if (nonEmptyCategories.length === 0) {
      throw new Error("Choose at least one Category");
    }

    const date = new Date().toISOString();

    const data = {
      uuid,
      name,
      slug,
      brandId,
      categories,
      descriptionBrief,
      descriptionDetails,
      trending,
      createdAt: date,
      updatedAt: date,
    };

    const docRef = await addDoc(collectionRef, data);

    if (docRef.id) {
      return NextResponse.json({ message: "Product added" }, { status: 200 });
    }

    return new Error("Something Wrong");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something Wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const reqData = await request.json();

  if (reqData?.property) {
    const { property, id, value } = reqData;
    const docRef = doc(db, collectionName, id);

    if (docRef?.id) {
      await updateDoc(docRef, {
        [property]: value,
        updatedAt: new Date().toISOString(),
      });

      return NextResponse.json({ message: "Product updated" }, { status: 200 });
    }
  }

  try {
    const {
      id,
      uuid,
      name,
      slug,
      brandId,
      categories,
      descriptionBrief,
      descriptionDetails,
      trending,
    } = reqData;

    await ProductSchema.parseAsync({
      uuid,
      name,
      slug,
      brandId,
      categories,
      descriptionBrief,
      descriptionDetails,
      trending,
    });

    const list = (await getDocs(collectionRef)).docs.filter(
      (doc) => doc.id !== id && doc.data().slug === slug
    );

    const existedItems =
      list.length > 0
        ? list.filter((doc) => doc.id === id && doc.data().slug !== slug)
        : [];

    if (existedItems.length > 0) {
      return NextResponse.json(
        { error: `${slug} slug is already used!` },
        { status: 400 }
      );
    }
    const nonEmptyCategories = categories.filter(
      (cat: string) => cat.trim() !== ""
    );

    if (nonEmptyCategories.length === 0) {
      throw new Error("Choose at least one Category");
    }

    const docRef = doc(db, collectionName, id);

    if (docRef?.id) {
      await updateDoc(docRef, {
        name,
        slug,
        brandId,
        categories,
        descriptionBrief,
        descriptionDetails,
        trending,
        updatedAt: new Date().toISOString(),
      });
      return NextResponse.json({ message: "Product Updated" }, { status: 200 });
    }
    return new Error("Something Wrong");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something Wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();

    const docRef = doc(db, collectionName, id);

    const data = { deletedAt: new Date().toISOString() };

    const result = await updateDoc(docRef, data);

    return NextResponse.json(
      { message: "Product Deleted", result },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something Wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// export async function GET() {
//   try {
//     const [rows] = await db.query(
//       `SELECT ${tableName}.*,
//       brands.name AS brand_name, brands.slug AS brand_slug,
//       GROUP_CONCAT(c.name," - ", c.slug, " - ", c.uuid) AS categories,
//       COUNT(sp.uuid) AS subproductCount
//       FROM ${tableName}
//       LEFT JOIN brands
//       ON ${tableName}.brandId = brands.uuid
//       LEFT JOIN product_categories pc
//       ON ${tableName}.uuid = pc.productId
//       LEFT JOIN categories c
//       ON c.uuid = pc.productId
//       LEFT JOIN subproducts sp
//       ON sp.productId = ${tableName}.uuid
//       AND sp.deletedAt IS NULL
//       WHERE ${tableName}.deletedAt IS NULL
//       GROUP BY ${tableName}.uuid
//       ORDER BY updatedAt DESC
//       `
//     );

//     const data = rows as Product[];

//     return NextResponse.json({ data }, { status: 200 });
//   } catch (error) {
//     const message = error instanceof Error ? error.message : "Something Wrong";
//     return NextResponse.json({ error: message }, { status: 500 });
//   }
// }

// export async function POST(request: Request) {
//   try {
//     const {
//       uuid,
//       name,
//       slug,
//       brandId,
//       categories,
//       descriptionBrief,
//       descriptionDetails,
//       trending
//     } = await request.json();

//     //Ensure Server Validation
//     await ProductSchema.parseAsync({
//       uuid,
//       name,
//       slug,
//       brandId,
//       categories,
//       descriptionBrief,
//       descriptionDetails,
//       trending
//     });

//     const [slugCheck] = await db.execute(
//       `SELECT * FROM ${tableName} WHERE deletedAt IS NULL AND slug = ?`,
//       [slug]
//     );

//     const existedItems = slugCheck as Product[];

//     if (existedItems.length > 0) {
//       return NextResponse.json(
//         { error: `${slug} slug is already used!` },
//         { status: 400 }
//       );
//     }

//     const nonEmptyCategories = categories.filter(
//       (cat: string) => cat.trim() !== ""
//     );

//     if (nonEmptyCategories.length === 0) {
//       throw new Error("Choose at least one Category");
//     }

//     await db.execute(
//       `INSERT INTO ${tableName} (
//       uuid,
//       name,
//       slug,
//       brandId,
//       descriptionBrief,
//       descriptionDetails,
//       trending
//       ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
//       [uuid, name, slug, brandId, descriptionBrief, descriptionDetails, trending]
//     );

//     const catArray = nonEmptyCategories.map((c: string) => [uuid, c]);
//     const placeholders = catArray.map(() => "(?, ?)").join(", ");
//     const flattenedValues = catArray.flat();

//     await db.execute(
//       `INSERT INTO product_categories (productId, productId) VALUES ${placeholders}`,
//       flattenedValues
//     );

//     return NextResponse.json({ message: "Product added" }, { status: 200 });
//   } catch (error) {
//     if (error instanceof ZodError) {
//       return NextResponse.json(
//         { error: error.errors[0].message },
//         { status: 500 }
//       );
//     }
//     const message = error instanceof Error ? error.message : "Something Wrong";
//     return NextResponse.json({ error: message }, { status: 500 });
//   }
// }

// export async function PUT(request: Request) {
//   const reqData = await request.json();

//   if (reqData?.property) {
//     const { property, uuid, value } = reqData;
//     const [result]: [ResultSetHeader, FieldPacket[]] = await db.execute(
//       `UPDATE ${tableName} SET
//       ${property} = ?
//       WHERE
//       uuid = ?`,
//       [value, uuid]
//     );

//     if (result.affectedRows) {
//       return NextResponse.json({ message: "Product updated" }, { status: 200 });
//     }
//     return NextResponse.json({ message: "Something wrong" }, { status: 500 });
//   }

//   try {
//     const {
//       uuid,
//       name,
//       slug,
//       brandId,
//       categories,
//       descriptionBrief,
//       descriptionDetails,
//       trending
//     } = reqData;

//     // // Ensure Server Validation
//     await ProductSchema.parseAsync({
//       uuid,
//       name,
//       slug,
//       brandId,
//       categories,
//       descriptionBrief,
//       descriptionDetails,
//       trending
//     });

//     const [slugCheck] = await db.execute(
//       `SELECT * FROM ${tableName} WHERE deletedAt IS NULL AND slug = ? AND uuid != ?`,
//       [slug, uuid]
//     );

//     const existedItems = slugCheck as Product[];

//     if (existedItems.length > 0) {
//       return NextResponse.json(
//         { error: `${slug} slug is already used!` },
//         { status: 400 }
//       );
//     }

//     const nonEmptyCategories = categories.filter(
//       (cat: string) => cat.trim() !== ""
//     );

//     if (nonEmptyCategories.length === 0) {
//       throw new Error("Choose at least one Product");
//     }

//     await db.execute(`DELETE FROM product_categories WHERE productId = ?`, [
//       uuid,
//     ]);

//     const catArray = nonEmptyCategories.map((c: string) => [uuid, c]);
//     const placeholders = catArray.map(() => "(?, ?)").join(", ");
//     const flattenedValues = catArray.flat();

//     await db.execute(
//       `INSERT INTO product_categories (productId, productId) VALUES ${placeholders}`,
//       flattenedValues
//     );

//     const [result]: [ResultSetHeader, FieldPacket[]] = await db.execute(
//       `UPDATE ${tableName} SET name = ?, slug = ?, brandId = ?, descriptionBrief = ?, descriptionDetails = ?, trending = ?  WHERE uuid = ?`,
//       [name, slug, brandId, descriptionBrief, descriptionDetails, trending, uuid]
//     );

//     if (result.affectedRows) {
//       return NextResponse.json({ message: "Product updated" }, { status: 200 });
//     }
//   } catch (error) {
//      if (error instanceof ZodError) {
//       return NextResponse.json(
//         { error: error.errors[0].message },
//         { status: 500 }
//       );
//     }
//     const message = error instanceof Error ? error.message : "Something Wrong";
//     return NextResponse.json({ error: message }, { status: 500 });
//   }
// }

// export async function DELETE(request: Request) {
//   try {
//     const { uuid } = await request.json();

//     const [result]: [ResultSetHeader, FieldPacket[]] = await db.execute(
//       `UPDATE ${tableName} SET deletedAt = CURRENT_TIMESTAMP WHERE uuid = ?`,
//       [uuid]
//     );

//     await db.execute(
//       `UPDATE ${subproductsTable} SET deletedAt = CURRENT_TIMESTAMP WHERE productId = ?`,
//       [uuid]
//     );

//     if (result.affectedRows) {
//       return NextResponse.json({ message: "Product Deleted" }, { status: 200 });
//     }
//   } catch (error) {

//     const message = error instanceof Error ? error.message : "Something Wrong";
//     return NextResponse.json({ error: message }, { status: 500 });
//   }
// }
