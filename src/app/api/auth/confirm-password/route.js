import bcrypt from 'bcryptjs';
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import { detailAccountMd, updateAccountMd } from "@/models/Account";

export async function POST(req) {
  try {
    const { username, otp, password } = await req.json();
    await connectDB();
    const account = await detailAccountMd({ username });
    if (!account)
      return NextResponse.json(
        { mess: "Tài khoản không tồn tại!" },
        { status: 400 }
      );
    if (account.status === 0)
      return NextResponse.json(
        {
          mess: "Tài khoản của bạn đã bị khóa, vui lòng liên hệ quản trị viên!",
        },
        { status: 400 }
      );
    if (
      String(account.otp) !== String(otp) ||
      new Date() - new Date(account.timeSendOtp) > 5 * 60 * 1000
    )
      return NextResponse.json(
        {
          mess: "Mã xác nhận không đúng hoặc đã hết hạn!",
        },
        { status: 400 }
      );
    const salt = await bcrypt.genSalt(10);
    const newPassword = await bcrypt.hash(password, salt);
    await updateAccountMd(
      { _id: account._id },
      { password: newPassword, token: "", otp: "" }
    );
    return NextResponse.json({ status: 1 });
  } catch (err) {
    return NextResponse.json({ mess: err.message }, { status: 500 });
  }
}
