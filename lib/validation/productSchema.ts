import z from "zod";
import { isValid } from "@/lib/isValid";

export const productSchema = z
  .object({
    uuid: z.string().uuid({ message: "Invalid UUID format." }),
    name: z
      .string()
      .min(1, {
        message: "Name is required",
      })
      .max(100, {
        message: "Name should not have more than 100 charachters.",
      }),
    slug: z
      .string()
      .min(1, { message: "Slug cannot be empty" })
      .min(3, { message: "Slug at least should have 3 charachters" }) // Minimum length
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
        message:
          "Slug can only contain lowercase letters, numbers, and a hyphen between letters or numbers",
      })
      .max(100, { message: "Slug cannot exceed 100 characters" }), // Optional max length
    categories: z.array(z.string()).nonempty({
      message: "Choose at least one category",
    }),
    brandId: z.string().min(1, {
      message: "Brand is required",
    }),
    descriptionBrief: z.string().min(1, {
      message: "Description Brief is required",
    }),
    descriptionDetails: z.string().min(1, {
      message: "Description Details is required",
    }),
    trending: z.boolean({ message: "Trending field is required." }).optional(),
  })
  .superRefine(async (obj, ctx) => {
    const { uuid, slug } = obj;
    const exists = await isValid({
      uuid,
      path: `products/slug/` + slug + "/product",
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
