const express = require("express");
const authMiddleware = require("../../middleware/auth.middleware");
const { login, getProfile } = require("./auth.controller");

const router = express.Router();

router.post("/login", login);
router.get("/profile", authMiddleware, getProfile);

module.exports = router;
