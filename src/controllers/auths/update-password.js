import logger from "@/lib/logger";
import db from "@/database/db";
import { eq } from "drizzle-orm";
import { users } from "@/database/schema";
import { ComparePassword, HashPassword } from "@/lib/bcrypt";
import UpdatePasswordValidator from "@/validator/auths/update-password";

export default async function UpdatePasswordController({
  middleware = {},
  data = {
    old_password: "",
    new_password: "",
    confirm_password: "",
  },
}) {
  const logaction = logger.child({ controller: "auths/update-password" });
  // Validator
  const validate = UpdatePasswordValidator(data);
  logaction.debug({ validate });
  if (!!validate) {
    return validate;
  }
  // Checking Middleware
  if (middleware.error) {
    logaction.debug({ error: middleware.error });
    return middleware;
  }
  // Checking Data
  const { old_password, new_password, confirm_password } = data;
  // Checking Old Password
  const checkOldPassword = await db
    .select({ password: users.password })
    .from(users)
    .where(eq(users.id, middleware.data.user.profile.id));
  if (checkOldPassword.length === 0) {
    logaction.debug({ error: "Auth Not Found", response: checkOldPassword });
    return {
      error: "update-password:auth-not-found",
    };
  }
  // Checking Old Password Hash
  const checkOldPasswordHash = await ComparePassword(
    old_password,
    checkOldPassword[0].password,
  );
  if (!checkOldPasswordHash) {
    logaction.debug({ error: "Old password not match", response: checkOldPasswordHash });
    return {
      error: "update-password:old-password-not-match",
    };
  }
  // Checking New Password Don't Same Before
  const checkNewPasswordSameBefore = await ComparePassword(
    new_password,
    checkOldPassword[0].password,
  );
  if (checkNewPasswordSameBefore) {
    logaction.debug({ error: "Password same as before", response: checkNewPasswordSameBefore });
    return {
      error: "update-password:new-password-same-before",
    };
  }
  // Checking New Password
  if (new_password !== confirm_password) {
    logaction.debug({ error: "Password not match", response: { new_password, confirm_password } });
    return {
      error: "update-password:new-password-not-match",
    };
  }
  // Hashing New Password
  const newPasswordHash = await HashPassword(new_password);
  // Updating Password
  await db
    .update(users)
    .set({
      password: newPasswordHash,
    })
    .where(eq(users.id, middleware.data.user.profile.id));
  logaction.debug({ success: "password-updated" });
  return {
    data: {
      success: true,
      $_snackbar: {
        title: "Password berhasil diubah!",
        type: "success",
      },
    },
  };
}