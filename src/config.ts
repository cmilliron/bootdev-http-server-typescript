import dotenv from "dotenv";
import type { MigrationConfig } from "drizzle-orm/migrator";

// Type Declarations

type Config = {
  api: APIConfig;
  db: DBConfig;
  jwt: JWTConfig;
};

type DBConfig = {
  url: string;
  migrationConfig: MigrationConfig;
};

type JWTConfig = {
  defaultDuration: number;
  refreshDuration: number;
  secret: string;
  issuer: string;
};

type APIConfig = {
  fileserverHits: number;
  platform: string;
  port: number;
};

process.loadEnvFile();

const migrationConfig: MigrationConfig = {
  migrationsFolder: "./src/lib/db/migrations",
};

export const config: Config = {
  api: {
    fileserverHits: 0,
    platform: envOrThrow("PLATFORM"),
    port: Number(envOrThrow("PORT")),
  },
  db: {
    url: envOrThrow("DB_URL"),
    migrationConfig,
  },
  jwt: {
    defaultDuration: 60 * 60, // 1 hour in seconds
    refreshDuration: 60 * 60 * 24 * 60 * 1000, // 60 days in milliseconds
    secret: envOrThrow("JWT_SECRET"),
    issuer: "chirpy",
  },
};

function envOrThrow(key: string): string {
  if (!process.env[key]) {
    throw new Error(`Fatal Error. Environment variable ${key} is missing`);
  }
  return process.env[key];
}
