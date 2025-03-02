const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");
const { followUser } = require("../controllers/userController");

// Kullanıcıyı takip et / takibi bırak
router.post("/follow/:id", verifyToken, followUser);

module.exports = router;
