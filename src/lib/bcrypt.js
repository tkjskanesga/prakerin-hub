import bcrypt from "bcrypt";
import logger from "./logger";

export async function HashPassword(password) {
  const logaction = logger.child({
    path: "lib/bcrypt",
    function: "HashPassword",
  });
  try {
    logaction.info({ password });
    const hash = await bcrypt.hash(password, 10);
    logaction.debug({ hash });
    return hash;
  } catch (error) {
    logaction.error({ error });
    return false;
  }
}

export async function ComparePassword(password, hash) {
  const logaction = logger.child({
    path: "lib/bcrypt",
    function: "ComparePassword",
  });
  try {
    logaction.info({ password, hash });
    const result = await bcrypt.compare(password, hash);
    logaction.debug({ result });
    return result;
  } catch (error) {
    logaction.error({ error });
    return false;
  }
}
