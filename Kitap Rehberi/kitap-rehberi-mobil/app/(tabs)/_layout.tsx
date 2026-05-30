import { Ionicons } from "@expo/vector-icons"; // Hazır ikon kütüphanesi
import { Tabs } from "expo-router";
import React from "react";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#007AFF", // Aktif olan menünün rengi
        headerStyle: { backgroundColor: "#fff" },
        headerShadowVisible: false,
      }}
    >
      {/* Ana Sayfa Menüsü */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Kitaplar",
          tabBarIcon: ({ color }) => (
            <Ionicons name="book" size={26} color={color} />
          ),
        }}
      />

      {/* Profilim ve Çıkış Menüsü */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profilim",
          tabBarIcon: ({ color }) => (
            <Ionicons name="person" size={26} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
