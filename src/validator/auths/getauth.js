import { z } from "zod";
import seishiroZodValidator from "@/lib/zod-validate.js";

const GetAuthValidatorSchema = z.object({
  token: z
    .string("input-field-type-string|name:Token")
    .min(1, "input-field-min|name:Token|min:1")
    .optional(),
  username: z
    .string("input-field-type-string|name:Username")
    .min(1, "input-field-min|name:Username|min:1"),
  password: z
    .string("input-field-type-string|name:Password")
    .min(1, "input-field-min|name:Password|min:1"),
});

export default function GetAuthValidator(data) {
  return seishiroZodValidator(
    "getauth",
    GetAuthValidatorSchema,
    data,
  );
}
