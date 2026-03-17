import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Navbar from "./components/Navbar"; // Yeni ve şık menümüzü içeri aktardık
import BookDetail from "./pages/BookDetail";

function App() {
  return (
    <BrowserRouter>
      {/* Tüm sayfalarda en üstte görünecek olan dinamik menümüz */}
      <Navbar />

      {/* Sayfaların Yükleneceği Alan (Biraz boşluk bırakarak şık durmasını sağladık) */}
      <div style={{ padding: "20px" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/books/:id" element={<BookDetail />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
