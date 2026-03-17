import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext"; // Hafıza merkezimizi çağırdık

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // Context'in içindeki login fonksiyonunu çekiyoruz

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Backend'e giriş isteği atıyoruz
      const response = await api.post("/auth/login", formData);

      // BÜYÜK AN: Backend'den dönen kullanıcı bilgisi ve Token'ı hafızaya kaydediyoruz!
      login(response.data.user, response.data.token);

      // Başarılı girişten sonra kullanıcıyı Ana Sayfaya yönlendiriyoruz
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "E-posta veya şifre hatalı.");
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
      <h2>🔑 Giriş Yap</h2>

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
            background: "#2196F3",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Giriş Yap
        </button>
      </form>
    </div>
  );
};

export default Login;
