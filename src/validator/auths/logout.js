import { z } from "zod";
import seishiroZodValidator from "@/lib/zod-validate.js";

const LogoutValidatorSchema = z.object({
  type_logout: z
    .string("input-field-type-string|name:Type Logout")
    .min(1, "input-field-min|name:Type Logout|min:1")
    .optional(),
});

export default function LogoutValidator(data) {
  return seishiroZodValidator(
    "logout",
    LogoutValidatorSchema,
    data,
  );
}
