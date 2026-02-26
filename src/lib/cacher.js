import Redis from "ioredis";
import memjs from "memjs";
import logger from "./logger";

const host = (process.env.CACHER_HOST || null);
const type = (process.env.CACHER_TYPE || "redis").toLowerCase();
const port = process.env.CACHER_PORT || (type === "memcache" ? 11211 : 6379);
const useSsl = process.env.CACHER_SSL === "true";

let client = null;
let isEnabled = false;

if (host) {
  try {
    if (type === "redis" || type === "valkey") {
      client = new Redis({
        host: host,
        port: port,
        tls: useSsl ? {} : undefined,
        retryStrategy: (times) => Math.min(times * 50, 2000),
        connectTimeout: 5000, 
      });
      isEnabled = true;
    } else if (type === "memcache") {
      client = memjs.Client.create(`${host}:${port}`, {
        tls: useSsl ? {} : undefined
      });
      isEnabled = true;
    }
  } catch (err) {
    logger.error({ system: "cacher", function: "init", error: err.message });
  }
}

export async function Set(key, value, options = { expire: 3600 }) {
  if (!isEnabled) return false;
  const logaction = logger.child({ system: "cacher", function: "Set" });
  try {
    const data = JSON.stringify(value);
    if (type === "memcache") {
      await client.set(key, data, { expires: options.expire });
    } else {
      await client.set(key, data, "EX", options.expire);
    }
    return true;
  } catch (err) {
    logaction.error({ error: err.message });
    return false;
  }
}

export async function Get(key) {
  if (!isEnabled) return null;
  const logaction = logger.child({ system: "cacher", function: "Get" });
  try {
    if (type === "memcache") {
      const { value } = await client.get(key);
      return value ? JSON.parse(value.toString()) : null;
    } else {
      const data = await client.get(key);
      return data ? JSON.parse(data) : null;
    }
  } catch (err) {
    logaction.error({ error: err.message });
    return null;
  }
}

export async function Del(key) {
  if (!isEnabled) return false;
  const logaction = logger.child({ system: "cacher", function: "Del" });
  try {
    if (type === "redis" || type === "valkey") {
      if (key.includes("*")) {
        let cursor = "0";
        let keysFound = [];
        do {
          const reply = await client.scan(cursor, "MATCH", key, "COUNT", 100);
          cursor = reply[0];
          keysFound.push(...reply[1]);
        } while (cursor !== "0");

        if (keysFound.length > 0) {
          await client.del(keysFound);
          return true;
        }
        return false;
      }
      const res = await client.del(key);
      return res > 0;
    } else {
      await client.delete(key);
      return true;
    }
  } catch (err) {
    logaction.error({ error: err.message });
    return false;
  }
}

export async function List(pattern) {
  if (!isEnabled) return [];
  const logaction = logger.child({ system: "cacher", function: "List" });
  try {
    if (type === "redis" || type === "valkey") {
      let cursor = "0";
      let keys = [];
      do {
        const reply = await client.scan(cursor, "MATCH", pattern, "COUNT", 100);
        cursor = reply[0];
        keys.push(...reply[1]);
      } while (cursor !== "0");
      return keys;
    }
    return [];
  } catch (err) {
    logaction.error({ error: err.message });
    return [];
  }
}