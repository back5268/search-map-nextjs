import { convertToExcel } from "@/lib/excel";
import { connectDB } from "@/lib/mongoose";
import { listCompanyMd } from "@/models/Company";
import { NextResponse } from "next/server";

// 🟩 GET - Lấy danh sách
export async function GET(req) {
  try {
    await connectDB();
    const [data] = await Promise.all([
      listCompanyMd({}),
    ]);
    const list = [["STT", "Địa chỉ", "Tên công ty", "Mã số thuế", "Chủ kinh doanh", "Mô tả", "Giấy phép kinh doanh", "Hồ sơ PCCC"]]
    data.forEach((d, index) => {
        list.push([index + 1, d.address, d.name || "", d.tax || "", d.owner || "", d.description || "", d.files?.join(", "), d.pccc?.join(", ")])
    })

    const buffer = await convertToExcel(list, { format: true });
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="data.xlsx"`,
      },
    });
  } catch (error) {
    console.log("Excel export error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
