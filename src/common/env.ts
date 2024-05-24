import 'dotenv/config';

// Database Environment Variables
export const DATABASE_HOST = process.env.DATABASE_HOST;
export const DATABASE_PORT = +process.env.DATABASE_PORT;
export const DATABASE_USER = process.env.DATABASE_USER;
export const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD;
export const DATABASE_NAME = process.env.DATABASE_NAME;

// JWT Environment Variables
export const JWT_ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET;
export const JWT_ACCESS_TOKEN_EXPIRATION_TIME =
  process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME;
export const JWT_REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_TOKEN_SECRET;
export const JWT_REFRESH_TOKEN_EXPIRATION_TIME =
  process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME;

// PASSWORD Environment Variables
export const SALT_ROUNDS = +process.env.SALT_ROUNDS;
