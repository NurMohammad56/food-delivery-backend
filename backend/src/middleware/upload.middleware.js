import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

// Multer configuration
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: fileFilter,
});

// Single file upload
export const uploadSingle = upload.single("image");

// Avatar upload
export const uploadAvatar = upload.single("avatar");

// Multiple files upload (max 5)
export const uploadMultiple = upload.array("images", 5);

export default upload;
