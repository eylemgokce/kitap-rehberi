const express = require("express");
const router = express.Router();
const {
  addComment,
  getBookComments,
  deleteComment, // Burayı kontrol et
} = require("../controllers/commentController");
const { protect } = require("../middlewares/authMiddleware");

// 1. Yorum Ekleme
router.post("/", protect, addComment);

// 2. Yorumları Getir
router.get("/:bookId", getBookComments);

// 3. Yorum Silme (Hata veren satır burasıydı)
// Eğer deleteComment yukarıda doğru import edilmediyse bu hata patlar
router.delete("/:commentId", protect, deleteComment);

module.exports = router;
