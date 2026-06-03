# Kitap Rehberi - Mobil Frontend Geliştirme Süreci ve Prensipleri

Bu dokümanda, **Kitap Rehberi** mobil uygulamasının kullanıcı arayüzü (UI) ve kullanıcı deneyimi (UX) standartları listelenmektedir. Proje tek bir tam yığın (full-stack) geliştirici tarafından yürütüldüğü için, tüm ekranların tasarımı, entegrasyonu ve kullanıcı etkileşimleri bu mimari çerçevesinde tek elden koordine edilmektedir.

---

## Geliştirici Görev Dağılımı

Projenin mobil frontend süreçleri tek kişi tarafından yürütülmektedir. Görev detayları ve implementasyon süreçleri aşağıdaki dokümanda mevcuttur:

1. [Eylem Gökçe'nin Mobil Frontend Görevleri](Eylem-Gokce/Eylem-Gokce-Mobil-Frontend-Gorevleri.md)

---

## Genel Mobil Frontend Prensipleri (React Native & Expo)

### 1. Tasarım Sistemi

- **Renk Paleti:** Proje temasına uygun, tutarlı renk kullanımı (Örn: Temel butonlar için `#007AFF`, arka plan için `#f5f5f5`).
- **Tipografi:** Mobil cihazlarda okunabilirliği artıran font boyutları (Başlıklar için büyük ve kalın, metinler için sade).
- **Spacing (Boşluklar):** Bileşenler arası tutarlı yerleşim (Flexbox mimarisi kullanılarak yatay ve dikey hizalamalar).
- **İkonografi:** Uygulama genelinde standart ve anlaşılır görsel dil için `@expo/vector-icons` (Ionicons) kullanımı.

### 2. Responsive (Duyarlı) Tasarım

- Farklı ekran boyutlarına uyum sağlamak için donanımsal pikseller yerine oransal `Flexbox` yapıları kullanılması.
- **Safe Area:** Cihazların çentik (notch) ve durum çubuğu (status bar) gibi fiziksel alanlarıyla içeriklerin çakışmasını önlemek.

### 3. Kullanıcı Deneyimi (UX)

- **Loading States (Yükleme Durumları):** API'den veri beklenirken veya asenkron işlemler sırasında `ActivityIndicator` ile görsel geri bildirim.
- **Error Handling (Hata Yönetimi):** Bağlantı kopukluklarında veya yetkisiz işlemlerde kullanıcıya `Alert` vasıtasıyla anlaşılır hata mesajları sunulması.
- **Empty States (Boş Durumlar):** Arama veya filtreleme sonucunda eşleşme bulunamadığında "Aranan kitap bulunamadı" gibi yönlendirici mesajlar.
- **Anlık Geri Bildirim:** Butonlara tıklandığında uygulamanın donmadığını belli eden `TouchableOpacity` efektleri.

### 4. Performans ve Veri Yönetimi

- **Liste Optimizasyonu:** Uzun kitap listelerinin belleği yormaması ve performanslı kaydırılabilmesi (smooth scroll) için `FlatList` bileşeninin `keyExtractor` kurallarına uygun kullanılması.
- **State Yönetimi:** Gereksiz yeniden render (re-render) işlemlerini önlemek için `useState` ve `useEffect` hook'larının optimize edilmesi.
- **Kalıcı Oturum (Persistence):** Kullanıcının her girişte şifre yazmaması için JWT oturum token'ının `AsyncStorage` ile cihazda güvenle saklanması.

### 5. Navigasyon (Yönlendirme)

- **Expo Router:** Dosya tabanlı yönlendirme (file-based routing) sistemiyle sayfalar (Giriş, Ana Sayfa, Profil) arası hızlı geçiş.
- Dinamik sayfalara parametre iletimi (Örn: Belirli bir kitabın detaylarına giderken `/books/[id]` yapısının kullanılması).

### 6. Form Yönetimi ve Etkileşim

- Klavye açıldığında input (girdi) alanlarının kapanmaması veya ekranın dışında kalmaması için `KeyboardAvoidingView` ve `ScrollView` entegrasyonu.
- E-posta girişlerinde klavye tipinin otomatik olarak `@` işaretini barındıran e-posta moduna (`keyboardType="email-address"`) geçmesi.
- Şifre alanlarının gizlenmesi (`secureTextEntry={true}`).
