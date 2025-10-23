import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongoose";
import { detailAccountMd, updateAccountMd } from "@/models/User";

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req) {
  try {
    const { username, password } = await req.json();
    await connectDB();

    const account = await detailAccountMd({ username });
    if (!account)
      return NextResponse.json(
        { mess: "Tài khoản không tồn tại" },
        { status: 400 }
      );

    const ok = await bcrypt.compare(password, account.password);
    if (!ok)
      return NextResponse.json(
        { mess: "Mật khẩu không chính xác" },
        { status: 400 }
      );

    const token = jwt.sign({ id: account._id, username }, JWT_SECRET, {
      expiresIn: "1d",
    });
    await updateAccountMd({ username }, { lastLogin: new Date() });
    const res = NextResponse.json({ success: true });
    res.cookies.set("token", token, { httpOnly: true });
    return res;
  } catch (err) {
    console.log(err);
    
    return NextResponse.json({ mess: err.message }, { status: 500 });
  }
}
