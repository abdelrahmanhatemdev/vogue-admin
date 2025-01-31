import z from "zod";
import { isValidSlug } from "@/lib/isValid";

export const CategorySchema = z
  .object({
    uuid: z.string().uuid({ message: "Invalid UUID format." }),
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
      .min(1, { message: "Slug cannot be empty" })
      .min(3, { message: "Slug at least should have 3 charachters" }) // Minimum length
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
        message:
          "Slug can only contain lowercase letters, numbers, and a hyphen between letters or numbers",
      })
      .max(50, { message: "Slug cannot exceed 50 characters" }),
    parent: z.string().optional(),
    label: z.string().optional(),
    additional: z.boolean({ message: "Additional field is required." }).optional(),
  })
  .superRefine(async (obj, ctx) => {
    const { uuid, slug } = obj;
    const exists = await isValidSlug({
      slug,
      uuid,
      collection: "categories",
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
