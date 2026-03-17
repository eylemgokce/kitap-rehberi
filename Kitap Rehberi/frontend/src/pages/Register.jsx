import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios"; // Kurduğumuz köprü

const Register = () => {
  // Form verilerini tutacağımız state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // Hata mesajlarını ekranda göstermek için
  const [error, setError] = useState("");

  // Başarılı kayıttan sonra başka sayfaya yönlendirmek için
  const navigate = useNavigate();

  // Inputlara yazı yazıldıkça state'i güncelleyen fonksiyon
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Form gönderildiğinde (Submit) çalışacak fonksiyon
  const handleSubmit = async (e) => {
    e.preventDefault(); // Sayfanın yenilenmesini engeller
    setError(""); // Yeni denemede eski hatayı temizle

    try {
      // Backend'e POST isteği atıyoruz
      await api.post("/auth/register", formData);

      // Başarılı olursa kullanıcıyı Giriş Yap sayfasına yönlendiriyoruz
      navigate("/login");
    } catch (err) {
      // Backend'den gelen hata mesajını yakalayıp ekrana basıyoruz
      setError(err.response?.data?.message || "Kayıt işlemi başarısız oldu.");
    }
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "50px auto",
        textAlign: "center",
        fontFamily: "sans-serif",
      }}
    >
      <h2>📝 Üye Ol</h2>

      {/* Eğer bir hata varsa kırmızı yazıyla göster */}
      {error && (
        <p
          style={{
            color: "red",
            backgroundColor: "#ffe6e6",
            padding: "10px",
            borderRadius: "5px",
          }}
        >
          {error}
        </p>
      )}

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "15px",
          marginTop: "20px",
        }}
      >
        <input
          type="text"
          name="name"
          placeholder="Adınız Soyadınız"
          value={formData.name}
          onChange={handleChange}
          required
          style={{
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
        <input
          type="email"
          name="email"
          placeholder="E-posta Adresiniz"
          value={formData.email}
          onChange={handleChange}
          required
          style={{
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
        <input
          type="password"
          name="password"
          placeholder="Şifreniz"
          value={formData.password}
          onChange={handleChange}
          required
          style={{
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "12px",
            background: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Kayıt Ol
        </button>
      </form>
    </div>
  );
};

export default Register;
