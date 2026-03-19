const User = require("../models/User");

// 1. Profil ve Favorileri Getirme (GET /users/:id) - YENİ EKLENDİ!
const getUserProfile = async (req, res) => {
  try {
    // .populate("favorites") sayesinde sadece ID'ler değil, kitapların tüm bilgileri gelir
    const user = await User.findById(req.params.id).populate("favorites");

    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı." });
    }

    res.status(200).json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Profil bilgileri getirilirken hata oluştu." });
  }
};

// 2. Profil Güncelleme (PUT /users/:id)
const updateUser = async (req, res) => {
  try {
    // Güvenlik: Sadece kendi profilini güncelleyebilir
    if (req.user.id !== req.params.id) {
      return res.status(401).json({ message: "Bu işlem için yetkiniz yok." });
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).select("-password");
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Profil güncellenirken hata oluştu." });
  }
};

// 3. Favorilere Kitap Ekleme (POST /users/:id/favorites/:bookId)
const addFavorite = async (req, res) => {
  try {
    const { id, bookId } = req.params;

    if (req.user.id !== id) {
      return res.status(401).json({ message: "Yetkisiz işlem." });
    }

    const user = await User.findById(id);

    // Kitap zaten favorilerde mi kontrol et
    if (user.favorites.includes(bookId)) {
      return res.status(400).json({ message: "Kitap zaten favorilerinizde." });
    }

    user.favorites.push(bookId);
    await user.save();

    res.status(200).json({
      message: "Kitap favorilere eklendi.",
      favorites: user.favorites,
    });
  } catch (error) {
    res.status(500).json({ message: "Favorilere eklenirken hata oluştu." });
  }
};

// En alta yeni fonksiyonumuzu da dışa aktarması için ekledik!
module.exports = { updateUser, addFavorite, getUserProfile };
