import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { axiosInstance } from "./services/apiServices";

const adminRoutes = [
  "/admin/dashboard",
  "/admin/users",
  "/admin/inventory",
  "/admin/domains",
  "/admin/levels",
  "/admin/markets",
  "/admin/membership",
  "/admin/reports",
  "/admin/groups",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminRoute = adminRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (!isAdminRoute) {
    return NextResponse.next(); 
  }

  const accessToken = request.cookies.get("accessToken")?.value;

  if (!accessToken) {
    console.log("No access token found. Redirecting to login...");
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  try {
    const response = await axiosInstance.post("/users/verify-admin", {
      accessToken,
    });

    if (response.data.approved !== "admin") {
      console.log("Not an admin. Redirecting to login...");
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    console.log("Admin verified");
    return NextResponse.next(); 

  } catch (err) {
    console.log("Token invalid or expired:", err);
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }
}

export const config = {
  matcher: ["/admin/:path*"], 
};
