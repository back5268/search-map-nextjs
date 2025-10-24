import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import {
  countCompanyMd,
  createCompanyMd,
  detailCompanyMd,
  listCompanyMd,
} from "@/models/Company";

// 🟩 GET - Lấy danh sách
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const name = searchParams.get("name") || "";
    const address = searchParams.get("address") || "";
    const status = searchParams.get("status");

    await connectDB();

    const where = {};
    if (name)
      where.$or = [
        { name: { $regex: name, $options: "i" } },
        { tax: { $regex: name, $options: "i" } },
      ];
    if (address) where.address = address;
    if (status !== null) where.status = Number(status);

    const [data, count] = await Promise.all([
      listCompanyMd(where, page, limit),
      countCompanyMd(where),
    ]);

    return NextResponse.json({
      status: 1,
      data: { data, count },
    });
  } catch (err) {
    return NextResponse.json({ mess: err.message }, { status: 500 });
  }
}

// 🟨 POST - Tạo mới
export async function POST(req) {
  try {
    const body = await req.json();
    const {
      name,
      tax,
      address,
      description,
      color,
      location,
      coords,
      type
    } = body;

    await connectDB();

    const checkName = await detailCompanyMd({ name });
    if (checkName)
      return NextResponse.json({ status: 0, mess: "Tên công ty đã tồn tại!" });

    const checkTax = await detailCompanyMd({ tax });
    if (checkTax)
      return NextResponse.json({ status: 0, mess: "Mã số thuế đã tồn tại!" });

    const data = await createCompanyMd({
      name,
      tax,
      address,
      description,
      color,
      location,
      coords,
      status: 1,
      type
    });

    return NextResponse.json({ status: 1, data });
  } catch (err) {
    return NextResponse.json({ mess: err.message }, { status: 500 });
  }
}
