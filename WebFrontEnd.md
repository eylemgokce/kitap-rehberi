# Web Frontend Görev Dağılımı

**Web Frontend Adresi:** [frontend.yazmuh.com](https://frontend.yazmuh.com)

# 💻 Web Frontend Mimarisi ve Görev Dağılımı

**Proje Adı:** Kitap Rehberi (Book Guide)  
**Frontend Altyapısı:** React.js (Vite)
**Backend Altyapısı:** Node.js
**DataBase Altyapısı:** MongoDB

Bu dokümanda, Kitap Rehberi web uygulamasının kullanıcı arayüzü (UI), kullanıcı deneyimi (UX) standartları ve geliştirme prensipleri listelenmektedir.

---

## 👥 Geliştirici Ekip ve Görevler

1. [Eylem Gökçe'nin Web Frontend Görevleri](Eylem-Gokce/Eylem-Gokce-Web-Frontend-Gorevleri.md)
   - React (Vite) projesinin kurulumu ve klasör mimarisinin oluşturulması.
   - `react-router-dom` ile sayfa yönlendirmelerinin (Routing) yapılması.
   - Context API kullanılarak `AuthContext` (Merkezi Kimlik Doğrulama) sisteminin inşası.
   - Axios instance ve Interceptor'ların yazılarak Backend (Node.js) ile iletişimin sağlanması.
   - Kitap listeleme, arama, detay görüntüleme, yorum yapma ve profil sayfalarının UI/UX tasarımı ve API entegrasyonu.

---

## ⚙️ Web Frontend Prensipleri ve Kullanılan Teknolojiler

### 1. Responsive (Duyarlı) Tasarım

- **Esnek Yapılar:** Ekran boyutlarına göre otomatik şekil alan CSS Grid ve Flexbox mimarisi kullanılmıştır.
- **Kart Tasarımları:** Kitapların yan yana dizilimi `grid-template-columns: repeat(auto-fill, minmax(...))` ile her cihaza (Mobil/Tablet/Desktop) uyumlu hale getirilmiştir.
- **Kullanıcı Dostu UI:** Butonlar ve inputlar dokunmatik ekranlara uygun boyutlarda tasarlanmıştır.

### 2. Tasarım Sistemi (UI/UX)

- **Stil Yönetimi:** JavaScript tabanlı Custom CSS (Inline & Style Objects) kullanılarak bileşen bazlı (component-scoped) bir stil mimarisi oluşturulmuştur.
- **Renk Paleti:** Göz yormayan, kontrast oranlarına dikkat edilmiş kurumsal renkler (#3498db mavi, #2ecc71 yeşil, #e74c3c kırmızı) tercih edilmiştir.
- **Geri Bildirimler (Feedback):** İşlem başarı/hata durumlarında anlık UI bildirimleri (örneğin "✅ Bio başarıyla güncellendi!") eklenmiştir.

### 3. State Management (Durum Yönetimi)

- **Global State (Merkezi Hafıza):** Kullanıcı oturum bilgileri (User ve Token) için dış kütüphanelere (Redux vb.) bağımlı kalmadan React'ın yerleşik **Context API** özelliği kullanılmıştır.
- **Local State:** Bileşen içerisindeki anlık veriler (form girdileri, yükleme durumları) `useState` ve `useEffect` hook'ları ile yönetilmiştir.
- **Optimistic UI:** Veri güncellendiğinde (Örn: Profil düzenleme), sayfa yenilenmeden verinin anında ekrana yansıması sağlanmıştır.

### 4. API Entegrasyonu ve Güvenlik

- **HTTP İstemcisi:** Backend istekleri için **Axios** kullanılmıştır.
- **Request Interceptor:** `api/axios.js` dosyası oluşturularak, LocalStorage'daki JWT Token'ın her isteğin `Authorization` başlığına (Bearer token olarak) otomatik eklenmesi sağlanmıştır.
- **Hata Yönetimi (Error Handling):** `try-catch` blokları ile Backend'den dönen hatalar (Örn: 401 Unauthorized, 400 Bad Request) yakalanıp kullanıcıya anlamlı mesajlar olarak gösterilmiştir.

### 5. Yönlendirme (Routing) Sistemi

- **Client-Side Routing:** Sayfa geçişlerinde tarayıcının yenilenmesini önleyen **React Router DOM** kullanılmıştır.
- **Dinamik Rotalar:** Kitap detay sayfaları için URL parametreleri (`/books/:id`) kullanılarak dinamik içerik yüklemesi yapılmıştır.
- **Sayfa Koruması:** Sadece giriş yapmış kullanıcıların görebileceği UI bileşenleri (Yorum formu, Favori butonu, Profil sayfası) koşullu render (`user ? ... : ...`) ile güvence altına alınmıştır.

### 6. Performans Optimizasyonu

- **Build Tool:** Proje altyapısı olarak Create React App yerine, çok daha hızlı derleme (HMR) ve küçük paket boyutu sunan **Vite** tercih edilmiştir.
- **Lazy Loading (Planlanan):** İlerleyen aşamalarda resimler ve rota bazlı bileşenler için tembel yükleme (lazy load) entegre edilecektir.

### 7. Build ve Deployment (Dağıtım)

- **Geliştirme Ortamı:** `npm run dev` (Vite dev server)
- **Paketleme:** `npm run build` ile production'a hazır statik dosyaların (dist) oluşturulması.
- **Hosting Hedefi:** Vercel, Netlify veya Render üzerinden CI/CD pipeline ile otomatik dağıtım (Deployment).
