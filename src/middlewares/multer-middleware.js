import multer from "multer";
import path from "path";
import crypto from "crypto";

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/file");
  },
  filename: async (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const allowedExtensions = [".pdf", ".doc", ".docx"];
    if (!allowedExtensions.includes(ext.toLowerCase())) {
      return cb(new Error("Invalid file type"));
    }
    const uniqueFilename = crypto.randomUUID() + ext;
    cb(null, uniqueFilename);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "application/pdf",
    "application/msword", // for .doc
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // for .docx
  ];
  cb(null, allowedMimeTypes.includes(file.mimetype));
};

export const multers = multer({
  storage: fileStorage,
  fileFilter: fileFilter,
}).single("file");
