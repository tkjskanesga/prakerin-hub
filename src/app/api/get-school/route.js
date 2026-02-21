import { FindCardSearch, GetDetailSchool } from "@/scrapper/sekolah-kita";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    // Get Detail School
    const { searchParams } = new URL(req.url);
    const reqdata = await GetDetailSchool({
      id: String(searchParams.get("id") || "").trim(),
    });
    return NextResponse.json(reqdata, {
      status: reqdata.status,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      status: 500,
      message: "Internal Server Error",
    });
  }
}

export async function POST(req) {
  try {
    // Get List School
    const jsonbody = await req.json();
    const sendpayload = {
      type_school: String(jsonbody?.type_school || "").trim(),
      search: String(jsonbody?.search || "").trim(),
      page: isNaN(Number(jsonbody?.page)) ? 0 : Number(jsonbody.page),
    };
    const reqdata = await FindCardSearch(sendpayload);
    return NextResponse.json(reqdata, {
      status: reqdata.status,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      status: 500,
      message: "Internal Server Error",
    });
  }
}
