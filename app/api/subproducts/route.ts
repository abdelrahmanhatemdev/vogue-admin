import { NextResponse } from "next/server";
import db from "@/lib/db";
import { FieldPacket, ResultSetHeader } from "mysql2";
import { SubproductSchema } from "@/lib/validation/subproductSchema";
import { ZodError } from "zod";

export const tableName = "subproducts";

export async function GET(request: Request) {
  try {
    const req = await request;
    console.log("requestData", req);

    
// 
    // const [rows] = await db.execute(
    //     `SELECT * FROM ${tableName} WHERE deletedAt IS NULL AND slug = ?`,
    //     [product_id]
    //   );

    // const data = rows ;

    return NextResponse.json({ data : "Hi"}, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something Wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const {
      uuid,
      product_id,
      sku,
      currency,
      price,
      discount,
      qty,
      sold,
      featured,
      inStock,
      colors,
      sizes,
    //   images,
    } = await request.json();

    await SubproductSchema.parseAsync({
        uuid,
        product_id,
        sku,
        currency,
        price,
        discount,
        qty,
        sold,
        featured,
        inStock,
        colors,
        sizes,
        // images,
    });

    const [skuCheck] = await db.execute(
      `SELECT * FROM ${tableName} WHERE deletedAt IS NULL AND sku = ?`,
      [sku]
    );

    const existedItems = skuCheck as Product[];

    if (existedItems.length > 0) {
      return NextResponse.json(
        { error: `${sku} sku is already used!` },
        { status: 400 }
      );
    }

    const nonEmptyColors = colors.filter((cat: string) => cat.trim() !== "");

    if (nonEmptyColors.length === 0) {
      throw new Error("Choose at least one color");
    }
    const nonEmptySizes = sizes.filter((cat: string) => cat.trim() !== "");

    if (nonEmptySizes.length === 0) {
      throw new Error("Choose at least one size");
    }

    // const nonEmptyImages = images.filter((cat: string) => cat.trim() !== "");

    // if (nonEmptyImages.length === 0) {
    //   throw new Error("Choose at least one image");
    // }

    const [result]: [ResultSetHeader, FieldPacket[]] = await db.execute(
      `INSERT INTO ${tableName} (
        uuid,
        product_id,
        sku,
        currency,
        price,
        discount,
        qty,
        sold,
        featured,
        inStock
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        uuid,
        product_id,
        sku,
        currency,
        price,
        discount,
        qty,
        sold,
        featured,
        inStock,
      ]
    );

    const colorsArray = nonEmptyColors.map((c: string) => [uuid, c]);
    const colorsPlaceholders = colorsArray.map(() => "(?, ?)").join(", ");
    const colorsFlattenedValues = colorsArray.flat();

    await db.execute(
      `INSERT INTO subproduct_colors (subproduct_id, color_id) VALUES ${colorsPlaceholders}`,
      colorsFlattenedValues
    );

    const sizesArray = nonEmptySizes.map((c: string) => [uuid, c]);
    const sizesPlaceholders = sizesArray.map(() => "(?, ?)").join(", ");
    const sizesFlattenedValues = sizesArray.flat();

    await db.execute(
      `INSERT INTO subproduct_sizes (subproduct_id, size_id) VALUES ${sizesPlaceholders}`,
      sizesFlattenedValues
    );

    return NextResponse.json({ message: "Product added" }, { status: 200 });
  } catch (error) {
    console.log(error);
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 500 }
      );
    }
   
    
    const message = error instanceof Error ? error.message : "Something Wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  //   try {
  //     const {
  //       uuid,
  //       name,
  //       slug,
  //       brand_id,
  //       categories,
  //       descriptionBrief,
  //       descriptionDetails,
  //     } = await request.json();
  //     // // Ensure Server Validation
  //     await SubproductSchema.parseAsync({
  //       uuid,
  //       name,
  //       slug,
  //       brand_id,
  //       categories,
  //       descriptionBrief,
  //       descriptionDetails,
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
  //       throw new Error("Choose at least one category");
  //     }
  //     await db.execute(`DELETE FROM product_categories WHERE product_id = ?`, [
  //       uuid,
  //     ]);
  //     const catArray = nonEmptyCategories.map((c: string) => [uuid, c]);
  //     const placeholders = catArray.map(() => "(?, ?)").join(", ");
  //     const flattenedValues = catArray.flat();
  //     await db.execute(
  //       `INSERT INTO product_categories (product_id, category_id) VALUES ${placeholders}`,
  //       flattenedValues
  //     );
  //     const [result]: [ResultSetHeader, FieldPacket[]] = await db.execute(
  //       `UPDATE ${tableName} SET name = ?, slug = ?, brand_id = ?, descriptionBrief = ?, descriptionDetails = ?  WHERE uuid = ?`,
  //       [name, slug, brand_id, descriptionBrief, descriptionDetails, uuid]
  //     );
  //     if (result.affectedRows) {
  //       return NextResponse.json({ message: "Product updated" }, { status: 200 });
  //     }
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
}

export async function DELETE(request: Request) {
  try {
    const { uuid } = await request.json();

    const [result]: [ResultSetHeader, FieldPacket[]] = await db.execute(
      `UPDATE ${tableName} SET deletedAt = CURRENT_TIMESTAMP WHERE uuid = ?`,
      [uuid]
    );

    if (result.affectedRows) {
      return NextResponse.json({ message: "Product Deleted" }, { status: 200 });
    }
  } catch (error) {
    console.log("error", error);

    const message = error instanceof Error ? error.message : "Something Wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
