import { describe, test } from "node:test";
import { strict as assert } from "node:assert";
import { contactSchema } from "./contact-schema";

const valid = { name: "Teste", email: "visitante@example.com", message: "Contato", website: "" };
describe("contact validation", () => {
  test("accepts valid contact and trims whitespace", () => {
    assert.equal(contactSchema.parse({ ...valid, name: " Teste " }).name, "Teste");
  });
  test("rejects malformed email", () => {
    assert.equal(contactSchema.safeParse({ ...valid, email: "invalido" }).success, false);
  });
  test("rejects empty message", () => {
    assert.equal(contactSchema.safeParse({ ...valid, message: " " }).success, false);
  });
  test("rejects oversized message", () => {
    assert.equal(contactSchema.safeParse({ ...valid, message: "a".repeat(2001) }).success, false);
  });
  test("rejects honeypot submissions", () => {
    assert.equal(contactSchema.safeParse({ ...valid, website: "spam" }).success, false);
  });
});