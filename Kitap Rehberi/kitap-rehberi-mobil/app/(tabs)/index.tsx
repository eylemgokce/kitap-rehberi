import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function HomeScreen() {
  const router = useRouter(); // Dinamik yönlendirme için eklendi
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]); // Filtrelenmiş listeyi tutar
  const [searchQuery, setSearchQuery] = useState(""); // Arama metni
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) return;

      const response = await axios.get(
        "https://kitap-rehberi-api.onrender.com/books",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setBooks(response.data);
      setFilteredBooks(response.data); // İlk başta tüm kitapları göster
    } catch (error) {
      console.log("Kitap çekme hatası:", error);
      Alert.alert("Bağlantı Hatası", "Kitaplar yüklenirken bir sorun oluştu.");
    } finally {
      setLoading(false);
    }
  };

  // Arama çubuğuna her yazı yazıldığında tetiklenen filtreleme fonksiyonu
  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text.trim() === "") {
      setFilteredBooks(books);
    } else {
      const filtered = books.filter((book: any) => {
        const title = (book.title || book.kitapAdi || "").toLowerCase();
        const author = (book.author || book.yazar || "").toLowerCase();
        const search = text.toLowerCase();
        return title.includes(search) || author.includes(search);
      });
      setFilteredBooks(filtered);
    }
  };

  const renderBookItem = ({ item }: { item: any }) => (
    <View style={styles.bookCard}>
      <Text style={styles.bookTitle}>
        {item.title || item.kitapAdi || "İsimsiz Kitap"}
      </Text>
      <Text style={styles.bookAuthor}>
        {item.author || item.yazar || "Bilinmeyen Yazar"}
      </Text>

      {/* Detayları Gör Butonu Eklendi */}
      <TouchableOpacity
        style={styles.detailBtn}
        onPress={() => router.push(`/books/${item._id}`)} // Dinamik rotamıza yönlendirir
      >
        <Text style={styles.detailBtnText}>Detayları Gör</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>📚 Kitaplarım</Text>

      {/* Arama Çubuğu (Search Bar) */}
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color="#888"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Kitap veya yazar ara..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#007AFF"
          style={{ marginTop: 30 }}
        />
      ) : filteredBooks.length === 0 ? (
        <Text style={styles.emptyText}>Aranan kitap bulunamadı.</Text>
      ) : (
        <FlatList
          data={filteredBooks}
          keyExtractor={(item, index) =>
            item._id ? item._id.toString() : index.toString()
          }
          renderItem={renderBookItem}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, height: 45, fontSize: 16, color: "#333" },
  bookCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#007AFF",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 4,
  },
  bookAuthor: { fontSize: 14, color: "#666", fontStyle: "italic" },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#888",
    marginTop: 30,
  },
  // Yeni Eklenen Buton Stilleri
  detailBtn: {
    marginTop: 10,
    backgroundColor: "#E8F4FD",
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: "center",
  },
  detailBtnText: {
    color: "#007AFF",
    fontWeight: "bold",
    fontSize: 14,
  },
});
