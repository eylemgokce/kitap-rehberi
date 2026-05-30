# 📚 Kitap Rehberi - Mobil Uygulama

Bu proje, "Kitap Rehberi" platformunun React Native ve Expo Router kullanılarak geliştirilmiş mobil arayüzüdür. Web projesiyle tam senkronize çalışan bu uygulama, kullanıcıların kitapları keşfetmesini, favorilerine eklemesini, puanlayıp yorum yapmasını ve profillerini yönetmesini sağlar.

## ✨ Öne Çıkan Özellikler

- **Güvenli Kimlik Doğrulama (JWT):** REST API üzerinden alınan token, cihazın güvenli hafızasında (`AsyncStorage`) saklanır.
- **Dinamik Kitap Keşfi:** Ana sayfada anlık çalışan arama ve filtreleme (yazar/kitap adı) algoritması.
- **Detaylı İnceleme ve Etkileşim:**
  - Kitap detaylarını görüntüleme.
  - 5 yıldızlı derecelendirme sistemi ile yorum yapma.
  - Sadece kendi yorumlarını silebilme yetkisi.
  - Tek tıkla favorilere ekleme/çıkarma.
- **Profil Yönetimi:** Kullanıcı bilgilerini görüntüleme, biyografi (bio) güncelleme ve favori kitapları tek ekranda listeleme.
- **Modern Navigasyon:** Expo Router ile dosya tabanlı (file-based) sayfa yönlendirmeleri ve akıcı geçişler.

## 🛠️ Kullanılan Teknolojiler

- **Framework:** React Native / Expo (SDK 54)
- **Navigasyon:** Expo Router
- **HTTP İstemcisi:** Axios
- **Yerel Depolama:** @react-native-async-storage/async-storage
- **İkonlar:** @expo/vector-icons (Ionicons)
- **Backend Bağlantısı:** Node.js / Express.js REST API (Render üzerinde canlıda)

## 🚀 Kurulum ve Çalıştırma

Projeyi kendi bilgisayarınızda çalıştırmak için aşağıdaki adımları izleyin:

1. **Repoyu Klonlayın:**

   ```bash
   git clone <repo-url>
   cd kitap-rehberi-mobil
   ```

2. **Gerekli Paketleri Yükleyin:**

   ```bash
   npm install
   ```

3. **Uygulamayı Başlatın:**

   ```bash
   npx expo start -c
   ```

4. **Telefonda Test Edin:**
   - Cihazınıza **Expo Go** uygulamasını indirin.
   - Terminalde çıkan QR kodu telefonunuzun kamerası (veya Expo Go uygulaması) ile okutarak projeyi anında canlı olarak görüntüleyin.

## 🔗 API Entegrasyonu

Uygulama, bulut üzerinde (Render) çalışan merkezi Kitap Rehberi API'sine bağlıdır. İstekler `https://kitap-rehberi-api.onrender.com` adresi üzerinden JWT `Bearer Token` ile yetkilendirilerek atılır. Web ve Mobil platformlar aynı veritabanını paylaştığı için yapılan değişiklikler anında iki platforma da yansır.

---

**Geliştirici:** Eylem Gökçe  
_Süleyman Demirel Üniversitesi - Bilgisayar Mühendisliği_
