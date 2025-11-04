const isProduction = process.env.NODE_ENV === "production";

console.log("PRODUCTION :- ",isProduction)
console.log("REDIS_USERNAME :- ",process.env.REDIS_USERNAME)

export const env = {
  MONGO_URL: process.env.MONGO_URL || "mongodb://localhost:27017/CodeMaze",
  PORT: process.env.PORT || 5000,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,
  NODE_ENV: process.env.NODE_ENV || "development",
  FRONTEND_URL: isProduction ? process.env.FRONTEND_URL : "http://localhost:3000",
  ACCESS_TOKEN_SECRET: isProduction ? process.env.ACCESS_TOKEN_SECRET : "access_token@123",
  REFRESH_TOKEN_SECRET: isProduction ? process.env.REFRESH_TOKEN_SECRET : "refresh_token@123",
  VERIFY_TOKEN_SECRET: isProduction ? process.env.VERIFY_TOKEN_SECRET : "verify_token@123",
  RESET_TOKEN_SECRET: isProduction ? process.env.RESET_TOKEN_SECRET : "reset_token@123",
  JWT_SECRET: isProduction ? process.env.JWT_SECRET : "jwt_secret@123",
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
  GITHUB_CALLBACK_URL: process.env.GITHUB_CALLBACK_URL,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET,
  REDIS_USERNAME: process.env.REDIS_USERNAME,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD,
  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PORT: process.env.REDIS_PORT,
};
