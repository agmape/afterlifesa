export type MercadoPagoOrder = {
  id: string;
  status: string;
  status_detail?: string;
  external_reference?: string;
  total_amount?: string;
  total_paid_amount?: string;
  checkout_url?: string;
};

function getAccessToken() {
  const token = process.env.MERCADO_PAGO_ACCESS_TOKEN;
  if (!token) {
    throw new Error(
      "Mercado Pago não configurado. Defina MERCADO_PAGO_ACCESS_TOKEN no ambiente do servidor.",
    );
  }
  return token;
}

async function mercadoPagoRequest<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${getAccessToken()}`);
  headers.set("Content-Type", "application/json");

  const response = await fetch(`https://api.mercadopago.com${path}`, {
    ...init,
    headers,
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Mercado Pago ${response.status}: ${detail}`);
  }

  return (await response.json()) as T;
}

export async function createCheckoutOrder(input: {
  reservationId: string;
  customerEmail: string;
  customerName: string;
  date: string;
  time: string;
  guests: number;
  unitPriceCents: number;
  origin: string;
}) {
  const totalCents = input.unitPriceCents * input.guests;
  const total = (totalCents / 100).toFixed(2);
  const unitPrice = (input.unitPriceCents / 100).toFixed(2);

  return mercadoPagoRequest<MercadoPagoOrder>("/v1/orders", {
    method: "POST",
    headers: {
      "X-Idempotency-Key": crypto.randomUUID(),
    },
    body: JSON.stringify({
      type: "online",
      processing_mode: "manual",
      total_amount: total,
      external_reference: input.reservationId,
      description: `Reserva Afterlife - ${input.date} às ${input.time}`,
      expiration_time: "PT30M",
      payer: {
        email: input.customerEmail,
        first_name: input.customerName.slice(0, 60),
      },
      items: [
        {
          external_code: "AFTERLIFE-RESERVA",
          title: "Reserva antecipada - Afterlife Pub",
          description: `${input.date} às ${input.time}`,
          quantity: input.guests,
          unit_price: unitPrice,
          unit_measure: "unit",
          total_amount: total,
        },
      ],
      config: {
        statement_descriptor: "AFTERLIFE",
        online: {
          success_url: `${input.origin}/reserva/status?reservation=${input.reservationId}&result=success`,
          failure_url: `${input.origin}/reserva/status?reservation=${input.reservationId}&result=failure`,
          pending_url: `${input.origin}/reserva/status?reservation=${input.reservationId}&result=pending`,
          auto_return: "approved",
        },
      },
    }),
  });
}

export async function getCheckoutOrder(orderId: string) {
  return mercadoPagoRequest<MercadoPagoOrder>(
    `/v1/orders/${encodeURIComponent(orderId)}`,
  );
}

function hexToBytes(hex: string) {
  if (!/^[0-9a-f]+$/i.test(hex) || hex.length % 2 !== 0) {
    return new Uint8Array();
  }
  const result = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    result[i / 2] = Number.parseInt(hex.slice(i, i + 2), 16);
  }
  return result;
}

export async function verifyMercadoPagoWebhook(input: {
  xSignature: string | null;
  xRequestId: string | null;
  dataId: string | null;
}) {
  const secret = process.env.MERCADO_PAGO_WEBHOOK_SECRET;
  if (!secret) {
    throw new Error(
      "Defina MERCADO_PAGO_WEBHOOK_SECRET para validar os webhooks.",
    );
  }

  if (!input.xSignature || !input.xRequestId || !input.dataId) {
    return false;
  }

  const parts = Object.fromEntries(
    input.xSignature.split(",").map((part) => {
      const [key, value] = part.split("=", 2).map((value) => value?.trim());
      return [key, value];
    }),
  );

  const ts = parts.ts;
  const v1 = parts.v1;
  if (!ts || !v1) return false;

  const dataId = input.dataId.toLowerCase();
  const manifest = `id:${dataId};request-id:${input.xRequestId};ts:${ts};`;
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"],
  );

  return crypto.subtle.verify(
    "HMAC",
    key,
    hexToBytes(v1),
    encoder.encode(manifest),
  );
}
