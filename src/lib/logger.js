import "./dotenv";
import pino from "pino";

const logger = pino({
  level: process.env.APP_DEBUG === "true" ? "debug" : "info",
  redact: {
    paths: [
      "password",
      "confirm_password",
      "update_password",
      "token_key",
      "user.token",
      "credit_card.number",
      "credit_card.cvv",
      "credit_card.expiry_month",
      "credit_card.expiry_year",
      "credit_card.name_on_card",
    ],
    placeholder: "*** REDACTED ***",
  },
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
    },
  },
});

export default logger;
