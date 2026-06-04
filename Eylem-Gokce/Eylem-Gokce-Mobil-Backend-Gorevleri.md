# Eylem Gökçe Mobil Backend (API & Entegrasyon) Görevleri

**Mobil Front-end ile Back-end Bağlanmış Test Videosu:** [[Mobil FrontEnd & BackEnd](https://youtu.be/pHPZc6V0-oc)]

## 1. Güvenli Kimlik Doğrulama (Auth) Servisleri

- **API Endpoints:** `POST /auth/register` , `POST /auth/login`
- **Görev:** Kullanıcı kayıt/giriş işlemlerini yöneten Node.js API uç noktalarının yazılması ve mobil (React Native) entegrasyonu.
- **İşlevler:**
  - E-posta ve şifre bilgilerinin alınarak sunucu tarafında doğrulanması (Validation).
  - Şifrelerin veritabanına kaydedilmeden önce `bcrypt` ile hashlenerek şifrelenmesi.
  - Kayıt esnasında "E-posta benzersizliği" (Unique Email) kontrolü.
  - Başarılı giriş durumunda JWT (JSON Web Token) üretilmesi ve mobil cihaza iletilmesi.
- **Teknik Detaylar:**
  - **Mobil Entegrasyon:** Axios ile HTTP POST isteklerinin atılması ve dönen token'ın `AsyncStorage`'a güvenli şekilde kaydedilmesi.
  - **Hata Yönetimi (Error Handling):** 409 Conflict (Kullanıcı zaten var), 401 Unauthorized (Hatalı şifre) durumlarının yakalanıp mobilde `Alert` olarak gösterilmesi.

## 2. Kitap Keşif ve Listeleme Servisi

- **API Endpoint:** `GET /books`
- **Görev:** MongoDB veritabanındaki kitap verilerinin performanslı bir şekilde mobil uygulamaya servis edilmesi.
- **İşlevler:**
  - Veritabanındaki tüm kitapların (başlık, yazar, detay) JSON formatında hazırlanması.
  - Sadece yetkili (giriş yapmış) kullanıcıların kitapları görebilmesi için JWT yetkilendirme (Authorization) middleware kontrolü.
  - Sunucu yanıt süresini (Response Time) optimize etme.
- **Teknik Detaylar:**
  - **Mobil Entegrasyon:** İstek atılırken Axios Headers içine `Authorization: Bearer <token>` bilgisinin dinamik olarak eklenmesi.
  - Veritabanı sorguları için Mongoose ODM (Object Data Modeling) kullanımı.

## 3. Dinamik Kullanıcı Profili ve Favoriler Servisi

- **API Endpoints:** `GET /users/profile` , `PUT /users/profile`
- **Görev:** Kullanıcının profil bilgilerini (Bio) getirme/güncelleme ve favori kitaplarını çekme işlemlerinin API tarafında yönetilmesi.
- **İşlevler:**
  - JWT içindeki `userId` (Payload) bilgisini çözerek (Decode) ilgili kullanıcının MongoDB'den bulunması.
  - Mongoose `.populate()` metodu kullanılarak, kullanıcının sadece id'sini tuttuğu favori kitapların tüm detaylarıyla birlikte (Join işlemi) API'den dönülmesi.
  - Profil güncelleme (PUT) işleminde, formdan gelen yeni "Hakkımda" verisinin veritabanına yazılması.
- **Teknik Detaylar:**
  - **Mobil Entegrasyon:** Güncelleme başarılı olduğunda uygulamanın yerel State'inin güncellenerek sayfa yenilenmeden (Optimistic Update) yansıtılması.
  - Kısmi güncelleme (Partial Update) desteği sayesinde sadece değişen verilerin yüklenmesi.

## 4. İleri Seviye Backend Mimarisi (Docker, Jenkins, Redis & RabbitMQ)

- **Görev:** Projenin kurumsal standartlarda, ölçeklenebilir ve izole bir yapıda çalıştırılması.
- **İşlevler & Mimari:**
  - **Containerization (Docker):** Tüm API, MongoDB, Redis ve RabbitMQ sistemlerinin `docker-compose.yml` üzerinden tek bir sanal ağda (Network) haberleştirilmesi.
  - **Önbellekleme (Redis):** Sık okunan verilere hızlı erişim sağlamak ve veritabanı yükünü hafifletmek için Redis entegrasyonu altyapısının kurulması.
  - **Mesaj Kuyruğu (RabbitMQ):** İleride eklenebilecek asenkron görevler (Bildirimler, e-posta gönderimi vb.) için AMQP protokolü ile RabbitMQ kuyruk sisteminin API'ye bağlanması.
- **Teknik Detaylar:**
  - `.env` ortam değişkenleri ile (Port, MongoDB URI, Redis/RabbitMQ URL) güvenli konfigürasyon yönetimi.
  - Sunucunun farklı IP'lerden gelecek isteklere açık olması için CORS kurallarının ve ağ (LAN) dinleme ayarlarının yapılandırılması.
