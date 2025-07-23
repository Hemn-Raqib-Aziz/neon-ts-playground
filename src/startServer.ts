import app from "./server";
import pool from "./database/db";
import { PORT, SERVER_URL } from "./config/config";
import { initializeDatabase } from "./database/init";

async function startServer() {
  try {
    await pool.query("SELECT 1"); // Basic DB connectivity test
    console.log("✅ Connected to PostgreSQL database.");

    await initializeDatabase(); // ← Check and initialize tables if needed

    app.listen(PORT, () => {
      console.log(`🚀 Server running at:\n${SERVER_URL}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
