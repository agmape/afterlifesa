import { useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { CheckCircle2, LoaderCircle, Mail, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { contactSchema } from "@/lib/contact-schema";
import { submitContact } from "@/lib/contact.functions";

export function ContactForm() {
  const send = useServerFn(submitContact);
  const [pending, setPending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const form = event.currentTarget;
    const fields = new FormData(form);
    const result = contactSchema.safeParse(Object.fromEntries(fields));
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Confira os campos.");
      return;
    }
    setPending(true);
    setError("");
    try {
      await send({ data: result.data });
      form.reset();
      setSuccess(true);
    } catch {
      setError("Não foi possível registrar sua mensagem. Tente novamente ou fale pelo WhatsApp.");
    } finally {
      setPending(false);
    }
  }

  return (
    <section id="contato" className="relative border-t border-border/60">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 sm:px-8 lg:grid-cols-2">
        <div>
          <Mail className="mb-5 h-7 w-7 text-accent" aria-hidden="true" />
          <h2 className="font-display text-5xl text-foreground sm:text-7xl">FALE COM O AFTERLIFE</h2>
          <p className="mt-5 break-all text-lg text-accent">gui.99gb@gmail.com</p>
        </div>
        {success ? (
          <div role="status" className="flex flex-col items-start justify-center gap-4">
            <CheckCircle2 className="h-9 w-9 text-accent" aria-hidden="true" />
            <h3 className="font-display text-3xl">MENSAGEM REGISTRADA</h3>
            <p className="text-muted-foreground">Sua mensagem ficou registrada para a equipe do Afterlife.</p>
            <Button variant="outline" onClick={() => setSuccess(false)}>Enviar outra mensagem</Button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-5" aria-label="Contato com o Afterlife">
            <div>
              <label htmlFor="contact-name" className="mb-2 block text-sm font-semibold">Nome</label>
              <Input id="contact-name" name="name" autoComplete="name" required maxLength={100} className="h-12" disabled={pending} />
            </div>
            <div>
              <label htmlFor="contact-email" className="mb-2 block text-sm font-semibold">Seu e-mail</label>
              <Input id="contact-email" name="email" type="email" autoComplete="email" required maxLength={255} className="h-12" disabled={pending} />
            </div>
            <div>
              <label htmlFor="contact-message" className="mb-2 block text-sm font-semibold">Mensagem</label>
              <Textarea id="contact-message" name="message" required maxLength={2000} rows={5} disabled={pending} />
            </div>
            <div hidden aria-hidden="true"><input name="website" tabIndex={-1} autoComplete="off" /></div>
            {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
            <Button type="submit" disabled={pending} className="h-12 w-full bg-accent text-accent-foreground hover:bg-accent/90">
              {pending ? <LoaderCircle className="animate-spin" aria-hidden="true" /> : <Send aria-hidden="true" />}
              {pending ? "Registrando…" : "Enviar mensagem"}
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}