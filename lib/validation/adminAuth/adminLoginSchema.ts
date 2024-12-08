import z from "zod";

export const AdminLoginSchema = z.object({
  email: z
    .string()
    .min(1, {
      message: "Email is required",
    })
    .max(50, {
      message: "Email should not have more than 50 charachters.",
    })
    .email("Invalid Email address"),
  password: z
    .string()
    .min(1, {
      message: "Password is required",
    })
    .min(6, {
      message: "Password must be at least 6 characters long",
    })
});
