import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, Button, StyleSheet, TouchableOpacity } from "react-native";
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("cart.db");

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchProducts();
    createTable();
  }, []);

  const fetchProducts = async () => {
    setRefreshing(true);
    const response = await fetch("https://fakestoreapi.com/products");
    const data = await response.json();
    setProducts(data);
    setRefreshing(false);
  };

  const createTable = () => {
    db.transaction((tx) => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS cart (id INTEGER PRIMARY KEY AUTOINCREMENT, product_id INTEGER, title TEXT, image TEXT, price REAL, quantity INTEGER);`
      );
    });
  };

  const addToCart = (product) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM cart WHERE product_id = ?",
        [product.id],
        (_, { rows }) => {
          if (rows.length > 0) {
            tx.executeSql(
              "UPDATE cart SET quantity = quantity + 1 WHERE product_id = ?",
              [product.id]
            );
          } else {
            tx.executeSql(
              "INSERT INTO cart (product_id, title, image, price, quantity) VALUES (?, ?, ?, ?, ?)",
              [product.id, product.title, product.image, product.price, 1]
            );
          }
        }
      );
    });
  };

  return (
    <FlatList
      data={products}
      keyExtractor={(item) => item.id.toString()}
      refreshing={refreshing}
      onRefresh={fetchProducts}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Image source={{ uri: item.image }} style={styles.image} />
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.price}>${item.price}</Text>
          <Text style={styles.description}>{item.description.substring(0, 50)}...</Text>
          <Button title="Добавить в корзину" onPress={() => addToCart(item)} />
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  card: { padding: 10, margin: 10, backgroundColor: "#fff", borderRadius: 5 },
  image: { width: "100%", height: 150, resizeMode: "contain" },
  title: { fontWeight: "bold", fontSize: 16, marginVertical: 5 },
  price: { color: "green", marginBottom: 5 },
  description: { fontSize: 12, color: "#555" },
});
