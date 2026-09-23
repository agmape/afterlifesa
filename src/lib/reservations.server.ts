export type ReservationStatus =
  | "pending"
  | "paid"
  | "processing"
  | "failed"
  | "cancelled"
  | "expired"
  | "refunded";

export type Reservation = {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  reservation_date: string;
  reservation_time: string;
  guests: number;
  amount_cents: number;
  slot_capacity: number;
  status: ReservationStatus;
  hold_expires_at: string;
  mercado_pago_order_id: string | null;
  mercado_pago_checkout_url: string | null;
  mercado_pago_status: string | null;
  mercado_pago_status_detail: string | null;
  created_at: string;
  updated_at: string;
};

export const RESERVATION_PRICE_CENTS = 2000;
export const SLOT_CAPACITY = 30;
export const MAX_GUESTS_PER_BOOKING = 8;
export const HOLD_MINUTES = 30;
export const RESERVATION_SLOTS = ["20:00", "21:00", "22:00", "23:00"] as const;

function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Supabase não configurado. Defina SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no ambiente do servidor.",
    );
  }

  return { url, serviceRoleKey };
}

async function supabaseRequest<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const { url, serviceRoleKey } = getSupabaseConfig();
  const headers = new Headers(init.headers);
  headers.set("apikey", serviceRoleKey);
  headers.set("Authorization", `Bearer ${serviceRoleKey}`);
  headers.set("Content-Type", "application/json");

  const response = await fetch(`${url}/rest/v1/${path}`, {
    ...init,
    headers,
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Supabase ${response.status}: ${detail}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export function saoPauloToday() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export function validateReservationDate(date: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;

  const today = saoPauloToday();
  if (date < today) return false;

  const max = new Date(`${today}T12:00:00-03:00`);
  max.setDate(max.getDate() + 60);
  const maxDate = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(max);

  return date <= maxDate;
}

export async function listReservationsForDate(date: string) {
  return supabaseRequest<Reservation[]>(
    `reservations?reservation_date=eq.${encodeURIComponent(date)}&select=*`,
  );
}

export async function getReservationById(id: string) {
  const rows = await supabaseRequest<Reservation[]>(
    `reservations?id=eq.${encodeURIComponent(id)}&select=*&limit=1`,
  );
  return rows[0] ?? null;
}

export async function createReservationHold(input: {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  reservationDate: string;
  reservationTime: string;
  guests: number;
}) {
  const amountCents = RESERVATION_PRICE_CENTS * input.guests;
  const holdExpiresAt = new Date(
    Date.now() + HOLD_MINUTES * 60 * 1000,
  ).toISOString();

  try {
    const rows = await supabaseRequest<Reservation[]>(
      "reservations?select=*",
      {
        method: "POST",
        headers: { Prefer: "return=representation" },
        body: JSON.stringify({
          customer_name: input.customerName,
          customer_email: input.customerEmail,
          customer_phone: input.customerPhone,
          reservation_date: input.reservationDate,
          reservation_time: input.reservationTime,
          guests: input.guests,
          amount_cents: amountCents,
          slot_capacity: SLOT_CAPACITY,
          status: "pending",
          hold_expires_at: holdExpiresAt,
        }),
      },
    );

    const reservation = rows[0];
    if (!reservation) {
      throw new Error("Reserva não foi criada.");
    }

    return reservation;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (message.includes("slot_capacity_exceeded")) {
      throw new Error("Esse horário não possui vagas suficientes.");
    }
    throw error;
  }
}

export async function updateReservation(
  id: string,
  patch: Partial<
    Pick<
      Reservation,
      | "status"
      | "mercado_pago_order_id"
      | "mercado_pago_checkout_url"
      | "mercado_pago_status"
      | "mercado_pago_status_detail"
    >
  >,
) {
  const rows = await supabaseRequest<Reservation[]>(
    `reservations?id=eq.${encodeURIComponent(id)}&select=*`,
    {
      method: "PATCH",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify(patch),
    },
  );
  return rows[0] ?? null;
}

export function isActiveReservation(reservation: Reservation) {
  if (reservation.status === "paid") return true;
  if (reservation.status !== "pending" && reservation.status !== "processing") {
    return false;
  }
  return new Date(reservation.hold_expires_at).getTime() > Date.now();
}

export function publicReservation(reservation: Reservation) {
  return {
    id: reservation.id,
    reservationDate: reservation.reservation_date,
    reservationTime: reservation.reservation_time,
    guests: reservation.guests,
    amountCents: reservation.amount_cents,
    status: reservation.status,
    paymentStatus: reservation.mercado_pago_status,
    paymentStatusDetail: reservation.mercado_pago_status_detail,
  };
}
