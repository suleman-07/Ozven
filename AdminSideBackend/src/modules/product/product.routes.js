const express = require("express");
const authMiddleware = require("../../middleware/auth.middleware");
const {
  productImageUpload,
  handleUploadError,
} = require("../../middleware/upload.middleware");
const {
  listProducts,
  getProduct,
  createProductHandler,
  updateProductHandler,
  deleteProductHandler,
} = require("./product.controller");

const router = express.Router();

function withProductImageUpload(handler) {
  return (req, res, next) => {
    productImageUpload(req, res, (error) => {
      if (error) {
        return handleUploadError(error, req, res, next);
      }

      return handler(req, res, next);
    });
  };
}

router.use(authMiddleware);
router.get("/", listProducts);
router.get("/:id", getProduct);
router.post("/", withProductImageUpload(createProductHandler));
router.put("/:id", withProductImageUpload(updateProductHandler));
router.delete("/:id", deleteProductHandler);

module.exports = router;
