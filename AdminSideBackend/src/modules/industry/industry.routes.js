const express = require("express");
const authMiddleware = require("../../middleware/auth.middleware");
const {
  listIndustries,
  getIndustry,
  createIndustryHandler,
  updateIndustryHandler,
  deleteIndustryHandler,
} = require("./industry.controller");

const router = express.Router();

router.use(authMiddleware);
router.get("/", listIndustries);
router.get("/:id", getIndustry);
router.post("/", createIndustryHandler);
router.put("/:id", updateIndustryHandler);
router.delete("/:id", deleteIndustryHandler);

module.exports = router;
