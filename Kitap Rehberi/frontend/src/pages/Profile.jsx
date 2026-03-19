import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

const Profile = () => {
  const { user, login } = useContext(AuthContext);
  const [favorites, setFavorites] = useState([]);

  // İki farklı state kullanıyoruz:
  // 1. savedBio: Sadece ekranda "Bio:" diye göstermek için (Veritabanından gelen net bilgi)
  const [savedBio, setSavedBio] = useState("");
  // 2. formBio: Input'un içinde kullanıcının o an yazdığı (henüz kaydetmediği) metin
  const [formBio, setFormBio] = useState("");

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const userId = user._id || user.id;
      const response = await api.get(`/users/${userId}`);

      // Gelen verileri alıyoruz
      setFavorites(response.data.favorites || []);

      // Hem görüntülenen bio'yu hem de input içindeki bio'yu eşitliyoruz
      const userBio = response.data.bio || "Henüz kendinizden bahsetmediniz.";
      setSavedBio(userBio);
      setFormBio(response.data.bio || "");
    } catch (err) {
      console.error("Profil bilgileri çekilemedi.", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const userId = user._id || user.id;
      const response = await api.put(`/users/${userId}`, {
        name: user.name,
        email: user.email,
        bio: formBio, // Inputtaki güncel yazıyı gönder
      });

      login(response.data, localStorage.getItem("token"));

      // Başarılı olunca güncel veriyi tekrar çekip ekrana yansıtıyoruz
      await fetchUserProfile();

      setMessage("✅ Bio başarıyla güncellendi!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      alert("Profil güncellenirken bir hata oluştu.");
    }
  };

  if (!user)
    return (
      <h2 style={{ textAlign: "center", marginTop: "50px" }}>
        Lütfen önce giriş yapın.
      </h2>
    );

  return (
    <div style={styles.container}>
      {/* KULLANICI BİLGİLERİ */}
      <div style={styles.profileCard}>
        <h2>👤 Profil Bilgilerim</h2>
        <p>
          <strong>Ad Soyad:</strong> {user.name}
        </p>
        <p>
          <strong>E-posta:</strong> {user.email}
        </p>

        {/* İSTEDİĞİN ÖZELLİK: Sabit Bio Gösterim Alanı */}
        <div style={styles.bioDisplayBox}>
          <strong style={{ color: "#2c3e50" }}>Mevcut Bio:</strong>
          <p style={{ marginTop: "8px", fontStyle: "italic", color: "#555" }}>
            {savedBio}
          </p>
        </div>

        {/* BİO GÜNCELLEME FORMU */}
        <form onSubmit={handleUpdateProfile} style={styles.bioForm}>
          <label
            style={{
              fontWeight: "bold",
              display: "block",
              marginBottom: "5px",
              fontSize: "14px",
            }}
          >
            Bio'yu Değiştir:
          </label>
          <textarea
            value={formBio}
            onChange={(e) => setFormBio(e.target.value)}
            placeholder="Kendinizden bahsedin..."
            style={styles.textarea}
          />
          <button type="submit" style={styles.saveBtn}>
            Kaydet
          </button>
        </form>
        {message && <p style={styles.successMsg}>{message}</p>}
      </div>

      <hr
        style={{ margin: "40px 0", border: "0", borderTop: "1px solid #ddd" }}
      />

      {/* FAVORİ KİTAPLAR LİSTESİ */}
      <div style={styles.favoritesSection}>
        <h2>❤️ Favori Kitaplarım ({favorites.length})</h2>
        {loading ? (
          <p>Yükleniyor...</p>
        ) : favorites.length === 0 ? (
          <p>
            Henüz favorilere kitap eklemediniz. Ana sayfadan kitap
            keşfedebilirsiniz!
          </p>
        ) : (
          <div style={styles.grid}>
            {favorites.map((book) => (
              <div key={book._id || Math.random()} style={styles.favCard}>
                <h4 style={{ margin: "0 0 10px 0" }}>
                  {book.title || "İsimsiz Kitap"}
                </h4>
                <p
                  style={{
                    fontSize: "14px",
                    color: "#666",
                    margin: "0 0 15px 0",
                  }}
                >
                  {book.author}
                </p>
                <Link to={`/books/${book._id}`} style={styles.viewLink}>
                  İncele
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Güncellenmiş CSS Stilleri
const styles = {
  container: {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "20px",
    fontFamily: "sans-serif",
  },
  profileCard: {
    backgroundColor: "#f8f9fa",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  },

  // Yeni eklenen Bio Gösterim Kutusunun tasarımı
  bioDisplayBox: {
    backgroundColor: "#e9ecef",
    padding: "15px",
    borderRadius: "8px",
    marginTop: "15px",
    borderLeft: "4px solid #3498db",
  },

  bioForm: { marginTop: "20px" },
  textarea: {
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    minHeight: "60px",
    marginBottom: "10px",
    boxSizing: "border-box",
  },
  saveBtn: {
    backgroundColor: "#2ecc71",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  successMsg: { color: "#27ae60", marginTop: "10px", fontWeight: "bold" },
  favoritesSection: { marginTop: "20px" },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "20px",
  },
  favCard: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "10px",
    border: "1px solid #eee",
    boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
    textAlign: "center",
  },
  viewLink: {
    display: "inline-block",
    backgroundColor: "#3498db",
    color: "white",
    padding: "8px 15px",
    borderRadius: "5px",
    textDecoration: "none",
    fontWeight: "bold",
    fontSize: "14px",
  },
};

export default Profile;
