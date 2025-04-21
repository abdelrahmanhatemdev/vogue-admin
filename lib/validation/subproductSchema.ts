import z from "zod";
import { currencies } from "@/constants/currencies";
import { isValid } from "../isValid";

const validCurrencies = currencies.map((c) => c.code) as [string, ...string[]];

export const subproductSchema = z
  .object({
    uuid: z.string().uuid({ message: "Invalid UUID format." }),
    productId: z.string().uuid({ message: "Invalid UUID format." }),
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
      .nonnegative("Price must be 0 or positive"),
    discount: z.coerce
      .number()
      .nonnegative("Discount must be zero or positive")
      .max(100, {
        message: "Discount cannot be more than 100%",
      }),
    qty: z.coerce
      .number({ message: "Quantity is required" })
      .int({ message: "Quantity must be an integer." })
      .min(0, { message: "Sold quantity cannot be negative." }),
    sold: z.coerce
      .number({ message: "Quantity is required" })
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
    const exists = await isValid({
      uuid,
      path: `subproducts/${sku}`,
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
