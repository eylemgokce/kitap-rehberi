const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

// Rotaları içeri aktar
const authRoutes = require("./routes/authRoutes");
const bookRoutes = require("./routes/bookRoutes");
const commentRoutes = require("./routes/commentRoutes");
const userRoutes = require("./routes/userRoutes");

// .env dosyasındaki ayarları yükle
dotenv.config();

// UYGULAMA BURADA BAŞLIYOR ("app" değişkeni burada doğuyor)
const app = express();

// Middleware'ler
app.use(cors());
app.use(express.json());
app.use("/comments", commentRoutes);
app.use("/users", userRoutes);

// MongoDB Bağlantısı
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB veritabanına başarıyla bağlanıldı! 📦"))
  .catch((err) => console.error("MongoDB bağlantı hatası:", err));

// ROTALARI KULLAN (Uygulamaya bağlama işlemi app doğduktan sonra yapılır)
app.use("/auth", authRoutes);
app.use("/books", bookRoutes); // Hatalı yerden alıp buraya, olması gereken yere taşıdık

// Test Rotası
app.get("/", (req, res) => {
  res.send("Kitap Rehberi API çalışıyor! 🚀");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda başarıyla başlatıldı.`);
});
