# API Tasarımı - OpenAPI Specification

**OpenAPI Spesifikasyon Dosyası:** [kitap-rehberi.yaml](kitap-rehberi.yaml)

Bu doküman, OpenAPI Specification (OAS) 3.0 standardına göre hazırlanmış "Kitap Rehberi" platformunun API tasarımını içermektedir.

## OpenAPI Specification

```yaml
openapi: 3.0.3
info:
  title: Kitap Rehberi API
  description: |
    Kullanıcıların okudukları kitaplar ile ilgili deneyimlerini paylaşabilecekleri RESTful API servisi.

    ## Özellikler
    - Kullanıcı kayıt ve giriş işlemleri
    - Kitap arama ve detay görüntüleme
    - Kitaplara yorum yapma ve silme
    - Kitapları favorilere ekleme
    - Profil güncelleme
    - JWT tabanlı kimlik doğrulama
  version: 1.0.0
  contact:
    name: Kitap Rehberi Geliştirme Ekibi
    email: iletisim@kitaprehberi.com

servers:
  - url: [https://kitap-rehberi.netlify.app/api](https://kitap-rehberi.netlify.app/api)
    description: Production server (Netlify)
  - url: http://localhost:3000
    description: Development server

tags:
  - name: auth
    description: Kullanıcı kayıt ve giriş işlemleri
  - name: books
    description: Kitap listeleme, detay, güncelleme ve silme işlemleri
  - name: users
    description: Profil yönetimi ve favori işlemleri
  - name: comments
    description: Yorum ekleme ve silme işlemleri

paths:
  /auth/register:
    post:
      tags:
        - auth
      summary: Üye Olma
      description: Yeni kullanıcı hesabı oluşturur.
      operationId: registerUser
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/RegisterInput'
      responses:
        '201':
          description: Kullanıcı başarıyla oluşturuldu
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'
        '400':
          $ref: '#/components/responses/BadRequest'

  /auth/login:
    post:
      tags:
        - auth
      summary: Giriş Yapma
      description: Kullanıcının email ve şifre ile sisteme giriş yapmasını sağlar.
      operationId: loginUser
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/LoginInput'
      responses:
        '200':
          description: Giriş başarılı
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AuthResponse'
        '401':
          $ref: '#/components/responses/Unauthorized'

  /books/search:
    get:
      tags:
        - books
      summary: Kitap Arama
      description: Kitap adı veya yazara göre arama yapar.
      operationId: searchBooks
      parameters:
        - name: q
          in: query
          required: true
          description: Arama kelimesi
          schema:
            type: string
      responses:
        '200':
          description: Başarılı
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Book'

  /books/{id}:
    get:
      tags:
        - books
      summary: Kitap Detay Görüntüleme
      description: Seçilen kitabın detay bilgilerini getirir.
      operationId: getBook
      parameters:
        - $ref: '#/components/parameters/BookIdParam'
      responses:
        '200':
          description: Başarılı
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Book'
        '404':
          $ref: '#/components/responses/NotFound'

    put:
      tags:
        - books
      summary: Kitap Güncelleme
      description: Kitap bilgilerini günceller.
      operationId: updateBook
      security:
        - bearerAuth: []
      parameters:
        - $ref: '#/components/parameters/BookIdParam'
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/BookInput'
      responses:
        '200':
          description: Kitap başarıyla güncellendi
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Book'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '403':
          $ref: '#/components/responses/Forbidden'
        '404':
          $ref: '#/components/responses/NotFound'

    delete:
      tags:
        - books
      summary: Kitap Silme
      description: Belirtilen kitabı sistemden siler.
      operationId: deleteBook
      security:
        - bearerAuth: []
      parameters:
        - $ref: '#/components/parameters/BookIdParam'
      responses:
        '204':
          description: Kitap başarıyla silindi
        '401':
          $ref: '#/components/responses/Unauthorized'
        '403':
          $ref: '#/components/responses/Forbidden'
        '404':
          $ref: '#/components/responses/NotFound'

  /books/{id}/comments:
    post:
      tags:
        - comments
      summary: Kitap Yorum Ekleme
      description: Kullanıcının kitaba yorum yapmasını sağlar.
      operationId: addBookComment
      security:
        - bearerAuth: []
      parameters:
        - $ref: '#/components/parameters/BookIdParam'
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CommentInput'
      responses:
        '201':
          description: Yorum başarıyla eklendi
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Comment'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '404':
          $ref: '#/components/responses/NotFound'

  /comments/{commentId}:
    delete:
      tags:
        - comments
      summary: Yorum Silme
      description: Yorumu sistemden siler.
      operationId: deleteComment
      security:
        - bearerAuth: []
      parameters:
        - name: commentId
          in: path
          required: true
          description: Yorum ID'si
          schema:
            type: string
      responses:
        '204':
          description: Yorum başarıyla silindi
        '401':
          $ref: '#/components/responses/Unauthorized'
        '403':
          $ref: '#/components/responses/Forbidden'
        '404':
          $ref: '#/components/responses/NotFound'

  /users/{id}:
    put:
      tags:
        - users
      summary: Profil Güncelleme
      description: Kullanıcının profil bilgilerini günceller.
      operationId: updateUserProfile
      security:
        - bearerAuth: []
      parameters:
        - $ref: '#/components/parameters/UserIdParam'
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UserProfileInput'
      responses:
        '200':
          description: Profil başarıyla güncellendi
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '403':
          $ref: '#/components/responses/Forbidden'
        '404':
          $ref: '#/components/responses/NotFound'

  /users/{id}/favorites/{bookId}:
    post:
      tags:
        - users
      summary: Favorilere Kitap Ekleme
      description: Kitabı kullanıcının favorilerine ekler.
      operationId: addFavoriteBook
      security:
        - bearerAuth: []
      parameters:
        - $ref: '#/components/parameters/UserIdParam'
        - $ref: '#/components/parameters/BookIdParam'
      responses:
        '200':
          description: Kitap favorilere başarıyla eklendi
        '401':
          $ref: '#/components/responses/Unauthorized'
        '404':
          $ref: '#/components/responses/NotFound'

components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
      description: JWT token ile kimlik doğrulama

  parameters:
    UserIdParam:
      name: id
      in: path
      required: true
      description: Kullanıcı ID'si
      schema:
        type: string
    BookIdParam:
      name: id
      in: path
      required: true
      description: Kitap ID'si
      schema:
        type: string

  schemas:
    LoginInput:
      type: object
      required:
        - email
        - password
      properties:
        email:
          type: string
          format: email
          example: "ornek@email.com"
        password:
          type: string
          format: password
          example: "123456"

    RegisterInput:
      type: object
      required:
        - name
        - email
        - password
      properties:
        name:
          type: string
          example: "Ahmet Yılmaz"
        email:
          type: string
          format: email
          example: "ornek@email.com"
        password:
          type: string
          format: password
          example: "123456"

    AuthResponse:
      type: object
      properties:
        token:
          type: string
          example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
        user:
          $ref: '#/components/schemas/User'

    User:
      type: object
      properties:
        _id:
          type: string
          example: "user789"
        name:
          type: string
          example: "Ahmet Yılmaz"
        email:
          type: string
          format: email
          example: "ornek@email.com"
        bio:
          type: string
          example: "Bilim kurgu okuru."

    UserProfileInput:
      type: object
      properties:
        name:
          type: string
          example: "Ahmet Yılmaz"
        bio:
          type: string
          example: "Bilim kurgu okuru."

    Book:
      type: object
      properties:
        _id:
          type: string
          example: "book123"
        title:
          type: string
          example: "1984"
        author:
          type: string
          example: "George Orwell"
        description:
          type: string
          example: "Distopik bir roman."

    BookInput:
      type: object
      required:
        - title
        - author
      properties:
        title:
          type: string
          example: "1984"
        author:
          type: string
          example: "George Orwell"
        description:
          type: string
          example: "Distopik bir roman."

    Comment:
      type: object
      properties:
        _id:
          type: string
          example: "cmt456"
        userId:
          type: string
          example: "user789"
        text:
          type: string
          example: "Çok etkileyici bir kitap."
        rating:
          type: integer
          example: 5

    CommentInput:
      type: object
      required:
        - text
        - rating
      properties:
        text:
          type: string
          example: "Çok etkileyici bir kitap."
        rating:
          type: integer
          example: 5

    Error:
      type: object
      required:
        - message
      properties:
        message:
          type: string
          example: "Bir hata oluştu"

  responses:
    BadRequest:
      description: Geçersiz istek
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
    Unauthorized:
      description: Yetkisiz erişim
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
    NotFound:
      description: Kaynak bulunamadı
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
    Forbidden:
      description: Erişim reddedildi
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
```
