const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  let token;

  // Header'da 'Authorization: Bearer <token>' var mı bak
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1]; // Token'ı ayıkla
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // Şifreyi çöz
      req.user = decoded; // Kullanıcı ID'sini isteğe (req) ekle
      next(); // İşlem yapmaya devam et (Controller'a git)
    } catch (error) {
      res.status(401).json({ message: "Yetkisiz erişim, token geçersiz." });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Yetkisiz erişim, token bulunamadı." });
  }
};

module.exports = { protect };
