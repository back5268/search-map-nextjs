import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import {
  countAccountMd,
  createAccountMd,
  detailAccountMd,
  listAccountMd,
} from "@/models/Account";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const name = searchParams.get("name") || "";
    const status = searchParams.get("status");

    await connectDB();

    const where = {};
    if (name)
      where.$or = [
        { fullName: { $regex: name, $options: "i" } },
        { email: { $regex: name, $options: "i" } },
        { username: { $regex: name, $options: "i" } },
      ];
    if (status !== null) where.status = Number(status);

    const [data, count] = await Promise.all([
      listAccountMd(where, page, limit),
      countAccountMd(where),
    ]);

    return NextResponse.json({
      status: 1,
      data: { data, count },
    });
  } catch (err) {
    return NextResponse.json({ mess: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { fullName, email, username, password } = body;

    await connectDB();

    const checkUsername = await detailAccountMd({ username });
    if (checkUsername)
      return NextResponse.json({ status: 0, mess: "Tài khoản đã tồn tại!" });

    const checkEmail = await detailAccountMd({ email });
    if (checkEmail)
      return NextResponse.json({ status: 0, mess: "Email đã tồn tại!" });

    const salt = await bcrypt.genSalt(10);
    const newPassword = await bcrypt.hash(password, salt);
    const data = await createAccountMd({
      fullName,
      email,
      username,
      password: newPassword,
      status: 1,
    });

    return NextResponse.json({ status: 1, data });
  } catch (err) {
    return NextResponse.json({ mess: err.message }, { status: 500 });
  }
}
