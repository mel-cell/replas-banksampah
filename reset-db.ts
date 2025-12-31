import { Client } from "pg";

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function resetDb() {
  try {
    await client.connect();
    console.log("🔥 Dropping all tables in public schema...");
    await client.query("DROP SCHEMA public CASCADE; CREATE SCHEMA public;");
    await client.query("GRANT ALL ON SCHEMA public TO postgres;");
    await client.query("GRANT ALL ON SCHEMA public TO public;");
    console.log("✅ Database reset successfully.");
    await client.end();
  } catch (err: any) {
    console.error("❌ Reset failed:", err.message);
  }
}

resetDb();
