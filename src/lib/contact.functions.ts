import { createServerFn } from "@tanstack/react-start";
import { contactSchema } from "./contact-schema";

export const submitContact = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => contactSchema.parse(input))
  .handler(async ({ data }) => {
    // Public write-only action: no arbitrary destination and no private reads.
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("contact_submissions").insert({
      name: data.name,
      email: data.email,
      message: data.message,
    });
    if (error) {
      console.error("Contact submission failed", { code: error.code });
      throw new Error("Não foi possível registrar a mensagem. Tente novamente.");
    }
    return { recorded: true };
  });