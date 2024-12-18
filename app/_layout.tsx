// /app/_layout.js
import { Tabs } from "expo-router";

export default function Layout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="tabs/index"
        options={{ title: "Список товаров" }}
      />
      <Tabs.Screen
        name="tabs/cart"
        options={{ title: "Корзина" }}
      />
    </Tabs>
  );
}
