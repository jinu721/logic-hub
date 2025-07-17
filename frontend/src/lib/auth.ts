import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";

export interface AuthUser {
  userId: string;
  email: string;
  username: string;
  role: string;
  [key: string]: any;
}

export async function verifyUser(requiredRole?: string): Promise<AuthUser> {
  const cookieStore = cookies();
  const token = (await cookieStore).get("accessToken")?.value;

  if (!token) {
    console.log("No token found");
    redirect("/auth/login");
  }

  let decoded: any;
  try {
    console.log("Decoded token: ", decoded);
    decoded = jwt.verify(token, "sampleAccessTokenSecret123");
  } catch (err) {
    console.log("Token verification failed:", err);
    redirect("/auth/login");
  }

  console.log("Required role:", requiredRole);
  if (requiredRole && decoded.role !== requiredRole) {
    console.log("User role does not match required role");
    redirect("/home");
  }
  console.log("Completed user verification");
  return decoded as AuthUser;
}
