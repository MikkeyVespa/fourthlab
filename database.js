import * as SQLite from "expo-sqlite";

let db;

export const initializeDatabase = async () => {
  try {
    db = await SQLite.openDatabaseAsync("cart");

    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS cart (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        price REAL,
        description TEXT
      );
    `);

    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Failed to initialize database:", error);
  }
};

export const addToCart = async (product) => {
  try {
    if (!db) {
      throw new Error("Database is not initialized");
    }

    const result = await db.runAsync(
      "INSERT INTO cart (title, price, description) VALUES (?, ?, ?)",
      product.title,
      product.price,
      product.description
    );

    console.log(`${product.title} has been added to the cart`);
    return result.changes;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const getAllGoods = async () => {
  try {
    if (!db) {
      throw new Error("Database is not initialized");
    }

    const allRows = await db.getAllAsync("SELECT * FROM cart");
    console.log(`Received ${allRows.length} items from the cart`);
    return allRows;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};