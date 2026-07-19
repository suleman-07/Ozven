const express = require("express");
const authMiddleware = require("../../middleware/auth.middleware");
const {
  listCategories,
  getCategory,
  createCategoryHandler,
  updateCategoryHandler,
  deleteCategoryHandler,
  createSubcategoryHandler,
  updateSubcategoryHandler,
  deleteSubcategoryHandler,
} = require("./category.controller");

const router = express.Router();

router.use(authMiddleware);
router.get("/", listCategories);
router.get("/:id", getCategory);
router.post("/", createCategoryHandler);
router.put("/:id", updateCategoryHandler);
router.delete("/:id", deleteCategoryHandler);
router.post("/:categoryId/subcategories", createSubcategoryHandler);
router.put("/:categoryId/subcategories/:subcategoryId", updateSubcategoryHandler);
router.delete("/:categoryId/subcategories/:subcategoryId", deleteSubcategoryHandler);

module.exports = router;
