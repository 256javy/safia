import { describe, expect, it } from "vitest";
import {
  emailField,
  usernameField,
  passwordField,
  currentPasswordField,
  birthdateField,
  genderField,
  phoneField,
  codeField,
  textField,
} from "@/features/simulator/engine/fields";

describe("field builders", () => {
  it("emailField defaults", () => {
    const f = emailField();
    expect(f.name).toBe("email");
    expect(f.type).toBe("email");
    expect(f.autoComplete).toBe("email");
    expect(f.validate?.("not-email", null as never)).toBe("email.invalid");
    expect(f.validate?.("a@b.co", null as never)).toBeNull();
  });

  it("usernameField runs uniqueness check", () => {
    const f = usernameField("instagram");
    expect(f.name).toBe("username");
    expect(f.validate?.("AB", null as never)).toBe("username.invalid");
    expect(f.validate?.("good_name", null as never)).toBeNull();
  });

  it("passwordField confirm vs newPassword", () => {
    const newPwd = passwordField("password");
    expect(newPwd.type).toBe("newPassword");
    expect(newPwd.meter).toBe(true);
    expect(newPwd.matches).toBeUndefined();

    const confirm = passwordField("passwordConfirm", { confirm: true });
    expect(confirm.type).toBe("confirmPassword");
    expect(confirm.matches).toBe("password");
    expect(confirm.validate).toBeUndefined();
  });

  it("currentPasswordField has current-password autocomplete", () => {
    const f = currentPasswordField();
    expect(f.autoComplete).toBe("current-password");
    expect(f.type).toBe("password");
  });

  it("birthdateField validates", () => {
    const f = birthdateField();
    expect(f.validate?.("not-a-date", null as never)).toBe("birthdate.invalid");
  });

  it("genderField has 4 options", () => {
    const f = genderField();
    expect(f.options).toHaveLength(4);
    expect(f.options?.map((o) => o.value)).toEqual(["female", "male", "other", "prefer_not"]);
  });

  it("phoneField defaults required false", () => {
    const f = phoneField();
    expect(f.required).toBe(false);
    expect(f.inputMode).toBe("tel");
  });

  it("codeField type by name", () => {
    expect(codeField("mfa").type).toBe("mfa");
    expect(codeField("recoveryCode").type).toBe("recoveryCode");
    expect(codeField("mfa").validate?.("12345", null as never)).toBe("code.invalid");
    expect(codeField("mfa").validate?.("123456", null as never)).toBeNull();
  });

  it("textField default required true", () => {
    const f = textField("nationalId");
    expect(f.required).toBe(true);
  });
});
