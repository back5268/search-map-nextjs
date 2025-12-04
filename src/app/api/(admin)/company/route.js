import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import {
  countCompanyMd,
  createCompanyMd,
  detailCompanyMd,
  listCompanyMd,
} from "@/models/Company";
import { uploadFileToFirebase } from "@/lib/firebase";
import { checkJson } from "@/lib/helper";

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
    if (address) {
      where.address = { $regex: address, $options: "i" };
    }
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
    const formData = await req.formData();

    const name = formData.get("name");
    const tax = formData.get("tax");
    const address = formData.get("address");
    const description = formData.get("description");
    const color = formData.get("color");
    const location = formData.get("location");
    const coords = formData.get("coords");
    const type = formData.get("type");
    const owner = formData.get("owner");

    const files = formData.getAll("files");
    const pccc = formData.getAll("pccc");

    const filez = [],
      pcccz = [];
    if (Array.isArray(files)) {
      for (const item of files) {
        filez.push(await uploadFileToFirebase(item));
      }
    }
    if (Array.isArray(pccc)) {
      for (const item of pccc) {
        pcccz.push(await uploadFileToFirebase(item));
      }
    }

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
      location: checkJson(location) || location,
      coords: checkJson(coords) || coords,
      status: 1,
      type,
      owner,
      files: filez,
      pccc: pcccz,
    });

    return NextResponse.json({ status: 1, data });
  } catch (err) {
    return NextResponse.json({ mess: err.message }, { status: 500 });
  }
}
