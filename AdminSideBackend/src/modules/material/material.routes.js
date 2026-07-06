const express = require("express");
const authMiddleware = require("../../middleware/auth.middleware");
const {
  listMaterials,
  getMaterial,
  createMaterialHandler,
  updateMaterialHandler,
  deleteMaterialHandler,
} = require("./material.controller");

const router = express.Router();

router.use(authMiddleware);
router.get("/", listMaterials);
router.get("/:id", getMaterial);
router.post("/", createMaterialHandler);
router.put("/:id", updateMaterialHandler);
router.delete("/:id", deleteMaterialHandler);

module.exports = router;
