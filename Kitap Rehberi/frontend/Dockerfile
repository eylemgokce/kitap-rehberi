FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5173

# Vite'in dışarıdan erişime izin vermesi için --host ekliyoruz
CMD ["npm", "run", "dev", "--", "--host"]