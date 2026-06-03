# Eylem Gökçe Mobil Frontend Görevleri

**Mobile Front-end Demo Videosu:** [Link Buraya Eklenecek]

---

# 📚 Kitap Rehberi (Book Guide) - Mobil Uygulama

Bu proje, kitapları keşfedip arama yapabildiği ve kitaplara yorum bırakabildiği mobil uygulamadır. Projenin mobil front-end geliştirmesi **React Native (Expo)** ve **TypeScript** kullanılarak tek kişi tarafından tamamlanmıştır.

## 🛠 Kullanılan Teknolojiler (Mobil)

- **Framework:** React Native (Expo) & TypeScript
- **Yönlendirme (Navigation):** Expo Router (File-based Routing)
- **API İstekleri:** Axios
- **Yerel Depolama:** AsyncStorage (Token ve Oturum Yönetimi)
- **UI Bileşenleri:** Expo Vector Icons, React Native Standart Bileşenleri (FlatList, TextInput, vb.)

---

## 1. Üye Girişi (Login) Ekranı

- **API Endpoint:** `POST /auth/login`
- **Görev:** Kullanıcıların sisteme güvenli giriş yapabilmesi için mobil ekran tasarımı ve backend entegrasyonu.
- **UI Bileşenleri:**
  - E-posta input alanı (`keyboardType="email-address"`, küçük harf zorunluluğu)
  - Şifre input alanı (`secureTextEntry={true}`)
  - "Giriş Yap" butonu
  - "Hesabınız yok mu? Kayıt Olun" yönlendirme linki
  - İşlem esnasında dönen `ActivityIndicator` (Loading)
- **Form Validasyonu & Güvenlik:**
  - E-posta ve şifre alanlarının boş bırakılamaması kontrolü.
  - Başarılı giriş sonrasında API'den dönen JWT Token'ın `AsyncStorage` üzerine `userToken` anahtarıyla güvenli şekilde kaydedilmesi.
- **Kullanıcı Deneyimi (UX):**
  - Hatalı girişlerde (401 Unauthorized veya Ağ Hatası) kullanıcı dostu `Alert` veya metin tabanlı hata mesajları gösterilmesi.
  - `KeyboardAvoidingView` ve `ScrollView` kullanımı (Klavye açıldığında form elemanlarının gizlenmemesi).

---

## 2. Kitap Keşif ve Listeleme (Home) Ekranı

- **API Endpoint:** `GET /books`
- **Görev:** Veritabanındaki tüm kitapların performanslı bir şekilde listelenmesi ve dinamik arama mimarisinin kurulması.
- **UI Bileşenleri:**
  - Dinamik Arama Çubuğu (Search Bar) ve `Ionicons` arama ikonu
  - Kitap başlığı, yazar adı ve "Detayları Gör" butonu barındıran özelleştirilmiş Kitap Kartları (Book Cards)
  - Performanslı listeleme için `FlatList` bileşeni
- **Kullanıcı Deneyimi & Filtreleme:**
  - **Real-Time Arama:** Kullanıcı arama çubuğuna harf girdiğinde, kitap adı veya yazar adına göre büyük/küçük harf duyarsız (case-insensitive) anlık filtreleme mantığı.
  - **Empty State:** Arama sonucunda eşleşen kitap bulunamazsa ekranda otomatik olarak _"Aranan kitap bulunamadı."_ uyarısının gösterilmesi.
  - **Güvenlik Kalkanı:** `AsyncStorage` üzerinde geçerli bir token yoksa, API'ye boşuna istek atılmasını engelleyen ve kullanıcıyı giriş yapmaya zorlayan token doğrulama kontrolü.

---

## 3. Kitap Detay ve Yorumlama Ekranı

- **API Endpoints:** `GET /books/{bookId}`, `POST /books/{bookId}/comments`
- **Görev:** Seçilen kitaba ait detaylı bilgilerin gösterilmesi ve kullanıcıların puan/yorum bırakabileceği modülün implementasyonu.
- **UI Bileşenleri:**
  - Kitap görseli (placeholder), adı, yazarı ve açıklama metni alanları
  - 1-5 arası Yıldız Puanlama (Rating) komponenti
  - Yorum yazma çok satırlı `TextInput` alanı
  - "Yorum Gönder" butonu ve mevcut yorumların listelendiği alt bölüm
- **Teknik Detaylar & UX:**
  - Sayfa açılırken `Expo Router` üzerinden gelen `bookId` parametresi ile spesifik kitabın verilerinin API'den çekilmesi.
  - Yorumlar listelenirken kullanıcı adlarının profilden dinamik olarak çekilerek gösterilmesi tutarlılığı.
  - Yorum gönderildikten sonra listenin sayfa yenilenmeden güncellenmesi.

---

## 4. Kullanıcı Profil Ekranı

- **API Endpoints:** `GET /users/profile`, `PUT /users/profile`
- **Görev:** Giriş yapan kullanıcının hesap bilgilerini, hakkımda (biyografi) yazısını yönetebilmesi ve favori kitaplarını görebilmesi.
- **UI Bileşenleri:**
  - Kullanıcı Adı, Soyadı ve E-posta adresi bilgileri (Büyük başlık ve ikonlar eşliğinde)
  - "Hakkımda" (Bio) metin alanı ve güncellenebilir form yapısı
  - Kullanıcının favorilerine eklediği kitapların responsive kartlar halinde listelenmesi
- **Kullanıcı Deneyimi (UX):**
  - **Optimistic Update:** Kullanıcı biyografisini güncelleyip kaydettiğinde, verinin sayfa yenilenmeden UI üzerinde anında güncellenmesi.
  - Favori kitaplar listelenirken Mongoose tarafındaki `.populate()` ilişkisiyle uyumlu çalışan alt kart mimarisi.

---

## 🎯 Gelecek Planları (Roadmap)

- [ ] Mobil cihaz kamerası kullanılarak Kitap Barkod Okuma (ISBN Barkod Tarayıcı) özelliğinin eklenmesi.
- [ ] Kitaplar internetsiz ortamda da görüntülenebilsin diye SQLite veya Realm ile çevrimdışı (Offline-First) veri saklama desteği.
- [ ] Kitap okuma hatırlatıcıları için Expo Push Notifications entegrasyonu.
