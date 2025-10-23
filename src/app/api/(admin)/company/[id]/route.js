import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import {
  deleteCompanyMd,
  detailCompanyMd,
  updateCompanyMd,
} from "@/models/Company";

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    await connectDB();
    return NextResponse.json({
      status: 1,
      data: await detailCompanyMd({ _id: id }),
    });
  } catch (err) {
    return NextResponse.json({ mess: err.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const {
      name,
      tax,
      address,
      description,
      color,
      type,
      location,
      coords,
      status,
    } = body;

    await connectDB();

    if (name) {
      const checkName = await detailCompanyMd({ name });
      if (checkName && checkName._id.toString() !== id)
        return NextResponse.json({
          status: 0,
          mess: "Tên công ty đã tồn tại!",
        });
    }

    if (tax) {
      const checkTax = await detailCompanyMd({ tax });
      if (checkTax && checkTax._id.toString() !== id)
        return NextResponse.json({ status: 0, mess: "Mã số thuế đã tồn tại!" });
    }

    const data = await updateCompanyMd(
      { _id: id },
      {
        name,
        tax,
        address,
        description,
        color,
        type,
        location,
        coords,
        status,
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
      data: await deleteCompanyMd({ _id: id }),
    });
  } catch (err) {
    return NextResponse.json({ mess: err.message }, { status: 500 });
  }
}
