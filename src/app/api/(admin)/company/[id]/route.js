import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import {
  deleteCompanyMd,
  detailCompanyMd,
  updateCompanyMd,
} from "@/models/Company";
import { uploadFileToFirebase } from "@/lib/firebase";

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
    const status = formData.get("status") || 1

    const files = formData.getAll("files");
    const pccc = formData.getAll("pccc");

    const filez = [],
      pcccz = [];
    if (Array.isArray(files)) {
      for (const item of files) {
        if (typeof item === "string") filez.push(item);
        else filez.push(await uploadFileToFirebase(item));
      }
    }
    if (Array.isArray(pccc)) {
      for (const item of pccc) {
        if (typeof item === "string") pcccz.push(item);
        else pcccz.push(await uploadFileToFirebase(item));
      }
    }

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
        status,
        owner,
        files: filez,
        pccc: pcccz,
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
