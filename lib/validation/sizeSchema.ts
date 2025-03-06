import z from "zod";

export const sizeSchema = z.object({
  uuid: z.string().uuid({ message: "Invalid UUID format." }),
  name: z
    .string()
    .min(1, {
      message: "Name is required",
    })
    .max(20, {
      message: "Name should not have more than 20 charachters.",
    }),
  symbol: z
    .string()
    .min(1, {
      message: "Symbol is required",
    })
    .max(4, {
      message: "Symbol should not have more than 4 charachters.",
    }),
  sortOrder: z.coerce
    .number()
    .nonnegative("Order must be zero or positive")
    .max(100, {
      message: "Order cannot be more than 100",
    }),
});
