const express = require("express");
const authController = require("../controllers/auth");

const router = express.Router();

router.post("/api/auth/register", authController.postRegister);

router.post("/api/auth/login", authController.postLogin);

router.post("/api/auth/logout", authController.postLogout);

module.exports = router;
