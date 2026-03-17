import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext"; // Hafıza merkezimize bağlandık

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Çıkış yapma işlemi
  const handleLogout = () => {
    logout(); // Hafızadaki token ve user'ı siler
    navigate("/login"); // Çıkış yapınca giriş ekranına yollar
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.logo}>
        <Link to="/" style={styles.logoLink}>
          📚 Kitap Rehberi
        </Link>
      </div>

      <div style={styles.navLinks}>
        {user ? (
          // Giriş Yapmış Kullanıcı (Token var)
          <>
            <span style={styles.welcomeText}>Merhaba, {user.name}</span>
            <Link to="/" style={styles.link}>
              Ana Sayfa
            </Link>
            <Link to="/profile" style={styles.link}>
              Profilim
            </Link>
            <button onClick={handleLogout} style={styles.logoutBtn}>
              Çıkış Yap
            </button>
          </>
        ) : (
          // Ziyaretçi (Token yok)
          <>
            <Link to="/" style={styles.link}>
              Ana Sayfa
            </Link>
            <Link to="/login" style={styles.link}>
              Giriş Yap
            </Link>
            <Link to="/register" style={styles.registerBtn}>
              Üye Ol
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

// Sayfaya şıklık katan CSS stillerimiz (Gölgeler, renkler, hizalamalar)
const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 40px",
    backgroundColor: "#2c3e50", // Gece mavisi/lacivert arka plan
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)", // Altına hafif bir gölge
    fontFamily: "sans-serif",
  },
  logoLink: {
    color: "white",
    textDecoration: "none",
    fontSize: "24px",
    fontWeight: "bold",
    letterSpacing: "1px",
  },
  navLinks: {
    display: "flex",
    gap: "25px",
    alignItems: "center",
  },
  link: {
    color: "#ecf0f1",
    textDecoration: "none",
    fontSize: "16px",
    fontWeight: "500",
    transition: "color 0.3s",
  },
  welcomeText: {
    color: "#f39c12", // Kullanıcı adını öne çıkaran turuncu/sarı vurgu
    fontWeight: "bold",
    marginRight: "10px",
  },
  logoutBtn: {
    backgroundColor: "#e74c3c", // Kırmızı çıkış butonu
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "background 0.3s",
  },
  registerBtn: {
    backgroundColor: "#3498db", // Mavi üye ol butonu
    color: "white",
    padding: "8px 16px",
    borderRadius: "6px",
    textDecoration: "none",
    fontWeight: "bold",
  },
};

export default Navbar;
