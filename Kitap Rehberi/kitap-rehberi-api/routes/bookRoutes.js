const express = require("express");
const router = express.Router();
const {
  getBooks,
  getBookById,
  searchBooks, // YENİ: Arama fonksiyonunu içeri aldık
  createBook,
  updateBook,
  deleteBook,
} = require("../controllers/bookController");

// 1. Arama Rotası (Öncelikli olması için en üste yazdık)
// URL: /books/search?q=kelime
router.get("/search", searchBooks);

// 2. Ana rotalar (/books)
router
  .route("/")
  .get(getBooks) // Tüm kitapları listele
  .post(createBook); // Yeni kitap ekle

// 3. ID gerektiren rotalar (/books/:id)
router
  .route("/:id")
  .get(getBookById) // Tek kitap detayını getir
  .put(updateBook) // Kitabı güncelle
  .delete(deleteBook); // Kitabı sil

module.exports = router;
