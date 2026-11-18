import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(1, "Informe seu nome.").max(100, "O nome deve ter até 100 caracteres."),
  email: z.string().trim().email("Informe um e-mail válido.").max(255, "O e-mail deve ter até 255 caracteres."),
  message: z.string().trim().min(1, "Escreva sua mensagem.").max(2000, "A mensagem deve ter até 2.000 caracteres."),
  website: z.string().max(0, "Não foi possível registrar a mensagem."),
});