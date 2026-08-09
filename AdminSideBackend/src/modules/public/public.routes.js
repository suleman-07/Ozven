const express = require("express");
const {
  listPublicCategories,
  listPublicProducts,
  getPublicProductBySlug,
  createPublicQuote,
} = require("./public.controller");

const router = express.Router();

router.get("/categories", listPublicCategories);
router.get("/products", listPublicProducts);
router.get("/products/slug/:slug", getPublicProductBySlug);
router.post("/quotes", createPublicQuote);

module.exports = router;
