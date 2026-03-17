const Comment = require("../models/Comment");

// 1. Bir Kitaba Yorum Ekle (POST)
const addComment = async (req, res) => {
  try {
    const bookId = req.params.id || req.body.bookId;
    const { text, rating } = req.body;
    const userId = req.user.id;

    const newComment = await Comment.create({
      userId,
      bookId,
      text,
      rating,
    });

    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ message: "Yorum eklenirken hata oluştu." });
  }
};

// 2. Bir Kitabın Tüm Yorumlarını Getir (GET)
const getBookComments = async (req, res) => {
  try {
    const comments = await Comment.find({
      bookId: req.params.bookId || req.params.id,
    }).populate("userId", "name");

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: "Yorumlar getirilemedi." });
  }
};

// 3. Yorum Silme (DELETE) - HATA BURADAYDI, FONKSİYONUN BAŞINI KONTROL ET
const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ message: "Yorum bulunamadı." });
    }

    if (comment.userId.toString() !== req.user.id) {
      return res
        .status(401)
        .json({ message: "Sadece kendi yorumunuzu silebilirsiniz." });
    }

    await comment.deleteOne();
    res.status(200).json({ message: "Yorum başarıyla silindi." });
  } catch (error) {
    res.status(500).json({ message: "Yorum silinirken hata oluştu." });
  }
};

// DIŞA AKTARMA: İsimlerin yukarıdaki const isimleriyle aynı olması şart!
module.exports = {
  addComment,
  getBookComments,
  deleteComment,
};
