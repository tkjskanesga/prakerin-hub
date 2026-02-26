import { RegistryBuilder } from "seishiro";
import AuthMiddleware from "@/middleware/auths";
import GetAuthController from "@/controllers/auths/getauth";

const registry = new RegistryBuilder();

// Middleware
registry.set("mid:turnstile-widget", () => {
  return {
    data: {
      script: "https://challenges.cloudflare.com/turnstile/v0/api.js",
      siteKey: String(process.env.TURNSTILE_SITE_KEY || ""),
    },
  };
}); // Turnstile Widget
registry.set("mid:getauth", GetAuthController); // Login
registry.set("mid:middleware", ({ middleware }) => {
  console.log(middleware);
  return { data: middleware.data }
}, AuthMiddleware); // Middleware
registry.set("mid:update-password", () => { }, null); // Update Password
registry.set("mid:logout", () => { }, null); // Logout
// Wizard Setup
registry.set("wizard:create-default-admin", () => { }, null); // Buat Akun Admin Platform Pertama!

export default registry;
