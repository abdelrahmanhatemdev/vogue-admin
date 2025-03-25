import z from "zod";

export const settingSchema = z.object({
  uuid: z.string().uuid({ message: "Invalid UUID format." }),
  key: z
    .string()
    .min(1, {
      message: "Key is required",
    })
    .max(100, {
      message: "Key should not have more than 100 charachters",
    }),
  value: z
    .string()
    .min(1, {
      message: "Value is required",
    })
    .max(100, {
      message: "Value should not have more than 100 charachters",
    }),
  isProtected: z.boolean({ message: "Item protection state is required." }),
  isActive: z.boolean({ message: "Item activity state is required." }),
});
