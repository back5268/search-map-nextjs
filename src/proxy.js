import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function proxy(req) {
  const token = req.cookies.get("token")?.value;
  const url = req.nextUrl.pathname;

  if (url.startsWith("/api/auth") || url === "/api/test")
    return NextResponse.next();
  if (!token) {
    if (url.startsWith("/auth")) return NextResponse.next();
    else return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    await jwtVerify(token, secret);
    if (url.startsWith("/auth"))
      return NextResponse.redirect(new URL("/", req.url));
    return NextResponse.next();
  } catch (e) {
    const res = NextResponse.redirect(new URL("/auth/login", req.url));
    res.cookies.delete("token"); // 👈 xóa token rác
    return res;
  }
}

// 🔧 Chạy middleware cho tất cả route trừ _next và static files
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images/|icons/|fonts/).*)",
  ],
};

