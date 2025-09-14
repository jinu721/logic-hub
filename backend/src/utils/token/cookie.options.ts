import { env } from "../../config/env";


export const getCookieOptions = () => ({
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: env.NODE_ENV === "production" ? "none" : "lax",
  domain: env.NODE_ENV === "production" ? ".jinu.site" : undefined,
  path: "/",
});