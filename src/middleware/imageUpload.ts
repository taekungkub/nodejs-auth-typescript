import { NextFunction, Response, Request } from "express";
import multer, { MulterError } from "multer";

const whitelist = ["image/png", "image/jpeg", "image/jpg", "image/webp"];

const dest = "./public/data/uploads";

export const productStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, dest);
  },
  filename: function (req, file, cb) {
    const timestamp = Date.now();
    const ext = file.originalname.split(".").pop();
    const customFilename = `file_${timestamp}.${ext}`;
    cb(null, customFilename);
  },
});

export const productImageUpload = multer({
  limits: {
    fileSize: 1024 * 1024,
  },
  fileFilter: async function (req, file, cb) {
    if (whitelist.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("file is not allowed"));
    }
  },
  storage: productStorage,
});
