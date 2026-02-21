import "./dotenv";
import axios from "axios";
import logger from "./logger";

async function verifyTurnstile({ token, ip }) {
  const formData = new FormData();
  formData.append("secret", process.env.TURNSTILE_SECRET_KEY);
  formData.append("response", token);
  formData.append("remoteip", ip);
  logger.debug("[Debug Token Turnstile]:", token);
  try {
    const response = await axios.post(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      formData,
    );
    logger.debug("[Debug Response Turnstile]:", response.data);
    return {
      isSuccess: response.data.success,
      isError: false,
    };
  } catch (error) {
    logger.error("Error verifying Turnstile:", error);
    return {
      isSuccess: false,
      isError: true,
      error: "system:turnstile-error-failed",
    };
  }
}

export default verifyTurnstile;
