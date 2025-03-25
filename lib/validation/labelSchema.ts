import z from "zod";

export const labelSchema = z.object({
  uuid: z.string().uuid({ message: "Invalid UUID format." }),
  title: z
    .string()
    .min(1, {
      message: "Title is required",
    })
    .max(9, {
      message: "Title should not have more than 9 charachters.",
    }),
  hex: z.string().min(1, {
    message: "Hex code is required",
  }),
  isProtected: z.boolean({ message: "Item protection state is required." }),
  isActive: z.boolean({ message: "Item activity state is required." }),
});
