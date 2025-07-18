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

  console.log("Reqest URL: ", request.url);
  console.log("Reqest URL: ", request);

  const accessToken = request.cookies.get("accessToken")?.value;
  console.log("ACCESS TOKENN ", accessToken);

  if (!accessToken) {
    console.log("No access token found. Redirecting to login...");
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  try {
    const response = await axiosInstance.post("/users/verify-admin", {},{headers:{
      Authorization: `Bearer ${accessToken}`,
    }});

    console.log("Response ",response)

    if (!response.data.approved) {
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
