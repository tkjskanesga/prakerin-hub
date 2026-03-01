import { RegistryBuilder } from "seishiro";
import AuthMiddleware from "@/middleware/auths";
import GetAuthController from "@/controllers/auths/getauth";
import LogoutController from "@/controllers/auths/logout";
import UpdatePasswordController from "@/controllers/auths/update-password";
import MiddlewareInfo from "@/controllers/auths/middleware-info";

const registry = new RegistryBuilder();

function TurnstileWidget() {
  return {
    data: {
      script: "https://challenges.cloudflare.com/turnstile/v0/api.js",
      siteKey: String(process.env.TURNSTILE_SITE_KEY || ""),
    },
  };
}

// Middleware
registry.set("mid:turnstile-widget", TurnstileWidget); // Turnstile Widget
registry.set("mid:getauth", GetAuthController); // Login
registry.set("mid:logout", LogoutController, AuthMiddleware); // Logout
registry.set("mid:update-password", UpdatePasswordController, AuthMiddleware); // Update Password
registry.set("mid:middleware", MiddlewareInfo, AuthMiddleware); // Middleware Info

export default registry;
