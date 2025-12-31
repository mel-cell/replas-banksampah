import { Client } from "pg";

console.log("Testing Database Connection...");
console.log("URL:", process.env.DATABASE_URL);

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function testConnection() {
  try {
    await client.connect();
    console.log("✅ Connection Successful!");
    const res = await client.query("SELECT NOW()");
    console.log("Time from DB:", res.rows[0]);
    await client.end();
  } catch (err: any) {
    console.error("❌ Connection Failed:", err.message);
  }
}

testConnection();
