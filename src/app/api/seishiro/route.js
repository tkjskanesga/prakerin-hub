import { NextResponse } from "next/server";
import { ActionTools } from "seishiro";
import logger from "@/lib/logger";
import actions from "@/actions/actions";

export async function POST(req) {
  try {
    const payload = await ActionTools.NextJS.ActionRequest(req);
    const response = await actions.APIAction(payload);
    return ActionTools.NextJS.ActionResponse(req, response);
  } catch (e) {
    logger.error("[API Route Error]:", e.stack);
    return NextResponse.json(
      {
        status: 500,
        message: "Ups..., Internal server error",
      },
      { status: 500 },
    );
  }
}
