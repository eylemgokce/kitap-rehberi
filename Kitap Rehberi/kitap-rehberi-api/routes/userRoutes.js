const express = require("express");
const router = express.Router();

// 1. getUserProfile fonksiyonunu da içeri aktarıyoruz
const {
  updateUser,
  addFavorite,
  getUserProfile,
} = require("../controllers/userController");
const { protect } = require("../middlewares/authMiddleware");

// 2. YENİ EKLENEN ROTA: Profil bilgilerini ve favorileri getir
router.get("/:id", protect, getUserProfile);

// Profil güncelleme
router.put("/:id", protect, updateUser);

// Favorilere ekleme
router.post("/:id/favorites/:bookId", protect, addFavorite);

module.exports = router;
