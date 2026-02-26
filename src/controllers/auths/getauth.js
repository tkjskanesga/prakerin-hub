import logger from "@/lib/logger";
import db from "@/database/db";
import { auths } from "@/database/schema";
import verifyTurnstile from "@/lib/turnstile";
import GetAuthValidator from "@/validator/auths/getauth";
import { ComparePassword } from "@/lib/bcrypt";
import { toAuthToken } from "@/lib/jwt";
import globalVariable from "@/lib/global-variable";

export default async function GetAuthController({ system = {}, data = {} }) {
  const logaction = logger.child({ controller: "auths/getauth" });
  // Validator
  const validate = GetAuthValidator(data);
  if (!!validate) {
    return validate;
  }
  // Verify Turnstile
  const verifyTurnstileResult = await verifyTurnstile({
    token: String(data.token || ""),
    ip: String(system.ip || ""),
  });
  logaction.debug({ verifyTurnstileResult });
  if (verifyTurnstileResult.error) {
    return {
      error: verifyTurnstileResult.error,
    };
  }
  if (!verifyTurnstileResult.isSuccess) {
    return {
      error: "getauth:turnstile-token-invalid",
    };
  }
  // Check Database
  const getUser = await db.query.users.findFirst({
    where: (users, { eq, or }) =>
      or(eq(users.username, data.username), eq(users.email, data.username)),
  });
  // Compare Password
  const pwHash = await ComparePassword(
    String(data.password || ""),
    getUser?.password || "",
  );
  // User Not Found
  if (!getUser) {
    return {
      error: "getauth:user-not-found",
    };
  }
  // Password Not Match
  logaction.debug({ pwHash });
  if (!pwHash) {
    return {
      error: "getauth:password-not-match",
    };
  }
  // Insert Session
  const [insertAuth] = await db
    .insert(auths)
    .values({
      user_id: getUser.id,
      ip: String(system?.ip || ""),
      user_agent: String(system?.headers?.["user-agent"] || ""),
      location: String(system?.location || "Unknown Location"),
    })
    .returning({ id: auths.id });
  // Create JWT Token
  const createToken = toAuthToken({
    user_id: getUser.id,
    auth_id: insertAuth.id,
  });
  logaction.info({ createToken });
  // Return Response
  return {
    set_cookie: [
      {
        key: globalVariable.authorization.name,
        value: createToken,
        options: {
          maxAge: globalVariable.authorization.max_age,
          httpOnly: true,
        },
      },
    ],
    headers: {
      "X-Auth-Name": globalVariable.authorization.name,
      "X-Auth-Value": createToken,
    },
    data: {
      success: true,
      token_save: globalVariable.authorization.name,
      token: createToken,
    },
  };
}
