import logger from "@/lib/logger";
import db from "@/database/db";
import { auths } from "@/database/schema";
import verifyTurnstile from "@/lib/turnstile";
import GetAuthValidator from "@/validator/auths/getauth";
import { ComparePassword } from "@/lib/bcrypt";
import { toAuthToken } from "@/lib/jwt";
import globalVariable from "@/lib/global-variable";

export default async function GetAuthController({ system = {}, data = {} }) {
  //
}
