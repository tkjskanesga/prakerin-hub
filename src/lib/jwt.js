import jwt from "jsonwebtoken";
import isJson from "is-json";

const passkey = String(process.env.APP_JWT_SECRET || "NoSecret!");

export function toAuthToken(data = {}) {
  return jwt.sign(
    {
      ...data,
      time: new Date().getTime(),
    },
    passkey,
    {
      algorithm: "HS256",
      expiresIn: "80d", // 8 Hari
    },
  );
}

export function toAuthData(tokenStr = "") {
  try {
    const extractedData = jwt.verify(tokenStr, passkey);
    return {
      ...extractedData,
      error: false,
    };
  } catch (e) {
    console.log("[Jsonwebtoken]:", e);
    return { error: true };
  }
}

export function validateJWT(tokenStr = "") {
  const openTokenVariable = String(
    typeof tokenStr !== "string" ? "" : tokenStr || "",
  ).trim();
  // Format : [header, payload, signature]
  const [headerJWT, payloadJWT] = openTokenVariable.split(".");
  if (!(headerJWT.startsWith("eyJ") && payloadJWT.startsWith("eyJ"))) {
    return false;
  }
  // Checking buffer base64 is validation json
  if (!isJson(Buffer.from(headerJWT, "base64").toString())) {
    return false;
  }
  if (!isJson(Buffer.from(payloadJWT, "base64").toString())) {
    return false;
  }
  // Valid!
  return true;
}
