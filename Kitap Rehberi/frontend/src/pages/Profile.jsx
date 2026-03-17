import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

const Profile = () => {
  const { user, login } = useContext(AuthContext); // login fonksiyonunu state'i güncellemek için kullanacağız
  const [favorites, setFavorites] = useState([]);
  const [bio, setBio] = useState(user?.bio || "");
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
      // Backend'den güncel kullanıcı bilgilerini ve favorilerini çekiyoruz
      const response = await api.get(`/users/${user._id || user.id}`);
      setFavorites(response.data.favorites || []);
      setBio(response.data.bio || "");
    } catch (err) {
      console.error("Profil yüklenirken hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put(`/users/${user._id || user.id}`, {
        name: user.name,
        email: user.email,
        bio: bio,
      });

      // Başarılı olursa merkezi hafızayı (Context) de güncelle
      login(response.data, localStorage.getItem("token"));
      setMessage("✅ Profiliniz başarıyla güncellendi!");
      setTimeout(() => setMessage(""), 3000); // 3 saniye sonra mesajı gizle
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
      {/* ÜST KISIM: KULLANICI BİLGİLERİ VE BİO GÜNCELLEME */}
      <div style={styles.profileCard}>
        <h2>👤 Profil Bilgilerim</h2>
        <p>
          <strong>Ad Soyad:</strong> {user.name}
        </p>
        <p>
          <strong>E-posta:</strong> {user.email}
        </p>

        <form onSubmit={handleUpdateProfile} style={styles.bioForm}>
          <label
            style={{
              fontWeight: "bold",
              display: "block",
              marginBottom: "5px",
            }}
          >
            Hakkımda:
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Kendinizden bahsedin..."
            style={styles.textarea}
          />
          <button type="submit" style={styles.saveBtn}>
            Bilgileri Güncelle
          </button>
        </form>
        {message && <p style={styles.successMsg}>{message}</p>}
      </div>

      <hr
        style={{ margin: "40px 0", border: "0", borderTop: "1px solid #ddd" }}
      />

      {/* ALT KISIM: FAVORİ KİTAPLAR LİSTESİ */}
      <div style={styles.favoritesSection}>
        <h2>❤️ Favori Kitaplarım ({favorites.length})</h2>
        {loading ? (
          <p>Yükleniyor...</p>
        ) : favorites.length === 0 ? (
          <p>Henüz favorilere kitap eklemediniz.</p>
        ) : (
          <div style={styles.grid}>
            {favorites.map((book) => (
              <div key={book._id} style={styles.favCard}>
                <h4>{book.title}</h4>
                <p style={{ fontSize: "14px", color: "#666" }}>{book.author}</p>
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
  bioForm: { marginTop: "20px" },
  textarea: {
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    minHeight: "80px",
    marginBottom: "10px",
    boxSizing: "border-box",
  },
  saveBtn: {
    backgroundColor: "#3498db",
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
    padding: "15px",
    borderRadius: "10px",
    border: "1px solid #eee",
    boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
    textAlign: "center",
  },
  viewLink: {
    display: "inline-block",
    marginTop: "10px",
    color: "#3498db",
    textDecoration: "none",
    fontWeight: "bold",
    fontSize: "14px",
  },
};

export default Profile;
