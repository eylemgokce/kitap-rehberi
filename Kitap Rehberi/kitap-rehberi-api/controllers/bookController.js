const Book = require("../models/Book");

// 1. Tüm Kitapları Getir (GET)
const getBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: "Kitaplar getirilirken bir hata oluştu." });
  }
};

// 2. Tek Bir Kitap Getir (GET)
const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Kitap bulunamadı." });
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: "Kitap getirilirken hata oluştu." });
  }
};

// YENİ: 3. Kitap Arama (GET /books/search?q=kelime)
const searchBooks = async (req, res) => {
  try {
    const { q } = req.query; // URL'deki ?q= kısmını alır
    const books = await Book.find({
      $or: [
        { title: { $regex: q, $options: "i" } }, // 'i' harf büyüklüğünü önemsemez
        { author: { $regex: q, $options: "i" } },
      ],
    });
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: "Arama sırasında hata oluştu." });
  }
};

// 4. Yeni Kitap Ekle (POST)
const createBook = async (req, res) => {
  try {
    const { title, author, description } = req.body;
    const newBook = await Book.create({ title, author, description });
    res.status(201).json(newBook);
  } catch (error) {
    res.status(500).json({ message: "Kitap eklenirken bir hata oluştu." });
  }
};

// 5. Kitap Güncelle (PUT)
const updateBook = async (req, res) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedBook)
      return res
        .status(404)
        .json({ message: "Güncellenecek kitap bulunamadı." });
    res.status(200).json(updatedBook);
  } catch (error) {
    res.status(500).json({ message: "Kitap güncellenirken hata oluştu." });
  }
};

// 6. Kitap Sil (DELETE)
const deleteBook = async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    if (!deletedBook)
      return res.status(404).json({ message: "Silinecek kitap bulunamadı." });
    res.status(200).json({ message: "Kitap başarıyla silindi." });
  } catch (error) {
    res.status(500).json({ message: "Kitap silinirken hata oluştu." });
  }
};

// BURASI ÇOK ÖNEMLİ: Yeni fonksiyonu listeye ekledik!
module.exports = {
  getBooks,
  getBookById,
  searchBooks, // <-- Artık dışarıdan erişilebilir
  createBook,
  updateBook,
  deleteBook,
};
