import { z } from "zod";

export const adminLoginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .max(50, { message: "Email should not have more than 50 characters." })
    .email("Invalid email address"),
  password: z
    .string()
    .min(6, { message: "Password is required and must be at least 6 characters long" }),
});
