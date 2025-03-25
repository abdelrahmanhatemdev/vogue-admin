import z from "zod";
import { isValidSlug } from "@/lib/isValid";

export const brandSchema = z
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
    isProtected: z.boolean({ message: "Item protection state is required." }),
    isActive: z.boolean({ message: "Item activity state is required." }),
  })
  .superRefine(async (obj, ctx) => {
    const { uuid, slug } = obj;
    const exists = await isValidSlug({
      slug,
      uuid,
      collection: "brands",
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
