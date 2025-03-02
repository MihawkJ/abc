const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");

// Yeni post oluşturma endpoint'i
router.post("/", postController.createPost);

module.exports = router;
