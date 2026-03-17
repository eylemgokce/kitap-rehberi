import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

const BookDetail = () => {
  const { id } = useParams(); // URL'den kitabın ID'sini yakalıyoruz
  const navigate = useNavigate();
  const { user } = useContext(AuthContext); // Hafızadan giriş yapan kullanıcıyı alıyoruz

  const [book, setBook] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Yorum formu için state'ler
  const [commentText, setCommentText] = useState("");
  const [commentRating, setCommentRating] = useState(5);

  // Sayfa açıldığında hem kitabı hem yorumları getir
  useEffect(() => {
    fetchBookDetails();
  }, [id]);

  const fetchBookDetails = async () => {
    try {
      setLoading(true);
      // Kitap bilgilerini çek
      const bookRes = await api.get(`/books/${id}`);
      setBook(bookRes.data);

      // Bu kitaba ait yorumları çek
      const commentsRes = await api.get(`/comments/${id}`);
      setComments(commentsRes.data);

      setError("");
    } catch (err) {
      setError("Kitap detayları yüklenemedi.");
    } finally {
      setLoading(false);
    }
  };

  // Favorilere Ekleme Fonksiyonu
  const handleAddFavorite = async () => {
    if (!user) {
      alert("Favorilere eklemek için önce giriş yapmalısınız!");
      navigate("/login");
      return;
    }

    try {
      await api.post(`/users/${user._id || user.id}/favorites/${id}`);
      alert("✅ Kitap favorilerinize eklendi!");
    } catch (err) {
      alert(
        err.response?.data?.message || "Favorilere eklenirken bir hata oluştu.",
      );
    }
  };

  // Yorum Ekleme Fonksiyonu
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!user) return alert("Yorum yapmak için giriş yapmalısınız.");

    try {
      await api.post("/comments", {
        bookId: id,
        text: commentText,
        rating: Number(commentRating),
      });

      setCommentText(""); // Formu temizle
      fetchBookDetails(); // Yorumları tekrar çekip listeyi güncelle
    } catch (err) {
      alert("Yorum eklenirken hata oluştu.");
    }
  };

  // Yorum Silme Fonksiyonu
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Bu yorumu silmek istediğinize emin misiniz?")) return;

    try {
      await api.delete(`/comments/${commentId}`);
      fetchBookDetails(); // Listeyi güncelle
    } catch (err) {
      alert("Yorum silinirken hata oluştu.");
    }
  };

  if (loading)
    return (
      <h2 style={{ textAlign: "center", marginTop: "50px" }}>
        Kitap Yükleniyor... ⏳
      </h2>
    );
  if (error || !book)
    return <h2 style={{ color: "red", textAlign: "center" }}>{error}</h2>;

  return (
    <div style={styles.container}>
      {/* KİTAP BİLGİLERİ KARTI */}
      <div style={styles.bookCard}>
        <div style={styles.bookHeader}>
          <h1 style={styles.title}>{book.title}</h1>
          {user && (
            <button onClick={handleAddFavorite} style={styles.favBtn}>
              ❤️ Favorilere Ekle
            </button>
          )}
        </div>
        <h3 style={styles.author}>Yazar: {book.author}</h3>
        <p style={styles.description}>{book.description}</p>
      </div>

      {/* YORUMLAR BÖLÜMÜ */}
      <div style={styles.commentsSection}>
        <h2>💬 Yorumlar ({comments.length})</h2>

        {/* Yorum Ekleme Formu (Sadece Giriş Yapanlara Göster) */}
        {user ? (
          <form onSubmit={handleAddComment} style={styles.commentForm}>
            <textarea
              placeholder="Bu kitap hakkında ne düşünüyorsunuz?"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              required
              style={styles.textarea}
              rows="3"
            />
            <div style={styles.formFooter}>
              <label>
                Puanınız:
                <select
                  value={commentRating}
                  onChange={(e) => setCommentRating(e.target.value)}
                  style={styles.select}
                >
                  <option value="5">⭐⭐⭐⭐⭐ (5)</option>
                  <option value="4">⭐⭐⭐⭐ (4)</option>
                  <option value="3">⭐⭐⭐ (3)</option>
                  <option value="2">⭐⭐ (2)</option>
                  <option value="1">⭐ (1)</option>
                </select>
              </label>
              <button type="submit" style={styles.submitBtn}>
                Yorum Gönder
              </button>
            </div>
          </form>
        ) : (
          <p style={styles.loginWarning}>
            Yorum yapmak için{" "}
            <span
              style={{ color: "blue", cursor: "pointer" }}
              onClick={() => navigate("/login")}
            >
              giriş yapmalısınız
            </span>
            .
          </p>
        )}

        {/* Yorum Listesi */}
        <div style={styles.commentsList}>
          {comments.length === 0 ? (
            <p>İlk yorumu siz yapın!</p>
          ) : (
            comments.map((comment) => (
              <div key={comment._id} style={styles.commentBox}>
                <div style={styles.commentHeader}>
                  <strong>{comment.user?.name || "Bir Kullanıcı"}</strong>
                  <span>{"⭐".repeat(comment.rating)}</span>
                </div>
                <p style={styles.commentText}>{comment.text}</p>

                {/* Silme Butonu (Sadece yorumu yazan kişi görebilir) */}
                {user &&
                  (user._id === comment.user?._id ||
                    user.id === comment.user?._id) && (
                    <button
                      onClick={() => handleDeleteComment(comment._id)}
                      style={styles.deleteBtn}
                    >
                      🗑️ Sil
                    </button>
                  )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// Sayfanın CSS Stilleri
const styles = {
  container: {
    maxWidth: "800px",
    margin: "0 auto",
    fontFamily: "sans-serif",
    padding: "20px",
  },
  bookCard: {
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    marginBottom: "40px",
  },
  bookHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderBottom: "2px solid #eee",
    paddingBottom: "15px",
    marginBottom: "15px",
  },
  title: { fontSize: "28px", color: "#2c3e50", margin: 0 },
  favBtn: {
    backgroundColor: "#e74c3c",
    color: "white",
    border: "none",
    padding: "10px 15px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  author: { color: "#7f8c8d", fontSize: "18px", marginBottom: "15px" },
  description: { fontSize: "16px", lineHeight: "1.6", color: "#34495e" },
  commentsSection: {
    backgroundColor: "#f9f9f9",
    padding: "20px",
    borderRadius: "10px",
  },
  commentForm: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginBottom: "30px",
    backgroundColor: "#fff",
    padding: "15px",
    borderRadius: "8px",
  },
  textarea: {
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    resize: "vertical",
  },
  formFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  select: { marginLeft: "10px", padding: "5px" },
  submitBtn: {
    backgroundColor: "#2ecc71",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  loginWarning: {
    backgroundColor: "#fff3cd",
    color: "#856404",
    padding: "10px",
    borderRadius: "5px",
    textAlign: "center",
  },
  commentsList: { display: "flex", flexDirection: "column", gap: "15px" },
  commentBox: {
    backgroundColor: "#fff",
    padding: "15px",
    borderRadius: "8px",
    borderLeft: "4px solid #3498db",
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
  },
  commentHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px",
    fontSize: "14px",
  },
  commentText: { color: "#555", margin: "0 0 10px 0" },
  deleteBtn: {
    backgroundColor: "transparent",
    color: "red",
    border: "none",
    cursor: "pointer",
    fontSize: "12px",
    float: "right",
  },
};

export default BookDetail;
