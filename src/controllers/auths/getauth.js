import verifyTurnstile from "@/lib/turnstile";
import db from "@/database/db";
import logger from "@/lib/logger";
import { ComparePassword } from "@/lib/bcrypt";

export default async function GetAuthController({ system = {}, data = {} }) {
  const logaction = logger.child({ path: "controllers/auths/getauth" })
  // Validator

  // Verify Turnstile
  const verifyTurnstileResult = await verifyTurnstile({
    token: String(data.token || ""),
    ip: String(system.ip || ""),
  });
  logaction.debug({ verifyTurnstileResult })
  if(verifyTurnstileResult.error) {
    return {
      error: verifyTurnstileResult.error,
    }
  }
  if(!verifyTurnstileResult.isSuccess) {
    return {
      error: "system:turnstile-token-invalid",
    }
  }
  // Check Database
  const pwHash = await ComparePassword(
    String(data.password || ""),
    "",
  )
  logaction.debug({ pwHash })
  // Wait... uh
}