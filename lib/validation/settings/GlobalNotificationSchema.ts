import z from "zod";

export const GlobalNotificationSchema = z.object({
  uuid: z.string().uuid({ message: "Invalid UUID format." }),
  text: z
    .string()
    .min(1, {
      message: "Text is required",
    })
    .max(100, {
      message: "Text should not have more than 100 charachters",
    }),
  anchorText: z
    .string()
    .min(1, {
      message: "Anchor text is required",
    })
    .max(20, {
      message: "Anchor text should not have more than 20 charachters",
    }),
  anchorLink: z.string().min(1, {
    message: "Anchor link is required",
  })
  .max(60, {
    message: "Anchor link should not have more than 60 charachters",
  }),
});
