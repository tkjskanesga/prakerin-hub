import { RegistryBuilder } from "seishiro";

const registry = new RegistryBuilder();

// Middleware
registry.set("mid:turnstile-widget", () => {}); // Turnstile Widget
registry.set("mid:getauth", () => {}); // Login
registry.set("mid:middleware", () => {}, null); // Middleware
registry.set("mid:update-password", () => {}, null); // Update Password
registry.set("mid:logout", () => {}, null); // Logout
// Wizard Setup
registry.set("wizard:create-admin-first", () => {}, null); // Buat Akun Admin Platform Pertama!

export default registry;
