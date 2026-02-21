import { NextResponse } from "next/server";
import actions from "@/actions/actions";

export async function ALL(req) {
  const responsebook = await actions.BookRegistry();
  return NextResponse.json(responsebook);
}
export { ALL as GET, ALL as POST, ALL as PUT };
