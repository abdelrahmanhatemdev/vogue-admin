import z from "zod";
import { isValidSlug } from "../isValid";

export const CategorySchema = z
  .object({
    uuid: z.string().uuid(),
    name: z
      .string()
      .min(1, {
        message: "Name is required",
      })
      .max(20, {
        message: "Name should not have more than 20 charachters",
      }),
    slug: z
      .string()
      .min(1, {
        message: "Slug is required",
      })
      .min(3, {
        message: "Slug should have 3 charachters at least",
      })
  })
  .superRefine( async (obj, ctx) => {
    const {uuid, slug} = obj
    const exists = await isValidSlug({
      slug,
      uuid,
      table: "categories",
    });

    if (exists) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
         message: `${slug} slug is already used`, 
         path: ["slug"], 
         fatal: true
      })
      
    }
  }
);
