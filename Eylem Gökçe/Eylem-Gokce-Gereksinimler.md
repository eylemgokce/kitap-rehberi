1. **Giriş Yapma**
   - **API Metodu:** `POST /auth/login`
   - **Açıklama:** Kullanıcının email ve şifre ile sisteme giriş yapmasını sağlar.

2. **Üye Olma**
   - **API Metodu:** `POST /auth/register`
   - **Açıklama:** Yeni kullanıcı hesabı oluşturur.

3. **Kitap Silme**
   - **API Metodu:** `DELETE /books/{id}`
   - **Açıklama:** Belirtilen kitabı sistemden siler.

4. **Kitap Detay Görüntüleme**
   - **API Metodu:** `GET /books/{id}`
   - **Açıklama:** Seçilen kitabın detay bilgilerini getirir.

5. **Kitap Arama**
   - **API Metodu:** `GET /books/search? q={kelime}`
   - **Açıklama:** Kitap adı veya yazara göre arama yapar.

6. **Kitap Yorum Ekleme**
   - **API Metodu:** `POST /books/{id}/comments`
   - **Açıklama:** Kullanıcının kitaba yorum yapmasını sağlar.

7. **Profil Güncelleme**
   - **API Metodu:** `PUT /users/{id}`
   - **Açıklama:** Kullanıcının profil bilgilerini günceller.

8. **Kitap Güncelleme**
   - **API Metodu:** `PUT /books/{id}`
   - **Açıklama:** Kitap bilgilerini günceller.

9. **Yorum Silme**
   - **API Metodu:** `DELETE /comments/{commentId}/`
   - **Açıklama:** Yorumu sistemden siler.

10. **Favorilere Kitap Ekleme**

- **API Metodu:** `POST /users/{id}/favorites/{bookId}`
- **Açıklama:** Kitabı kullanıcının favorilerine ekler.
