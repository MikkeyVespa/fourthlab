import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, Button, StyleSheet } from "react-native";
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("database");

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = () => {
    db.transaction((tx) => {
      tx.executeSql("SELECT * FROM cart", [], (_, { rows }) => {
        setCartItems(rows._array);
      });
    });
  };

  const incrementQuantity = (productId) => {
    db.transaction((tx) => {
      tx.executeSql("UPDATE cart SET quantity = quantity + 1 WHERE product_id = ?", [productId], fetchCartItems);
    });
  };

  const decrementQuantity = (productId) => {
    db.transaction((tx) => {
      tx.executeSql(
        "UPDATE cart SET quantity = quantity - 1 WHERE product_id = ? AND quantity > 1",
        [productId],
        fetchCartItems
      );
    });
  };

  return (
    <FlatList
      data={cartItems}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Image source={{ uri: item.image }} style={styles.image} />
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.price}>${item.price}</Text>
          <Text>Количество: {item.quantity}</Text>
          <View style={styles.buttons}>
            <Button title="+" onPress={() => incrementQuantity(item.product_id)} />
            <Button title="-" onPress={() => decrementQuantity(item.product_id)} />
          </View>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  card: { padding: 10, margin: 10, backgroundColor: "#fff", borderRadius: 5 },
  image: { width: 80, height: 80, resizeMode: "contain" },
  title: { fontWeight: "bold", fontSize: 16, marginVertical: 5 },
  price: { color: "green", marginBottom: 5 },
  buttons: { flexDirection: "row", justifyContent: "space-around", marginTop: 10 },
});
