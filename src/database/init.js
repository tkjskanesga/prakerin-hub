import "@/lib/dotenv";

function toNumberInt(num) {
  if (typeof num !== "string") return undefined;
  const isNaIT = String(num);
  const numbers = Number.isNaN(isNaIT)
    ? 1
    : parseInt(isNaIT.replace(/[^\d.-]+/g, "") || "0");
  return typeof numbers === "number" ? numbers : parseInt(numbers, 0);
}
const configdb = {
  host: process.env?.DB_HOST || "localhost",
  user: process.env?.DB_USERNAME || "postgres",
  port: toNumberInt(process.env?.DB_PORT),
  password: process.env?.DB_PASSWORD,
  database: process.env?.DB_DATABASE || "taskit",
  max: toNumberInt(process.env?.DB_CLIENT_MAX),
  ssl: !!process.env?.DB_ENABLESSL
    ? {
        rejectUnauthorized: true,
        ca: process.env?.DB_CA_CERT,
      }
    : undefined,
};

export default configdb;
