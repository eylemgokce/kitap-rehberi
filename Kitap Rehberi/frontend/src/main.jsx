import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx"; // 1. AuthProvider'ı içeri aktardık

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      {" "}
      {/* 2. Tüm uygulamayı yetki merkeziyle sarmaladık */}
      <App />
    </AuthProvider>
  </StrictMode>,
);
