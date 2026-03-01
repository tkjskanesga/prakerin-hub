import { z } from "zod";
import seishiroZodValidator from "@/lib/zod-validate.js";

const UpdatePasswordValidatorSchema = z.object({
  old_password: z
    .string("input-field-type-string|name:Old Password")
    .min(1, "input-field-min|name:Old Password|min:1")
    .optional(),
  new_password: z
    .string("input-field-type-string|name:New Password")
    .min(1, "input-field-min|name:New Password|min:1")
    .optional(),
  confirm_password: z
    .string("input-field-type-string|name:Confirm Password")
    .min(1, "input-field-min|name:Confirm Password|min:1")
    .optional(),
});

export default function UpdatePasswordValidator(data) {
  return seishiroZodValidator(
    "update-password",
    UpdatePasswordValidatorSchema,
    data,
  );
}
