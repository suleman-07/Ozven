const multer = require("multer");

const storage = multer.memoryStorage();

const imageFileFilter = (req, file, callback) => {
  if (!file.mimetype || !file.mimetype.startsWith("image/")) {
    callback(new Error("Only image uploads are allowed"));
    return;
  }

  callback(null, true);
};

const upload = multer({
  storage,
  fileFilter: imageFileFilter,
  limits: {
    // Keep under Vercel Functions 4.5MB request body limit (multipart overhead included)
    fileSize: 3.5 * 1024 * 1024,
    files: 12,
  },
});

const productImageUpload = upload.fields([
  { name: "images", maxCount: 12 },
  { name: "featuredImage", maxCount: 1 },
  { name: "galleryImages", maxCount: 11 },
]);

const singleProductImageUpload = upload.single("image");

function handleUploadError(error, req, res, next) {
  if (!error) {
    return next();
  }

  if (error instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      message:
        error.code === "LIMIT_FILE_SIZE"
          ? "Each image must be 3.5MB or smaller"
          : error.message,
    });
  }

  return res.status(400).json({
    success: false,
    message: error.message || "Image upload failed",
  });
}

module.exports = {
  productImageUpload,
  singleProductImageUpload,
  handleUploadError,
};
