import z from "zod";

export const SettingSchema = z.object({
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
});
