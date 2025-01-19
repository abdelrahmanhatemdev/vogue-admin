import z from "zod";

export const LabelSchema = z.object({
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
});
