import { env } from "@config/env";

export const getCookieOptions = (maxAge?: number) => ({
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: (env.NODE_ENV === "production" ? "none" : "lax") as
    | "none"
    | "lax"
    | "strict",
  domain: undefined,
  path: "/",
  ...(maxAge ? { maxAge } : {}),
});
