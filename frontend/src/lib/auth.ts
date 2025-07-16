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
    redirect("/auth/login");
  }

  let decoded: any;
  try {
    decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!);
  } catch (err) {
    console.log(err);
    redirect("/auth/login");
  }

  if (requiredRole && decoded.role !== requiredRole) {
    redirect("/home");
  }

  return decoded as AuthUser;
}
