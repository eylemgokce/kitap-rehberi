import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function BookDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [book, setBook] = useState<any>(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [commentText, setCommentText] = useState("");
  const [commentRating, setCommentRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);

  const [userId, setUserId] = useState<string | null>(null);
  const [currentUserName, setCurrentUserName] = useState<string>("");

  // Token içerisindeki saklı payload verilerini çözen fonksiyon
  const getUserDataFromToken = (token: string) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join(""),
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      return {};
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("userToken");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      // 1. Kitap Detaylarını Çek
      const bookRes = await axios.get(
        `https://kitap-rehberi-api.onrender.com/books/${id}`,
        { headers },
      );
      setBook(bookRes.data);

      // 2. Yorumları Çek
      const commentsRes = await axios.get(
        `https://kitap-rehberi-api.onrender.com/comments/${id}`,
        { headers },
      );
      setComments(commentsRes.data);

      // 3. Kullanıcı Kimlik ve İsim Doğrulama Zinciri
      if (token) {
        const decodedUser = getUserDataFromToken(token);
        const uId = decodedUser.id || decodedUser._id || decodedUser.userId;
        setUserId(uId ? String(uId) : null);

        const nameFromToken = decodedUser.name || decodedUser.username;

        if (uId) {
          try {
            // Profil detay endpoint'inden ismi doğrulamayı deniyoruz
            const userRes = await axios.get(
              `https://kitap-rehberi-api.onrender.com/users/${uId}`,
              { headers },
            );
            const nameFromApi = userRes.data.name || userRes.data.username;
            setCurrentUserName(nameFromApi || nameFromToken || "Eylem Gökçe");
          } catch (e) {
            setCurrentUserName(nameFromToken || "Eylem Gökçe");
          }
        } else {
          setCurrentUserName(nameFromToken || "Eylem Gökçe");
        }
      }
    } catch (error) {
      Alert.alert("Hata", "Bilgiler yüklenemedi.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddFavorite = async () => {
    const token = await AsyncStorage.getItem("userToken");
    if (!token || !userId) {
      Alert.alert("Uyarı", "Favorilere eklemek için önce giriş yapmalısınız.");
      router.push("/login");
      return;
    }

    try {
      await axios.post(
        `https://kitap-rehberi-api.onrender.com/users/${userId}/favorites/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      Alert.alert("Başarılı", "✅ Kitap favorilerinize eklendi!");
    } catch (error: any) {
      const msg =
        error.response?.data?.message ||
        "Favorilere eklenirken bir hata oluştu.";
      Alert.alert("Hata", msg);
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;

    const token = await AsyncStorage.getItem("userToken");
    if (!token) {
      Alert.alert("Uyarı", "Yorum yapmak için giriş yapmalısınız.");
      return;
    }

    setSubmitting(true);
    try {
      await axios.post(
        "https://kitap-rehberi-api.onrender.com/comments",
        {
          bookId: id,
          text: commentText,
          rating: Number(commentRating),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setCommentText("");
      setCommentRating(5);
      await fetchData(); // Listeyi anlık olarak tazele
    } catch (error) {
      Alert.alert("Hata", "Yorum eklenirken hata oluştu.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    Alert.alert("Sil", "Bu yorumu silmek istediğinize emin misiniz?", [
      { text: "Vazgeç", style: "cancel" },
      {
        text: "Evet",
        style: "destructive",
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem("userToken");
            await axios.delete(
              `https://kitap-rehberi-api.onrender.com/comments/${commentId}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              },
            );
            fetchData();
          } catch (error) {
            Alert.alert("Hata", "Yorum silinirken hata oluştu.");
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 10 }}>Kitap Yükleniyor... ⏳</Text>
      </View>
    );
  }

  if (!book)
    return (
      <View style={styles.container}>
        <Text>Kitap bulunamadı.</Text>
      </View>
    );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* KİTAP BİLGİLERİ */}
      <View style={styles.bookCard}>
        <View style={styles.bookHeader}>
          <Text style={styles.title}>{book.title || book.kitapAdi}</Text>
          <TouchableOpacity style={styles.favBtn} onPress={handleAddFavorite}>
            <Ionicons name="heart" size={18} color="#fff" />
            <Text style={styles.favBtnText}>Favorilere Ekle</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.author}>Yazar: {book.author || book.yazar}</Text>
        <Text style={styles.description}>
          {book.description || "Bu kitabın henüz bir açıklaması bulunmuyor."}
        </Text>
      </View>

      {/* YORUMLAR KISMI */}
      <View style={styles.commentsSection}>
        <Text style={styles.sectionTitle}>💬 Yorumlar ({comments.length})</Text>

        {/* Yorum Ekleme Formu */}
        <View style={styles.commentForm}>
          <TextInput
            style={styles.textarea}
            placeholder="Bu kitap hakkında ne düşünüyorsunuz?"
            value={commentText}
            onChangeText={setCommentText}
            multiline
            numberOfLines={3}
          />

          <View style={styles.formFooter}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={{ marginRight: 8, fontWeight: "bold" }}>Puan:</Text>
              <View style={{ flexDirection: "row" }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity
                    key={star}
                    onPress={() => setCommentRating(star)}
                  >
                    <Ionicons
                      name={star <= commentRating ? "star" : "star-outline"}
                      size={24}
                      color="#FFD700"
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity
              style={[
                styles.submitBtn,
                !commentText.trim() && { opacity: 0.5 },
              ]}
              onPress={handleAddComment}
              disabled={submitting || !commentText.trim()}
            >
              {submitting ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.submitBtnText}>Gönder</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Yorum Listesi */}
        <View style={styles.commentsList}>
          {comments.length === 0 ? (
            <Text style={styles.emptyText}>İlk yorumu siz yapın!</Text>
          ) : (
            comments.map((comment: any) => {
              // Yorum sahibinin ID kırılımlarını stringe çevirerek güvenli hale getiriyoruz
              const commentAuthorId = String(
                comment.user?._id || comment.user?.id || comment.user || "",
              );
              const activeUserId = String(userId || "");

              // İki string değerin tam eşleşme kontrolü
              const isMyComment =
                activeUserId !== "" &&
                commentAuthorId !== "" &&
                commentAuthorId.toLowerCase() === activeUserId.toLowerCase();

              // Hiyerarşik Çözüm: Backend ismi -> Eğer yoksa ve benim yorumumsa güncel ismim -> Yoksa genel başlık
              const displayName =
                comment.user?.name ||
                comment.user?.username ||
                comment.userName ||
                (isMyComment ? currentUserName : "Kitap Sever");

              return (
                <View key={comment._id} style={styles.commentBox}>
                  <View style={styles.commentHeader}>
                    <Text style={{ fontWeight: "bold", color: "#333" }}>
                      {displayName}
                    </Text>
                    <Text>{"⭐".repeat(comment.rating || 5)}</Text>
                  </View>
                  <Text style={styles.commentText}>{comment.text}</Text>

                  {isMyComment && (
                    <TouchableOpacity
                      onPress={() => handleDeleteComment(comment._id)}
                      style={styles.deleteBtn}
                    >
                      <Ionicons name="trash-outline" size={16} color="red" />
                      <Text
                        style={{ color: "red", fontSize: 12, marginLeft: 4 }}
                      >
                        Sil
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              );
            })
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5", padding: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  bookCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  bookHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 15,
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2c3e50",
    flex: 1,
    marginRight: 10,
  },
  favBtn: {
    backgroundColor: "#e74c3c",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  favBtnText: {
    color: "white",
    fontWeight: "bold",
    marginLeft: 6,
    fontSize: 12,
  },
  author: {
    fontSize: 16,
    color: "#7f8c8d",
    marginBottom: 12,
    fontStyle: "italic",
  },
  description: { fontSize: 15, lineHeight: 22, color: "#34495e" },
  commentsSection: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    marginBottom: 40,
  },
  sectionTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 15 },
  commentForm: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#eee",
  },
  textarea: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    minHeight: 80,
    textAlignVertical: "top",
    marginBottom: 15,
  },
  formFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  submitBtn: {
    backgroundColor: "#2ecc71",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 6,
  },
  submitBtnText: { color: "white", fontWeight: "bold" },
  commentsList: { marginTop: 10 },
  commentBox: {
    backgroundColor: "#f8f9fa",
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#3498db",
    marginBottom: 12,
  },
  commentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  commentText: {
    color: "#555",
    fontSize: 14,
    marginBottom: 10,
    textAlign: "left",
  },
  deleteBtn: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
    padding: 4,
  },
  emptyText: { fontStyle: "italic", color: "#888", textAlign: "center" },
});
