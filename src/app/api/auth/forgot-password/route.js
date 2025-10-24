import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import { detailAccountMd, updateAccountMd } from "@/models/Account";
import { sendMailForgotPassword } from "@/lib/node-mailer";
import { generateNumber } from "@/lib/helper";

export async function POST(req) {
  try {
    const { username } = await req.json();
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
    const otp = generateNumber(6);
    const { status, mess } = await sendMailForgotPassword({
      to: account.email,
      username,
      otp,
    });
    if (status) {
      await updateAccountMd(
        { _id: account._id },
        { otp, timeSendOtp: new Date() }
      );
      return NextResponse.json({ status: 1, data: account.email });
    } else return NextResponse.json({ mess }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ mess: err.message }, { status: 500 });
  }
}
