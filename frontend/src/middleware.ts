import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const middleware = async (request: NextRequest) => {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/auth")) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get("accessToken")?.value;

  console.log("Access Token: ", accessToken);

  if (!accessToken) {
    console.log("No AccessToken");
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next();
};

export default middleware;

export const config = {
  matcher: [
    "/home/:path*",
    "/profile/:path*",
    "/admin/:path*",
    "/domain/:path*",
    "/market/:path*",
  ],
};
