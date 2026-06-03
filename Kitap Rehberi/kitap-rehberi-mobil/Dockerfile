# Temel Node.js imajı
FROM node:20-alpine

# Çalışma dizini
WORKDIR /app

# Sadece paket dosyalarını kopyalayıp bağımlılıkları yüklüyoruz
COPY package*.json ./
RUN npm install

# Tüm mobil proje dosyalarını kopyalıyoruz
COPY . .

# Expo'nun varsayılan portunu dışa açıyoruz
EXPOSE 8081

# Tünel KULLANMADAN standart modda başlatıyoruz
CMD ["npx", "expo", "start", "--lan", "-c"]