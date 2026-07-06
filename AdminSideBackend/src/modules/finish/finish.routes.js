const express = require("express");
const authMiddleware = require("../../middleware/auth.middleware");
const {
  listFinishes,
  getFinish,
  createFinishHandler,
  updateFinishHandler,
  deleteFinishHandler,
} = require("./finish.controller");

const router = express.Router();

router.use(authMiddleware);
router.get("/", listFinishes);
router.get("/:id", getFinish);
router.post("/", createFinishHandler);
router.put("/:id", updateFinishHandler);
router.delete("/:id", deleteFinishHandler);

module.exports = router;
