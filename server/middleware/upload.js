
import multer from "multer";
import path from "path";
import fs from "fs";

// Vercel allows temporary file storage in /tmp.
// Files stored here are NOT permanent.
function makeStorage(subfolder) {
  const dir = path.join("/tmp", "uploads", subfolder);

  fs.mkdirSync(dir, { recursive: true });

  return multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, dir);
    },

    filename: (req, file, cb) => {
      const unique = `${Date.now()}-${Math.round(
        Math.random() * 1e9
      )}`;

      cb(
        null,
        `${unique}${path.extname(file.originalname)}`
      );
    },
  });
}

const imageFilter = (req, file, cb) => {
  const allowed = /\.(jpeg|jpg|png|webp|gif)$/i;

  const ok =
    allowed.test(path.extname(file.originalname)) &&
    /^image\/(jpeg|png|webp|gif)$/i.test(file.mimetype);

  cb(
    ok ? null : new Error("Only image files are allowed"),
    ok
  );
};

const pdfFilter = (req, file, cb) => {
  const ok = file.mimetype === "application/pdf";

  cb(
    ok ? null : new Error("Only PDF files are allowed"),
    ok
  );
};

export const uploadImage = multer({
  storage: makeStorage("images"),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: imageFilter,
});

export const uploadResume = multer({
  storage: makeStorage("resume"),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: pdfFilter,
});
