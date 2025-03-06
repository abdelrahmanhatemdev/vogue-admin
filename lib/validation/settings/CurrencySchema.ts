import z from "zod";
import { currencies } from "@/constants/currencies";
import { isValidCurrencyCode } from "@/lib/isValid";

const validCurrencies = currencies.map((c) => c.code) as [string, ...string[]];

export const currencySchema = z
  .object({
    uuid: z.string().uuid({ message: "Invalid UUID format." }),
    code: z.enum(validCurrencies, { message: "Invalid currency" }),
  })
  .superRefine(async (obj, ctx) => {
    const { uuid, code } = obj;
    const exists = await isValidCurrencyCode({
      code,
      uuid,
      collection: "settings/currencies",
    });

    if (exists) {
      const currency = currencies.find((c) => c.code === code);

      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `${currency?.name} is already used`,
        path: ["code"],
        fatal: true,
      });
    }
  });
