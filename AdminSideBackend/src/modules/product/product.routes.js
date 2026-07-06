const express = require("express");
const authMiddleware = require("../../middleware/auth.middleware");
const {
  listProducts,
  getProduct,
  createProductHandler,
  updateProductHandler,
  deleteProductHandler,
} = require("./product.controller");

const router = express.Router();

router.use(authMiddleware);
router.get("/", listProducts);
router.get("/:id", getProduct);
router.post("/", createProductHandler);
router.put("/:id", updateProductHandler);
router.delete("/:id", deleteProductHandler);

module.exports = router;
