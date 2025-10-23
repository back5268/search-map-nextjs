import { NextResponse } from "next/server";

export async function POST() {
    const res = NextResponse.json({ success: true, message: "Đã đăng xuất" });
    res.cookies.delete("token");
    return res;
}
