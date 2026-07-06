const express = require("express");
const authMiddleware = require("../../middleware/auth.middleware");
const { listQuotes, getQuote, createQuoteHandler, deleteQuoteHandler } = require("./quote.controller");

const router = express.Router();

router.post("/", createQuoteHandler);
router.use(authMiddleware);
router.get("/", listQuotes);
router.get("/:id", getQuote);
router.delete("/:id", deleteQuoteHandler);

module.exports = router;
