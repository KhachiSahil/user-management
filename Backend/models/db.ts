import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Neon requires SSL; the connection string already has sslmode=require,
  // but adding ssl here avoids “self‑signed cert” errors in some setups.
  ssl: { rejectUnauthorized: false },
});
