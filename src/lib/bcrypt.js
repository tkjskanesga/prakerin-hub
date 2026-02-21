import bcrypt from "bcrypt";

export async function HashPassword(password) {
  return await bcrypt.hash(password, 10);
}

export async function ComparePassword(password, hash) {
  return await bcrypt.compare(password, hash);
}
