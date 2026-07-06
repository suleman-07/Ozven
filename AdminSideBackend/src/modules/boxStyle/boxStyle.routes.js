const express = require("express");
const authMiddleware = require("../../middleware/auth.middleware");
const {
  listBoxStyles,
  getBoxStyle,
  createBoxStyleHandler,
  updateBoxStyleHandler,
  deleteBoxStyleHandler,
} = require("./boxStyle.controller");

const router = express.Router();

router.use(authMiddleware);
router.get("/", listBoxStyles);
router.get("/:id", getBoxStyle);
router.post("/", createBoxStyleHandler);
router.put("/:id", updateBoxStyleHandler);
router.delete("/:id", deleteBoxStyleHandler);

module.exports = router;
