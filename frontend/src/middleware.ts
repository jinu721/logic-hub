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

  console.log("Reqest URL: ", request.url);

  const accessToken = request.cookies.get("accessToken")?.value;
  console.log("ACCESS TOKENN ", accessToken);

  const isAuthRoute = pathname.startsWith("/auth/login") || pathname.startsWith("/auth/register");

  if (isAuthRoute && accessToken) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  if (!isAdminRoute) {
    return NextResponse.next();
  }

  if (!accessToken) {
    console.log("No access token found. Redirecting to login...");
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  try {
    const response = await axiosInstance.post("/users/verify-admin", {}, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      }
    });

    const result = response.data.result;

    console.log("Data: ", result);

    if (!result.approved) {
      console.log("Not an admin. Redirecting to login...");
      return NextResponse.redirect(new URL("/home", request.url));
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
