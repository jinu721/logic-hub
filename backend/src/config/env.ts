import dotenv from "dotenv";

dotenv.config();

const isProduction = process.env.NODE_ENV === "production";

const getEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;
  if (!value) {
    if (isProduction) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
    console.warn(`[WARN] Missing environment variable: ${key}`);
    return "";
  }
  return value;
};

export const env = {
  MONGO_URL: getEnv("MONGO_URL", "mongodb://localhost:27017/CodeMaze"),
  PORT: parseInt(getEnv("PORT", "5000"), 10),
  EMAIL_USER: getEnv("EMAIL_USER"),
  EMAIL_PASS: getEnv("EMAIL_PASS"),
  NODE_ENV: getEnv("NODE_ENV", "development"),
  FRONTEND_URL: getEnv("FRONTEND_URL", "http://localhost:3000"),
  
  ACCESS_TOKEN_SECRET: getEnv("ACCESS_TOKEN_SECRET", isProduction ? undefined : "access_token@123"),
  REFRESH_TOKEN_SECRET: getEnv("REFRESH_TOKEN_SECRET", isProduction ? undefined : "refresh_token@123"),
  VERIFY_TOKEN_SECRET: getEnv("VERIFY_TOKEN_SECRET", isProduction ? undefined : "verify_token@123"),
  RESET_TOKEN_SECRET: getEnv("RESET_TOKEN_SECRET", isProduction ? undefined : "reset_token@123"),
  JWT_SECRET: getEnv("JWT_SECRET", isProduction ? undefined : "jwt_secret@123"),

  GOOGLE_CLIENT_ID: getEnv("GOOGLE_CLIENT_ID"),
  GOOGLE_CLIENT_SECRET: getEnv("GOOGLE_CLIENT_SECRET"),
  GOOGLE_CALLBACK_URL: getEnv("GOOGLE_CALLBACK_URL"),
  GITHUB_CLIENT_ID: getEnv("GITHUB_CLIENT_ID"),
  GITHUB_CLIENT_SECRET: getEnv("GITHUB_CLIENT_SECRET"),
  GITHUB_CALLBACK_URL: getEnv("GITHUB_CALLBACK_URL"),

  CLOUDINARY_CLOUD_NAME: getEnv("CLOUDINARY_CLOUD_NAME"),
  CLOUDINARY_API_KEY: getEnv("CLOUDINARY_API_KEY"),
  CLOUDINARY_API_SECRET: getEnv("CLOUDINARY_API_SECRET"),
  RAZORPAY_KEY_ID: getEnv("RAZORPAY_KEY_ID"),
  RAZORPAY_KEY_SECRET: getEnv("RAZORPAY_KEY_SECRET"),

  REDIS_USERNAME: getEnv("REDIS_USERNAME", ""), 
  REDIS_PASSWORD: getEnv("REDIS_PASSWORD", ""),
  REDIS_HOST: getEnv("REDIS_HOST"),
  REDIS_PORT: parseInt(getEnv("REDIS_PORT", "6379"), 10),

  PISTON_URL: getEnv("PISTON_URL"),
  CODE_RUN_TIMEOUT: parseInt(getEnv("CODE_RUN_TIMEOUT", "3000"), 10),
  CODE_COMPILE_TIMEOUT: parseInt(getEnv("CODE_COMPILE_TIMEOUT", "10000"), 10),
  CODE_RUN_MEMORY_LIMIT: parseInt(getEnv("CODE_RUN_MEMORY_LIMIT", "128"), 10),
  CODE_COMPILE_MEMORY_LIMIT: parseInt(getEnv("CODE_COMPILE_MEMORY_LIMIT", "128"), 10),
};
