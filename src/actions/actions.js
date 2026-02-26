import { Actions, PolicyBuilder } from "seishiro";
import registry from "./registry/index";
import message from "./message";

const policy = new PolicyBuilder({
  passkey: String(process.env.SEISHIRO_PASSKEY || "NoSecret!"),
  version_now: "1.0.1",
  version_min: "1.0.1",
  version_forceupdate: true,
  skip_middleware_context: true,
});

const action = new Actions({
  registry: registry,
  message: message,
  policy: policy,
});

export default action;
