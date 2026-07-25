const cloudinary = require("../config/cloudinary");
const env = require("../config/env");

function extractPublicId(imageUrl) {
  if (!imageUrl || typeof imageUrl !== "string") {
    return null;
  }

  try {
    const uploadMarker = "/upload/";
    const markerIndex = imageUrl.indexOf(uploadMarker);

    if (markerIndex === -1) {
      return null;
    }

    let path = imageUrl.slice(markerIndex + uploadMarker.length);
    path = path.split("?")[0];

    // Strip version segment like v1234567890/
    path = path.replace(/^v\d+\//, "");

    const extensionIndex = path.lastIndexOf(".");
    if (extensionIndex !== -1) {
      path = path.slice(0, extensionIndex);
    }

    return path || null;
  } catch {
    return null;
  }
}

function assertCloudinaryConfigured() {
  const { cloudName, apiKey, apiSecret } = env.cloudinary;

  if (!cloudName || !apiKey || !apiSecret) {
    const error = new Error(
      "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in .env"
    );
    error.statusCode = 503;
    throw error;
  }

  if (/^your_/i.test(String(cloudName)) || String(cloudName).includes(" ")) {
    const error = new Error(
      "CLOUDINARY_CLOUD_NAME looks invalid. Use the Cloud name from Cloudinary Dashboard → Settings → Product environment credentials (usually lowercase)."
    );
    error.statusCode = 503;
    throw error;
  }
}

function toUploadError(error) {
  const message = error?.message || "Image upload to Cloudinary failed";
  const uploadError = new Error(message);
  uploadError.statusCode =
    error?.http_code === 401 || error?.http_code === 403 ? 502 : error?.statusCode || 502;
  uploadError.cause = error;
  return uploadError;
}

async function uploadImageBuffer(buffer, { folder = env.cloudinary.uploadFolder, filename } = {}) {
  assertCloudinaryConfigured();

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        public_id: filename || undefined,
        overwrite: true,
      },
      (error, result) => {
        if (error) {
          reject(toUploadError(error));
          return;
        }

        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      }
    );

    uploadStream.end(buffer);
  });
}

async function deleteImageByUrl(imageUrl) {
  const publicId = extractPublicId(imageUrl);

  if (!publicId) {
    return null;
  }

  return cloudinary.uploader.destroy(publicId, { resource_type: "image" });
}

async function deleteImagesByUrls(imageUrls = []) {
  const uniqueUrls = [...new Set(imageUrls.filter(Boolean))];
  await Promise.all(uniqueUrls.map((url) => deleteImageByUrl(url).catch(() => null)));
}

module.exports = {
  extractPublicId,
  uploadImageBuffer,
  deleteImageByUrl,
  deleteImagesByUrls,
};
