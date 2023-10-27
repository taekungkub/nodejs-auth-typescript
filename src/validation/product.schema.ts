import { z } from "zod";

// const MAX_FILE_SIZE = 500000;
// const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const productSchema = z.object({
  body: z.object({
    id: z.any(),
    userId: z.string(),
    title: z.string(),
    metaTitle: z.any(),
    price: z.string(),
    discount: z.string(),
    quantity: z.string(),
    category_id: z.string(),
  }),
  files: z.any().refine((files) => {
    if (files.length > 0) {
      return true;
    }
    return false;
  }, "Images is required."),
  // ไป filter เอาใน  multer
  // .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
  // .refine((files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type), ".jpg, .jpeg, .png and .webp files are accepted."),
});

export type ProductSchemaBody = z.infer<typeof productSchema>["body"];
