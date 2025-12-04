import { connectDB } from "@/lib/mongoose";
import { detailCompanyMd } from "@/models/Company";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const address = searchParams.get("address") || "";
    if (!address)
      return NextResponse.json({
        status: 1,
        data: null,
      });

    await connectDB();
    const where = {};
    where.address = { $regex: address, $options: "i" };
    const [data] = await Promise.all([detailCompanyMd(where)]);

    return NextResponse.json({
      status: 1,
      data,
    });
  } catch (err) {
    return NextResponse.json({ mess: err.message }, { status: 500 });
  }
}
