const amqp = require("amqplib");

const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://kitap-rabbitmq:5672";
let channel = null;

async function connectRabbitMQ() {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    channel = await connection.createChannel();

    // 'comment_queue' adında kalıcı bir kuyruk oluşturuyoruz
    await channel.assertQueue("comment_queue", { durable: true });
    console.log("📨 RabbitMQ Kuyruk Sistemine Başarıyla Bağlanıldı! (Docker)");

    // Kuyruğu arka planda sürekli dinleyecek işçiyi (Consumer) başlat
    consumeMessages();
  } catch (error) {
    console.error("RabbitMQ Bağlantı Hatası:", error);
  }
}

// Kuyruğa yeni veri/mesaj fırlatan fonksiyon (Publisher)
async function publishToQueue(queueName, message) {
  if (!channel) return console.log("RabbitMQ kanalı henüz hazır değil.");
  channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), {
    persistent: true,
  });
  console.log(`[X] Kuyruğa yeni işlem emri fırlatıldı:`, message);
}

// Kuyruktaki işleri sırayla çeken ve eriten arka plan işçisi (Consumer)
function consumeMessages() {
  channel.consume("comment_queue", (msg) => {
    if (msg !== null) {
      const content = JSON.parse(msg.content.toString());
      console.log(
        `[⚙️ RabbitMQ Worker] İş alındı ve arka planda işleniyor:`,
        content,
      );

      // Asenkron işlemler (Örn: bildirim gönderme simülasyonu) burada tamamlanır.

      channel.ack(msg); // İşlemin başarılı olduğunu bildir ve mesajı kuyruktan temizle
    }
  });
}

connectRabbitMQ();

module.exports = { publishToQueue };
