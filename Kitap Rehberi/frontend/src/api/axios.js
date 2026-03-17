import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000", // Backend adresimiz
});

// Eğer hafızada (localStorage) bir token varsa, bunu her isteğin başlığına (Headers) otomatik ekle
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
