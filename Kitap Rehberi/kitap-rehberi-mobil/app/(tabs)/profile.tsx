import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";
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

export default function ProfileScreen() {
  const router = useRouter();

  // Web tarafındaki state mimarisinin birebir aynısı
  const [userData, setUserData] = useState<any>(null);
  const [favorites, setFavorites] = useState([]);
  const [savedBio, setSavedBio] = useState("");
  const [formBio, setFormBio] = useState("");

  const [loading, setLoading] = useState(true);
  const [updatingBio, setUpdatingBio] = useState(false);

  // JWT Token'dan kullanıcı ID'sini çekmek için yardımcı fonksiyon
  const getUserIdFromToken = (token: string) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join(""),
      );
      const decoded = JSON.parse(jsonPayload);
      return decoded.id || decoded._id; // JWT içindeki ID alanına göre
    } catch (e) {
      return null;
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("userToken");
      if (!token) return;

      const userId = getUserIdFromToken(token);
      if (!userId) {
        Alert.alert("Hata", "Kullanıcı kimliği doğrulanamadı.");
        return;
      }

      // Web: api.get(`/users/${userId}`)
      const response = await axios.get(
        `https://kitap-rehberi-api.onrender.com/users/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      // Web mimarisiyle birebir veri eşleme
      setUserData(response.data);
      setFavorites(response.data.favorites || []);

      const userBio = response.data.bio || "Henüz kendinizden bahsetmediniz.";
      setSavedBio(userBio);
      setFormBio(response.data.bio || "");
    } catch (error) {
      console.error("Profil bilgileri çekilemedi.", error);
      Alert.alert("Hata", "Profil bilgileri yüklenirken bir sorun oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      setUpdatingBio(true);
      const token = await AsyncStorage.getItem("userToken");
      if (!token) return;

      const userId = getUserIdFromToken(token);

      // Web: api.put(`/users/${userId}`, { name, email, bio })
      const response = await axios.put(
        `https://kitap-rehberi-api.onrender.com/users/${userId}`,
        {
          name: userData?.name,
          email: userData?.email,
          bio: formBio, // Düzenleme kutusundaki güncel metin
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      // Başarılı olunca güncel veriyi tekrar çekip ekrana yansıtıyoruz
      await fetchUserProfile();
      Alert.alert("Başarılı", "✅ Bio başarıyla güncellendi!");
    } catch (error) {
      console.error("Profil güncellenirken bir hata oluştu.", error);
      Alert.alert("Hata", "Profil güncellenirken bir hata oluştu.");
    } finally {
      setUpdatingBio(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert("Çıkış Yap", "Oturumu kapatmak istediğinize emin misiniz?", [
      { text: "Vazgeç", style: "cancel" },
      {
        text: "Evet",
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.removeItem("userToken");
          router.replace("/login");
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* KULLANICI BİLGİLERİ CARD */}
      <View style={styles.profileCard}>
        <Text style={styles.cardTitle}>👤 Profil Bilgilerim</Text>
        <Text style={styles.infoText}>
          <Text style={{ fontWeight: "bold" }}>Ad Soyad:</Text>{" "}
          {userData?.name || "Yükleniyor..."}
        </Text>
        <Text style={styles.infoText}>
          <Text style={{ fontWeight: "bold" }}>E-posta:</Text>{" "}
          {userData?.email || "Yükleniyor..."}
        </Text>

        {/* Sabit Bio Gösterim Alanı */}
        <View style={styles.bioDisplayBox}>
          <Text style={{ fontWeight: "bold", color: "#2c3e50" }}>
            Mevcut Bio:
          </Text>
          <Text style={styles.savedBioText}>{savedBio}</Text>
        </View>

        {/* BİO GÜNCELLEME FORMU */}
        <View style={styles.bioForm}>
          <Text style={styles.label}>Bio'yu Değiştir:</Text>
          <TextInput
            style={styles.textarea}
            value={formBio}
            onChangeText={setFormBio}
            placeholder="Kendinizden bahsedin..."
            multiline
            numberOfLines={3}
          />
          <TouchableOpacity
            style={styles.saveBtn}
            onPress={handleUpdateProfile}
            disabled={updatingBio}
          >
            {updatingBio ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.saveBtnText}>Kaydet</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* FAVORİ KİTAPLAR LİSTESİ */}
      <View style={styles.favoritesSection}>
        <Text style={styles.sectionTitle}>
          ❤️ Favori Kitaplarım ({favorites.length})
        </Text>
        {favorites.length === 0 ? (
          <Text style={styles.emptyText}>
            Henüz favorilere kitap eklemediniz.
          </Text>
        ) : (
          favorites.map((book: any, index) => (
            <View key={book._id || index} style={styles.favCard}>
              <Ionicons
                name="bookmark"
                size={18}
                color="#FFD700"
                style={{ marginRight: 8 }}
              />
              {/* textAlign: "left" yerine alignItems: "flex-start" kullandık */}
              <View style={{ flex: 1, alignItems: "flex-start" }}>
                <Text style={styles.favBookTitle}>
                  {book.title || "İsimsiz Kitap"}
                </Text>
                <Text style={styles.favBookAuthor}>
                  {book.author || "Bilinmeyen Yazar"}
                </Text>
              </View>
            </View>
          ))
        )}
      </View>

      {/* OTURUMU KAPAT */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={22} color="#FF3B30" />
        <Text style={styles.logoutText}>Oturumu Kapat</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5", padding: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  profileCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  infoText: {
    fontSize: 16,
    color: "#444",
    marginBottom: 10,
    textAlign: "left",
  },
  bioDisplayBox: {
    backgroundColor: "#e9ecef",
    padding: 15,
    borderRadius: 8,
    marginTop: 15,
    borderLeftWidth: 4,
    borderLeftColor: "#3498db",
  },
  savedBioText: {
    marginTop: 6,
    fontStyle: "italic",
    color: "#555",
    fontSize: 15,
    textAlign: "left",
  },
  bioForm: { marginTop: 20 },
  label: {
    fontWeight: "bold",
    marginBottom: 8,
    fontSize: 14,
    color: "#333",
    textAlign: "left",
  },
  textarea: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: "#444",
    textAlignVertical: "top",
    minHeight: 80,
    marginBottom: 12,
  },
  saveBtn: {
    backgroundColor: "#2ecc71",
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  saveBtnText: { color: "white", fontWeight: "bold", fontSize: 16 },
  favoritesSection: { marginBottom: 20 },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
    textAlign: "left",
  },
  favCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 3,
  },
  favBookTitle: { fontSize: 16, fontWeight: "bold", color: "#222" },
  favBookAuthor: {
    fontSize: 13,
    color: "#666",
    marginTop: 2,
    fontStyle: "italic",
  },
  emptyText: {
    color: "#888",
    fontStyle: "italic",
    marginTop: 10,
    textAlign: "left",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 40,
    borderWidth: 1,
    borderColor: "#FFD6D6",
  },
  logoutText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "bold",
    color: "#FF3B30",
  },
});
