const isProduction = process.env.NODE_ENV === "production";

export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  FRONTEND_URL: isProduction ? process.env.FRONTEND_URL : "http://localhost:3000",
  ACCESS_TOKEN_SECRET: isProduction ? process.env.ACCESS_TOKEN_SECRET : "access_token@123",
  REFRESH_TOKEN_SECRET: isProduction ? process.env.REFRESH_TOKEN_SECRET : "refresh_token@123",
};
