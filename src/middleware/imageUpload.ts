import multer, { MulterError } from "multer";

const whitelist = ["image/png", "image/jpeg", "image/jpg", "image/webp"];

export const productDest = "./public/data/uploads";

export const productImageUpload = multer({
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: async function (req, file, cb) {
    if (whitelist.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("file is not allowed"));
    }
  },
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, productDest);
    },
    filename: function (req, file, cb) {
      const timestamp = Date.now();
      const ext = file.originalname.split(".").pop();
      const customFilename = `file_${timestamp}.${ext}`;
      cb(null, customFilename);
    },
  }),
});
