import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { fileURLToPath } from "url";
import multer from "multer";

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
export const vendorClaimUploadDir = path.join(currentDirectory, "../private-uploads/vendor-claims");
fs.mkdirSync(vendorClaimUploadDir, { recursive: true });

const allowedTypes = new Map([
  ["application/pdf", ".pdf"],
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
]);

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => callback(null, vendorClaimUploadDir),
  filename: (_req, file, callback) => {
    const extension = allowedTypes.get(file.mimetype);
    callback(null, `${randomUUID()}${extension}`);
  },
});

const uploadVendorClaimDocument = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => {
    if (!allowedTypes.has(file.mimetype)) {
      callback(new Error("Upload a PDF, JPG, PNG, or WEBP document."));
      return;
    }
    callback(null, true);
  },
});

export default uploadVendorClaimDocument;
