import logger from "@/lib/logger";
import db from "@/database/db";
import { eq } from "drizzle-orm";
import { auths } from "@/database/schema";
import LogoutValidator from "@/validator/auths/logout";
import globalVariable from "@/lib/global-variable";

export default async function LogoutController({
  middleware = {},
  data = { type_logout: "current" },
}) {
  const logaction = logger.child({ controller: "auths/logout" });
  // Validator
  const validate = LogoutValidator(data);
  logaction.debug({ validate });
  if (!!validate) {
    return validate;
  }
  // Checking Middleware
  if (middleware.error) {
    logaction.debug({ error: middleware.error });
    return middleware;
  }
  // What Auth To Logout
  if (!["all", "current"].includes(data.type_logout)) {
    logaction.debug({ error: "logout:invalid-type-logout" });
    return {
      error: "logout:invalid-type-logout",
      params: [
        {
          select: "all,current",
        },
      ],
    };
  }
  if (data.type_logout === "current") {
    logaction.debug({ delete: "current" });
    await db.delete(auths).where(eq(auths.id, middleware.data.auth.id));
  } else {
    logaction.debug({ delete: "all" });
    await db
      .delete(auths)
      .where(eq(auths.user_id, middleware.data.user.profile.id));
  }
  return {
    rm_cookie: [globalVariable.authorization.name],
    headers: {
      "X-Auth-Name": globalVariable.authorization.name,
      "X-Auth-Value": "",
    },
    data: {
      success: true,
      $_snackbar: {
        title:
          data.type_logout === "all"
            ? "Berhasil mengeluarkan semua sesi!"
            : "Berhasil keluar dari sesi ini!",
        type: "success",
      },
    },
  };
}
