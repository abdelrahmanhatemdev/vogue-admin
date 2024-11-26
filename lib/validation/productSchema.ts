import z from "zod";
import { isValidSlug } from "../isValid";

export const ProductSchema = z
  .object({
    uuid: z.string().uuid(),
    name: z
      .string()
      .min(1, {
        message: "Name is required",
      })
      .max(20, {
        message: "Name should not have more than 20 charachters.",
      }),
    slug: z.string().min(1, {
      message: "Slug is required",
    }),
    categories: z.array(z.string()).nonempty({
      message: "Choose at least one category",
    }),
    brand: z.string().min(1, {
      message: "Brand is required",
    }),
    descriptionBrief: z.string().min(1, {
      message: "Description Brief is required",
    }),
    descriptionDetails: z.string().min(1, {
      message: "Description Details is required",
    }),
  })
  .superRefine(async (obj, ctx) => {
    const { uuid, slug } = obj;
    const exists = await isValidSlug({
      slug,
      uuid,
      table: "products",
    });

    if (exists) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `${slug} slug is already used`,
        path: ["slug"],
        fatal: true,
      });
    }
  });
