import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen() {
  const router = useRouter();

  // Kullanıcının girdiği verileri tuttuğumuz state'ler
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // Yükleniyor animasyonu için

  // API'ye istek atacak olan ana fonksiyon
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Uyarı", "Lütfen e-posta ve şifrenizi girin.");
      return;
    }

    setLoading(true);

    try {
      // 1. Canlıdaki REST API'mize POST isteği atıyoruz
      const response = await axios.post(
        "https://kitap-rehberi-api.onrender.com/auth/login",
        {
          email: email,
          password: password,
        },
      );

      // 2. Başarılı olursa, API'den dönen Token'ı yakala
      const token = response.data.token;

      // 3. Token'ı uygulamanın (telefonun) güvenli hafızasına kaydet
      await AsyncStorage.setItem("userToken", token);

      // 4. Ana sayfaya (kitap listesine) yönlendir
      router.replace("/(tabs)");
    } catch (error: any) {
      console.log("Giriş hatası:", error);
      // Hatayı tam olarak ekranda görelim
      Alert.alert("Giriş Başarısız", `Hata Mesajı: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kitap Rehberi</Text>
      <Text style={styles.subtitle}>Hesabınıza giriş yapın</Text>

      {/* E-posta Input */}
      <TextInput
        style={styles.input}
        placeholder="E-posta adresiniz"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* Şifre Input */}
      <TextInput
        style={styles.input}
        placeholder="Şifreniz"
        value={password}
        onChangeText={setPassword}
        secureTextEntry // Şifreyi yıldızlı gösterir
      />

      {/* Giriş Butonu */}
      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading} // Yüklenirken butona tekrar basılmasını engelle
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Giriş Yap</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

// Tasarım (UI) Ayarları
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 32,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
