const redis = require("redis");

// Docker lokal bağlantı URL'i
const REDIS_URL = process.env.REDIS_URL || "redis://kitap-redis:6379";

const redisClient = redis.createClient({
  url: REDIS_URL,
});

redisClient.on("error", (err) => console.log("❌ Redis Bağlantı Hatası:", err));
redisClient.on("connect", () =>
  console.log("⚡ Redis Sunucusuna Başarıyla Bağlanıldı! (Docker)"),
);

(async () => {
  try {
    await redisClient.connect();
  } catch (err) {
    console.error("Redis başlatılamadı, sistem önbelleksiz çalışıyor.");
  }
})();

module.exports = redisClient;
