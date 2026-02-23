import "./dotenv";
import axios from "axios";
import logger from "./logger";

const disabledTurnstile = process.env.TURNSTILE_DISABLE === "true";

async function verifyTurnstile({ token, ip }) {
  const logaction = logger.child({ system: "turnstile" })
  const formData = new FormData();
  formData.append("secret", process.env.TURNSTILE_SECRET_KEY);
  formData.append("response", token);
  formData.append("remoteip", ip);
  logaction.debug({ token, ip, disabledTurnstile });
  try {
    if (disabledTurnstile) {
      logaction.debug("Turnstile disabled");
      return {
        isSuccess: true,
        isError: false,
      };
    }
    const response = await axios.post(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      formData,
    );
    logaction.debug({ res: response.data, status: response.status });
    return {
      isSuccess: response.data.success,
      isError: false,
    };
  } catch (error) {
    logaction.error({ error });
    if(error.response) {
      return {
        isSuccess: false,
        isError: true,
        error: "system:turnstile-error-failed",
      };
    }
    return {
      isSuccess: false,
      isError: true,
      error: "system:turnstile-logic-crash",
    };
  }
}

export default verifyTurnstile;
