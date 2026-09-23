# Reservas + Mercado Pago

## Fluxo

1. Cliente abre `/reservar`.
2. Escolhe data, horário, quantidade de pessoas e informa contato.
3. O backend cria uma reserva `pending` no Supabase e segura as vagas.
4. O backend cria uma Order do Checkout Pro no Mercado Pago.
5. O cliente é redirecionado para o `checkout_url`.
6. O Mercado Pago envia o evento **Order (Mercado Pago)** para `/api/mercadopago/webhook`.
7. O backend valida a assinatura do webhook, consulta a Order diretamente no Mercado Pago e atualiza a reserva.
8. A tela `/reserva/status` acompanha a confirmação.

## Variáveis de ambiente

Nunca exponha as chaves abaixo com prefixo `VITE_`.

```env
MERCADO_PAGO_ACCESS_TOKEN=
MERCADO_PAGO_WEBHOOK_SECRET=
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
```

## Banco

Crie um projeto no Supabase e execute `supabase/reservations.sql` no SQL Editor.

A tabela usa RLS sem policies públicas. Toda leitura e gravação é feita server-side com a Service Role Key.

O trigger `reservations_capacity_guard` usa advisory lock por data/horário para evitar overbooking em requisições simultâneas.

## Configuração atual

Os valores ficam em `src/lib/reservations.server.ts`:

- Preço antecipado: R$ 20,00 por pessoa
- Capacidade: 30 pessoas por horário
- Máximo por reserva: 8 pessoas
- Hold de pagamento: 30 minutos
- Horários: 20:00, 21:00, 22:00 e 23:00

## Mercado Pago

A integração usa a Orders API do Checkout Pro.

A URL de webhook publicada deve ser:

```
https://SEU-DOMINIO/api/mercadopago/webhook
```

Ative o evento **Order (Mercado Pago)** no painel da aplicação e copie a chave secreta gerada para `MERCADO_PAGO_WEBHOOK_SECRET`.

Use credenciais de teste até validar o fluxo completo. Em produção, substitua apenas o Access Token pelo de produção e configure o webhook no modo produtivo.
