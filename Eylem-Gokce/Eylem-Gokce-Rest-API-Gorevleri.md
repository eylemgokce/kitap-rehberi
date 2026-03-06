# Eylem Gökçe'nin REST API Metotları

**API Test Videosu:** [Link buraya eklenecek](https://example.com)

## 1. Giriş Yapma

- **Endpoint:** `POST /auth/login`
- **Request Body:** ```json
  {
  "email": "ornek@email.com",
  "password": "123456"
  }
  ```

  ```
- **Response:** `200 OK` - Başarılı giriş. Token ve kullanıcı bilgileri döner.

## 2. Üye Olma

- **Endpoint:** `POST /auth/register`
- **Request Body:** ```json
  {
  "name": "Ahmet Yılmaz",
  "email": "ornek@email.com",
  "password": "123456"
  }
  ```

  ```
- **Response:** `201 Created` - Kullanıcı hesabı başarıyla oluşturuldu.

## 3. Kitap Detay Görüntüleme

- **Endpoint:** `GET /books/{id}`
- **Path Parameters:** - `id` (string, required) - Kitabın benzersiz kimlik numarası
- **Authentication:** Gerekli değil
- **Response:** `200 OK` - Seçilen kitabın detay bilgileri başarıyla getirildi.

## 4. Kitap Arama

- **Endpoint:** `GET /books/search`
- **Query Parameters:** - `q` (string, required) - Kitap adı veya yazara göre arama kelimesi
- **Authentication:** Gerekli değil
- **Response:** `200 OK` - Arama sonuçları başarıyla listelendi.

## 5. Kitap Güncelleme

- **Endpoint:** `PUT /books/{id}`
- **Path Parameters:** - `id` (string, required) - Kitabın benzersiz kimlik numarası
- **Request Body:** ```json
  {
  "title": "1984",
  "author": "George Orwell",
  "description": "Distopik bir roman."
  }
  ```

  ```
- **Authentication:** Bearer Token gerekli
- **Response:** `200 OK` - Kitap bilgileri başarıyla güncellendi.

## 6. Kitap Silme

- **Endpoint:** `DELETE /books/{id}`
- **Path Parameters:** - `id` (string, required) - Kitabın benzersiz kimlik numarası
- **Authentication:** Bearer Token gerekli
- **Response:** `204 No Content` - Belirtilen kitap sistemden başarıyla silindi.

## 7. Profil Güncelleme

- **Endpoint:** `PUT /users/{id}`
- **Path Parameters:** - `id` (string, required) - Kullanıcının benzersiz kimlik numarası
- **Request Body:** ```json
  {
  "name": "Ahmet Yılmaz",
  "bio": "Bilim kurgu okuru."
  }
  ```

  ```
- **Authentication:** Bearer Token gerekli
- **Response:** `200 OK` - Kullanıcının profil bilgileri başarıyla güncellendi.

## 8. Kitap Yorum Ekleme

- **Endpoint:** `POST /books/{id}/comments`
- **Path Parameters:** - `id` (string, required) - Yorum yapılacak kitabın kimlik numarası
- **Request Body:** ```json
  {
  "text": "Çok etkileyici bir kitap, kesinlikle tavsiye ederim.",
  "rating": 5
  }
  ```

  ```
- **Authentication:** Bearer Token gerekli
- **Response:** `201 Created` - Kullanıcının yorumu başarıyla eklendi.

## 9. Yorum Silme

- **Endpoint:** `DELETE /comments/{commentId}`
- **Path Parameters:** - `commentId` (string, required) - Silinecek yorumun benzersiz kimlik numarası
- **Authentication:** Bearer Token gerekli
- **Response:** `204 No Content` - Yorum sistemden başarıyla silindi.

## 10. Favorilere Kitap Ekleme

- **Endpoint:** `POST /users/{id}/favorites/{bookId}`
- **Path Parameters:** - `id` (string, required) - Kullanıcının benzersiz kimlik numarası
  - `bookId` (string, required) - Favorilere eklenecek kitabın kimlik numarası
- **Authentication:** Bearer Token gerekli
- **Response:** `200 OK` - Kitap kullanıcının favorilerine başarıyla eklendi.
