import z from "zod";

export const SocialMediaSchema = z.object({
  uuid: z.string().uuid({ message: "Invalid UUID format." }),
  link: z
    .string()
    .url()
    .refine(
      (url) =>
        /^(https?:\/\/)?(www\.)?(facebook\.com|twitter\.com|linkedin\.com|instagram\.com)\/.+$/.test(
          url
        ),
      {
        message: "Invalid account link URL for the specified platform.",
      }
    ),
  platform: z.enum(["facebook", "twitter", "instagram", "linkedin"]),
  followers: z.coerce
    .number({ message: "Followers is required" })
    .int({ message: "Followers must be an integer." })
    .min(0, { message: "Followers cannot be negative." }),
});
