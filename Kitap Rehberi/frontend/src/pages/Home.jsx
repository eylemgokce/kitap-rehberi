import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios"; // Backend köprümüz

const Home = () => {
  const [books, setBooks] = useState([]); // Kitapları tutacağımız liste
  const [loading, setLoading] = useState(true); // Yükleniyor animasyonu için
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // Arama çubuğundaki yazı

  // Sayfa ilk yüklendiğinde tüm kitapları getir
  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await api.get("/books");
      setBooks(response.data);
      setError("");
    } catch (err) {
      setError("Kitaplar yüklenirken bir sorun oluştu.");
    } finally {
      setLoading(false);
    }
  };

  // Arama formunu gönderdiğimizde çalışacak fonksiyon
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      return fetchBooks(); // Kutu boşsa tüm kitapları geri getir
    }

    try {
      setLoading(true);
      // Backend'deki o özel arama rotamıza (search?q=...) istek atıyoruz
      const response = await api.get(`/books/search?q=${searchQuery}`);
      setBooks(response.data);
      setError("");
    } catch (err) {
      setError("Arama sırasında bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Üst Kısım: Başlık ve Arama Çubuğu */}
      <div style={styles.header}>
        <h1 style={styles.title}>Kitapları Keşfet</h1>
        <form onSubmit={handleSearch} style={styles.searchForm}>
          <input
            type="text"
            placeholder="Kitap adı veya yazar ara (Örn: Selçuklu)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />
          <button type="submit" style={styles.searchBtn}>
            Ara
          </button>
        </form>
      </div>

      {/* Durum Mesajları */}
      {loading && (
        <p style={{ textAlign: "center", fontSize: "18px" }}>
          Kitaplar yükleniyor... ⏳
        </p>
      )}
      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
      {!loading && books.length === 0 && (
        <p style={{ textAlign: "center" }}>Aramanıza uygun kitap bulunamadı.</p>
      )}

      {/* Kitapların Dizildiği Grid (Izgara) Yapısı */}
      <div style={styles.grid}>
        {books.map((book) => (
          <div key={book._id} style={styles.card}>
            <h3 style={styles.bookTitle}>{book.title}</h3>
            <p style={styles.bookAuthor}>
              <strong>Yazar:</strong> {book.author}
            </p>
            <p style={styles.bookDesc}>
              {/* Açıklama çok uzunsa ilk 100 karakteri göster */}
              {book.description.substring(0, 100)}...
            </p>
            {/* Şimdilik boş bir link, bir sonraki adımda detay sayfasını yapacağız */}
            <Link to={`/books/${book._id}`} style={styles.detailBtn}>
              Detayları Gör
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

// Sayfamızın CSS Ayarları
const styles = {
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    fontFamily: "sans-serif",
  },
  header: {
    textAlign: "center",
    marginBottom: "40px",
    padding: "40px 0",
    backgroundColor: "#f8f9fa",
    borderRadius: "10px",
  },
  title: {
    fontSize: "32px",
    color: "#2c3e50",
    marginBottom: "20px",
  },
  searchForm: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
  },
  searchInput: {
    padding: "12px 20px",
    width: "60%",
    maxWidth: "400px",
    fontSize: "16px",
    borderRadius: "25px",
    border: "1px solid #ddd",
    outline: "none",
  },
  searchBtn: {
    padding: "12px 25px",
    fontSize: "16px",
    backgroundColor: "#3498db",
    color: "white",
    border: "none",
    borderRadius: "25px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", // Ekran boyutuna göre yan yana dizer
    gap: "25px",
    padding: "20px",
  },
  card: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    transition: "transform 0.2s",
  },
  bookTitle: {
    fontSize: "20px",
    color: "#2c3e50",
    margin: "0 0 10px 0",
  },
  bookAuthor: {
    color: "#7f8c8d",
    marginBottom: "15px",
  },
  bookDesc: {
    color: "#555",
    lineHeight: "1.5",
    flexGrow: 1, // Butonu her zaman en alta iter
  },
  detailBtn: {
    marginTop: "20px",
    padding: "10px",
    backgroundColor: "#2ecc71",
    color: "white",
    textAlign: "center",
    textDecoration: "none",
    borderRadius: "5px",
    fontWeight: "bold",
  },
};

export default Home;
