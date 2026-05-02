# Node.js'in hafif bir sürümünü kullanıyoruz
FROM node:18-alpine

# Konteyner içinde çalışacağımız klasörü belirliyoruz
WORKDIR /app

# Önce paket dosyalarını kopyalayıp kurulum yapıyoruz (Hızlandırmak için)
COPY package*.json ./
RUN npm install

# Şimdi tüm backend kodlarımızı konteynerin içine kopyalıyoruz
COPY . .

# Backend'in çalışacağı port
EXPOSE 5000

# Motoru çalıştırıyoruz
CMD ["node", "server.js"]