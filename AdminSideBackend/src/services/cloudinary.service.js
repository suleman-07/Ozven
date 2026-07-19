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

async function uploadImageBuffer(buffer, { folder = env.cloudinary.uploadFolder, filename } = {}) {
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
          reject(error);
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
