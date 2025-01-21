import z from "zod";
import { currencies } from "@/constants/currencies";

const validCurrencies = currencies.map((c) => c.code) as [string, ...string[]];

export const CurrencySchema = z.object({
  uuid: z.string().uuid({ message: "Invalid UUID format." }),
  code: z.enum(validCurrencies, { message: "Invalid currency" }),
});
