import crypto from "node:crypto";

export function GenerateID_Hex(len = 14) {
  return crypto.randomBytes(len).toString("hex");
}

export function GenerateID_Base(len) {
  return crypto.randomBytes(len).toString("base64url");
}
