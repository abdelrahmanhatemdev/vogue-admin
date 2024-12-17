import z from "zod";

export const SubproductPhotosSchema = z.object({
  productId: z.string().uuid({ message: "Invalid UUID format." }),
  images: z
    .custom<FileList>(files => files instanceof FileList, {
      message: "Must be a valid file input"
    })
    .refine(files => files && files.length > 0 , {
      message: "At least one photo is required"
    })
    .refine(files => files && Array.from(files).every(file => ["image/jpeg", "image/png", "image/webp"].includes(file.type)) , {
      message: "Invalid image type. Only JPEG, PNG, and WEBP are allowed."
    })
    .refine(files => files && Array.from(files).every(file => file.size < 300 * 1024) , {
      message: "Image maximum size is 300KB"
    })
});
