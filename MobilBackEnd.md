# Kitap Rehberi - Mobil Backend (REST API Entegrasyonu) Prensipleri

**Canlı REST API Adresi:** [https://kitap-rehberi-api.onrender.com](https://kitap-rehberi-api.onrender.com)

Bu dokümanda, Kitap Rehberi mobil uygulamasının (React Native) Node.js tabanlı REST API ile olan iletişimini sağlayan entegrasyon ve veri yönetimi standartları listelenmektedir. Proje tek bir Full-Stack geliştirici tarafından yürütüldüğü için, API'nin geliştirilmesi ve mobil taraftan çağrılması tek bir mimari çatıda toplanmış ve optimize edilmiştir.

---

## Geliştirici Görev Dağılımı

Mobil uygulamanın backend ile haberleşme süreçleri, API uç noktalarının (endpoints) mobil arayüze bağlanması ve veri akışının yönetimi tek kişi tarafından yürütülmektedir. Görev detaylarına aşağıdaki dokümandan ulaşılabilir:

1. [Eylem Gökçe'nin Mobil Backend Görevleri](Eylem-Gokce/Eylem-Gokce-Mobil-Backend-Gorevleri.md)

---

## Genel Mobil Backend Prensipleri

### 1. HTTP Client (Axios) Yapılandırması

- **Kütüphane:** Proje genelinde API istekleri için `axios` kullanılmıştır.
- **Dinamik Base URL:** Çevre değişkenleri (`.env`) kullanılarak `EXPO_PUBLIC_API_URL` üzerinden dinamik adresleme yapılır. (Geliştirme ortamında Docker LAN IP'si, production'da Render canlı adresi kullanılır).
- **Headers:** - Veri gönderimlerinde `Content-Type: application/json` standarttır.
  - Yetki gerektiren uç noktalarda (Örn: Profil, Favoriler) `Authorization: Bearer {token}` formatında gönderim yapılır.

### 2. Kimlik Doğrulama (Auth) Yönetimi

- **Güvenli Depolama:** Giriş sonrası API'den dönen JWT (JSON Web Token), React Native `AsyncStorage` üzerinde saklanarak cihazda kalıcı oturum sağlanır.
- **Oturum Kontrolü (Guard):** Uygulama açılışında veya yetki gerektiren sayfalara geçişte token varlığı kontrol edilerek gereksiz API istekleri (boş network trafiği) önlenir.
- **Çıkış İşlemi (Logout):** Çıkış anında `AsyncStorage` içerisindeki token temizlenerek güvenlik sağlanır ve yerel state sıfırlanır.

### 3. Hata Yönetimi (Error Handling)

- **Güvenli İstekler:** Tüm Axios istekleri `try/catch` blokları ile sarmalanarak asenkron hataların uygulamanın çökmesine (crash) yol açması engellenir.
- **Dinamik Hata Mesajları:** Backend tarafından gönderilen özel hata mesajları (`error.response.data.message`), ayrıştırılarak son kullanıcıya `Alert` veya UI uyarıları aracılığıyla gösterilir (Örn: "Bu e-posta zaten kullanımda").
- 401 (Unauthorized) gibi token hatalarında kullanıcının giriş sayfasına yönlendirilmesi sağlanır.

### 4. Yükleme Durumları (Loading States)

- Her API isteği (GET, POST vb.) başlamadan önce yerel `loading` state'i aktifleştirilir ve ekranda `ActivityIndicator` gösterilir.
- İstek başarılı da olsa, hata da verse `finally` bloğu kullanılarak yükleme animasyonu mutlaka sonlandırılır.

### 5. Performans ve Optimizasyon

- **Optimistic Updates:** Profil "Hakkımda" kısmının güncellenmesi gibi işlemlerde, kullanıcının beklemesini önlemek adına API'den "200 OK" yanıtı gelmeden/beklenmeden UI anında güncellenir.
- **CORS ve Ağ İzolasyonu Aşımı:** Geliştirme aşamasında Expo Go'nun (mobil cihazın) Docker içindeki API ile haberleşebilmesi için özel LAN yönlendirmeleri (`--lan` parametresi ve IP adresi ayarları) kullanılır.

### 6. Geliştirme Ortamı ve Hata Ayıklama (Debugging)

- Geliştirme sürecinde isteklerin ve hataların takibi için terminal (Expo CLI) üzerinden `console.log()` ile API yanıtları denetlenir.
- Geliştirme ortamında API kesintilerini test etmek için `timeout` parametreleri göz önünde bulundurulur.
