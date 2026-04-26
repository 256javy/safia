import { describe, expect, it } from "vitest";
import {
  validateEmail,
  validateUsername,
  validatePhone,
  validateBirthdate,
  validatePasswordCreate,
  validateCode,
} from "@/lib/validations";

describe("validateEmail", () => {
  it("required when empty", () => expect(validateEmail("")).toBe("required"));
  it("invalid format", () => expect(validateEmail("not-an-email")).toBe("email.invalid"));
  it("missing TLD", () => expect(validateEmail("foo@bar")).toBe("email.invalid"));
  it("valid email passes", () => expect(validateEmail("a@b.co")).toBeNull());
});

describe("validateUsername", () => {
  it("required when empty", () => expect(validateUsername("")).toBe("required"));
  it("rejects too short", () => expect(validateUsername("ab")).toBe("username.invalid"));
  it("rejects uppercase", () => expect(validateUsername("Foo")).toBe("username.invalid"));
  it("rejects spaces", () => expect(validateUsername("foo bar")).toBe("username.invalid"));
  it("accepts lowercase + digits + dot/underscore", () => {
    expect(validateUsername("user.name_42")).toBeNull();
  });
});

describe("validatePhone", () => {
  it("required when empty", () => expect(validatePhone("")).toBe("required"));
  it("rejects garbage", () => expect(validatePhone("not-a-phone")).toBe("phone.invalid"));
  it("accepts E.164", () => expect(validatePhone("+14155552671")).toBeNull());
});

describe("validateBirthdate", () => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const iso = (y: number) => `${y}-01-01`;

  it("required when empty", () => expect(validateBirthdate("")).toBe("required"));
  it("rejects garbage", () => expect(validateBirthdate("not-a-date")).toBe("birthdate.invalid"));
  it("rejects future date", () => expect(validateBirthdate(iso(yyyy + 1))).toBe("birthdate.invalid"));
  it("rejects age 12", () => expect(validateBirthdate(iso(yyyy - 12))).toBe("birthdate.tooYoung"));
  it("accepts age 13", () => expect(validateBirthdate(iso(yyyy - 13))).toBeNull());
  it("rejects age 130+", () => expect(validateBirthdate(iso(yyyy - 131))).toBe("birthdate.invalid"));
});

describe("validatePasswordCreate", () => {
  it("required when empty", () => expect(validatePasswordCreate("")).toBe("required"));
  it("rejects too short", () => expect(validatePasswordCreate("aB1$")).toBe("password.tooShort"));
  it("rejects weak (<2)", () => {
    expect(validatePasswordCreate("aaaaaaaaa")).toBe("password.tooWeak");
  });
  it("accepts strong unique passphrase", () => {
    expect(validatePasswordCreate("correct-purple-elephant-bicycle-7421-zebra")).toBeNull();
  });
  it("respects minLength override", () => {
    expect(validatePasswordCreate("Abc12345", { minLength: 16 })).toBe("password.tooShort");
  });
});

describe("validateCode", () => {
  it("required when empty", () => expect(validateCode("")).toBe("required"));
  it("rejects 5 digits", () => expect(validateCode("12345")).toBe("code.invalid"));
  it("rejects letters", () => expect(validateCode("abcdef")).toBe("code.invalid"));
  it("accepts 6 digits", () => expect(validateCode("123456")).toBeNull());
  it("strips whitespace", () => expect(validateCode("123 456")).toBeNull());
});
