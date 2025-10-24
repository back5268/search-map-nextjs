import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import { deleteAccountMd, detailAccountMd, updateAccountMd } from "@/models/Account";

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    await connectDB();
    return NextResponse.json({
      status: 1,
      data: await detailAccountMd({ _id: id }),
    });
  } catch (err) {
    return NextResponse.json({ mess: err.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { fullName, email, username, password, status } = body;

    await connectDB();

    const checkAccount = await detailAccountMd({ _id: id });
    if (!checkAccount)
      return NextResponse.json({
        status: 0,
        mess: "Không tìm thấy người dùng!",
      });

    if (email) {
      const checkEmail = await detailAccountMd({ email });
      if (checkEmail && checkEmail._id.toString() !== id)
        return NextResponse.json({
          status: 0,
          mess: "Email đã tồn tại!",
        });
    }

    if (username) {
      const checkUsername = await detailAccountMd({ username });
      if (checkUsername && checkUsername._id.toString() !== id)
        return NextResponse.json({
          status: 0,
          mess: "Tài khoản đã tồn tại!",
        });
    }

    let newPassword = checkAccount.password;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      newPassword = await bcrypt.hash(password, salt);
    }

    const data = await updateAccountMd(
      { _id: id },
      {
        fullName,
        email,
        username,
        password: newPassword,
        status
      }
    );

    return NextResponse.json({ status: 1, data });
  } catch (err) {
    return NextResponse.json({ mess: err.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    await connectDB();
    return NextResponse.json({
      status: 1,
      data: await deleteAccountMd({ _id: id }),
    });
  } catch (err) {
    return NextResponse.json({ mess: err.message }, { status: 500 });
  }
}
