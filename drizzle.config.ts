import type { Config } from "drizzle-kit";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

export default {
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config; 