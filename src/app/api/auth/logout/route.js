import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ status: 1 });
  res.cookies.delete("token");
  return res;
}
