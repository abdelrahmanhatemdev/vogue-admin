import z from "zod";
import { isValid } from "@/lib/isValid";

export const adminAddSchema = z
  .object({
    uuid: z.string().uuid({ message: "Invalid UUID format." }),
    uid: z.string().optional(),
    name: z
      .string()
      .min(1, {
        message: "Name is required",
      })
      .max(20, {
        message: "Name should not have more than 20 charachters.",
      }),
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
  })
  .superRefine(async (obj, ctx) => {
    const { uuid, email } = obj;
    const exists = await isValid({
      uuid,
      path: `admins/${email}`,
    });


    if (exists) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `${email} email is already used`,
        path: ["email"],
        fatal: true,
      });
    }
  });

export const adminEditSchema = z
  .object({
    uuid: z.string().uuid(),
    uid: z.string().optional(),
    name: z
      .string()
      .min(1, {
        message: "Name is required",
      })
      .max(20, {
        message: "Name should not have more than 20 charachters.",
      }),
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
      .min(6, {
        message: "Password must be at least 6 characters long",
      }).optional()
      ,
  })
  .superRefine(async (obj, ctx) => {
    const { uuid, email } = obj;
    const exists = await isValid({
      uuid,
      path: `admins/${email}`,
    });

    if (exists) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `${email} email is already used`,
        path: ["email"],
        fatal: true,
      });
    }
  });
