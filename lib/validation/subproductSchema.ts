import z from "zod";
import { currencies } from "@/constants/currencies";
import { isValidSku, isValidSlug } from "@/lib/isValid";

const validCurrencies = currencies.map((c) => c.code) as [string, ...string[]];

export const SubproductSchema = z
  .object({
    uuid: z.string().uuid({ message: "Invalid UUID format." }),
    product_id: z.string().uuid({ message: "Invalid UUID format." }),
    sku: z
      .string()
      .min(1, {
        message: "Sku is required",
      })
      .max(24, {
        message: "Sku should not have more than 24 charachters.",
      }),
    currency: z.enum(validCurrencies, { message: "Invalid currency" }),
    price: z.coerce
      .number({ message: "Price is required" })
      .positive("Price must be positive")
      .min(1, {
        message: "Price is required",
      }),
    discount: z.coerce
      .number()
      .nonnegative("Discount must be zero or positive")
      .max(100, {
        message: "Discount cannot be more than 100%",
      }),
    qty: z.coerce
      .number()
      .int({ message: "Quantity must be an integer." })
      .min(0, { message: "Quantity cannot be negative." }),
    sold: z.coerce
      .number()
      .int({ message: "Sold quantity must be an integer." })
      .min(0, { message: "Sold quantity cannot be negative." }),
    featured: z.boolean({ message: "Featured field is required." }),
    inStock: z.boolean({ message: "InStock field is required." }),
    colors: z.array(z.string()).nonempty({
      message: "Choose at least one color",
    }),
    sizes: z.array(z.string()).nonempty({
      message: "Choose at least one size",
    }),
  })
  .superRefine(async (obj, ctx) => {
    const { uuid, sku } = obj;
    const exists = await isValidSku({
      sku,
      uuid,
      table: "subproducts",
    });

    if (exists) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `${sku} Sku is already used`,
        path: ["sku"],
        fatal: true,
      });
    }
  });
