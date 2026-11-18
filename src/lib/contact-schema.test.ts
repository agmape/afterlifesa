/// <reference types="bun" />
import { describe, expect, test } from "bun:test";
import { contactSchema } from "./contact-schema";

const valid = { name: "Teste", email: "visitante@example.com", message: "Contato", website: "" };
describe("contact validation", () => {
  test("accepts valid contact and trims whitespace", () => {
    expect(contactSchema.parse({ ...valid, name: " Teste " }).name).toBe("Teste");
  });
  test("rejects malformed email", () => {
    expect(contactSchema.safeParse({ ...valid, email: "invalido" }).success).toBe(false);
  });
  test("rejects empty message", () => {
    expect(contactSchema.safeParse({ ...valid, message: " " }).success).toBe(false);
  });
  test("rejects oversized message", () => {
    expect(contactSchema.safeParse({ ...valid, message: "a".repeat(2001) }).success).toBe(false);
  });
  test("rejects honeypot submissions", () => {
    expect(contactSchema.safeParse({ ...valid, website: "spam" }).success).toBe(false);
  });
});