const express = require("express");
const router = express.Router();
const { updateUser, addFavorite } = require("../controllers/userController");
const { protect } = require("../middlewares/authMiddleware");

// Profil güncelleme
router.put("/:id", protect, updateUser);

// Favorilere ekleme
router.post("/:id/favorites/:bookId", protect, addFavorite);

module.exports = router;
