import dotenv from "dotenv";
import type { MigrationConfig } from "drizzle-orm/migrator";

dotenv.config();

const migrationConfig: MigrationConfig = {
  migrationsFolder: "./src/lib/db/migrations",
};

type APIConfig = {
  fileserverHits: number;
  platform: string;
  db: {
    dbURL: string;
    migrationConfig: MigrationConfig;
  };
  secret: string;
};

export const config: APIConfig = {
  fileserverHits: 0,
  platform: envOrThrow("PLATFORM"),
  db: {
    dbURL: envOrThrow("DB_URL"),
    migrationConfig,
  },
  secret: envOrThrow("JWT_SECRET"),
};

function envOrThrow(key: string): string {
  if (!process.env[key]) {
    throw new Error(`Fatal Error. Environment variable ${key} is missing`);
  }
  return process.env[key];
}
