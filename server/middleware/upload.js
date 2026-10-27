import multer from 'multer';
import path from 'path';
import fs from 'fs';

function makeStorage(subfolder) {
  const dir = path.join(process.cwd(), 'uploads', subfolder);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  return multer.diskStorage({
    destination: (req, file, cb) => cb(null, dir),
    filename: (req, file, cb) => {
      const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      cb(null, `${unique}${path.extname(file.originalname)}`);
    },
  });
}

const imageFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp|gif/;
  const ok = allowed.test(path.extname(file.originalname).toLowerCase()) && allowed.test(file.mimetype);
  cb(ok ? null : new Error('Only image files (jpg, png, webp, gif) are allowed'), ok);
};

const pdfFilter = (req, file, cb) => {
  const ok = file.mimetype === 'application/pdf';
  cb(ok ? null : new Error('Only PDF files are allowed'), ok);
};

export const uploadImage = multer({
  storage: makeStorage('images'),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: imageFilter,
});

export const uploadResume = multer({
  storage: makeStorage('resume'),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: pdfFilter,
});
