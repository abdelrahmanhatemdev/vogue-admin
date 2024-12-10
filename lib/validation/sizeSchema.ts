import z from "zod";

export const SizeSchema = z.object({
  uuid: z.string().uuid({ message: "Invalid UUID format." }),
  name: z
    .string()
    .min(1, {
      message: "Name is required",
    })
    .max(20, {
      message: "Name should not have more than 20 charachters.",
    }),
});
