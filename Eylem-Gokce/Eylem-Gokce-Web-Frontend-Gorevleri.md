# Eylem Gökçe Web Frontend Görevleri

---

# 📚 Kitap Rehberi (Book Guide) - Full-Stack App

## **Front-End Test Videosu:** [Front-End Test Video](https://youtu.be/MZjgJtRfeFE)

Bu proje, kullanıcıların kitapları keşfedebildiği, inceleyip yorum yapabildiği, favorilerine ekleyebildiği ve kendi profillerini yönetebildiği kapsamlı bir web uygulamasıdır.

Modern web geliştirme standartlarına uygun olarak tasarlanmış olup, Backend mimarisi Node.js/Express ile, Frontend arayüzü ise React (Vite) ile geliştirilmiştir.

## 🛠 Kullanılan Teknolojiler

- **Frontend:** React.js, React Router DOM, Axios, Context API (State Management)
- **Backend:** Node.js, Express.js, MongoDB & Mongoose
- **Güvenlik & Doğrulama:** JWT (JSON Web Token), Bcrypt.js, CORS
- **Geliştirme Araçları:** Vite, Postman, VS Code

---

## ✨ Temel Özellikler

### 1. Güvenli Kimlik Doğrulama (Auth) Sistemi

- **Kayıt ve Giriş:** Kullanıcıların e-posta benzersizliği (unique email) kontrolü ile güvenli bir şekilde sisteme kayıt olması.
- **Şifreleme:** Kullanıcı şifrelerinin veritabanına `bcrypt` ile hashlenerek kaydedilmesi.
- **Token Yönetimi:** Başarılı giriş sonrası JWT Token'ın LocalStorage'a ve React Context API'ye kaydedilerek anında ve güvenli yönlendirme sağlanması.
- **Hata Yönetimi:** Hatalı girişlerde veya çakışmalarda ("Bu e-posta zaten kullanımda") anlık ve kullanıcı dostu hata mesajları.

### 2. Kitap Keşfi ve Etkileşim

- **Gelişmiş Arama:** Dinamik arama çubuğu ile kitap veya yazar adına göre anlık filtreleme.
- **Detaylı İnceleme:** Responsive Grid yapısında sıralanmış kitap kartları ve her kitap için özel detay sayfası.
- **Yorum Sistemi:** Sadece giriş yapmış kullanıcıların form üzerinden 1-5 arası yıldız (rating) ve metin ile yorum yapabilmesi.
- **Yetkilendirme:** Kullanıcıların sadece kendi yaptıkları yorumları silebilmesi (Authorization kontrolü).

### 3. Dinamik Kullanıcı Profili

- **Profil Yönetimi:** Kullanıcının kendi "Hakkımda" (Bio) bilgisini güncelleyebilmesi.
- **Optimistic Update:** Bio güncellendiğinde sayfa yenilenmeden verinin anında ekrana yansıması.
- **Favoriler:** Detay sayfasından favorilere eklenen kitapların Mongoose `.populate()` yöntemi ile çekilerek profil sayfasında özel kartlar halinde listelenmesi.
- **Veri Tutarlılığı:** Daha önce favorilere eklenen bir kitabın tekrar eklenmesini engelleyen Backend doğrulama mantığı.

---

## 🚀 Kurulum ve Çalıştırma

Projeyi kendi bilgisayarınızda çalıştırmak için aşağıdaki adımları izleyebilirsiniz:

### 1. Repoyu Klonlayın

```bash
git clone [https://github.com/eylemgokce/kitap-rehberi.git](https://github.com/eylemgokce/kitap-rehberi.git)
```

### 2. Backend Kurulumu

```bash
cd kitap-rehberi-api
npm install
```

Backend klasörü içinde `.env` adında bir dosya oluşturun ve içine şu bilgileri ekleyin:

```env
PORT=5000
MONGO_URI=sizin_mongodb_baglanti_url_adresiniz
JWT_SECRET=gizli_bir_anahtar_kelime
```

Sunucuyu başlatın:

```bash
npm run dev
```

### 3. Frontend Kurulumu

Yeni bir terminal açın ve frontend klasörüne gidin:

```bash
cd frontend
npm install
npm run dev
```

Uygulama `http://localhost:5173` adresinde çalışmaya başlayacaktır.

---

## 🎯 Gelecek Planları (Roadmap)

- Kullanıcılar için Profil Fotoğrafı (Avatar) yükleme desteği (Multer entegrasyonu).
- Kullanıcıların kendi hesaplarını tamamen silebilmesi (Account Deletion) akışı.
- Admin paneli üzerinden arayüz ile veritabanına yeni kitap ekleme sayfası.
