import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import {
  MAX_GUESTS_PER_BOOKING,
  RESERVATION_PRICE_CENTS,
  RESERVATION_SLOTS,
  SLOT_CAPACITY,
  createReservationHold,
  isActiveReservation,
  listReservationsForDate,
  updateReservation,
  validateReservationDate,
} from "@/lib/reservations.server";
import { createCheckoutOrder } from "@/lib/mercadopago.server";

const createReservationSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(160),
  phone: z.string().trim().min(8).max(30),
  date: z.string(),
  time: z.enum(RESERVATION_SLOTS),
  guests: z.coerce.number().int().min(1).max(MAX_GUESTS_PER_BOOKING),
});

function errorResponse(message: string, status = 400) {
  return Response.json({ error: message }, { status });
}

export const Route = createFileRoute("/api/reservations")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const url = new URL(request.url);
          const date = url.searchParams.get("date") ?? "";

          if (!validateReservationDate(date)) {
            return errorResponse(
              "Escolha uma data válida entre hoje e os próximos 60 dias.",
            );
          }

          const reservations = await listReservationsForDate(date);
          const usedByTime = new Map<string, number>();

          for (const reservation of reservations) {
            if (!isActiveReservation(reservation)) continue;
            const time = reservation.reservation_time.slice(0, 5);
            usedByTime.set(
              time,
              (usedByTime.get(time) ?? 0) + reservation.guests,
            );
          }

          return Response.json({
            date,
            priceCents: RESERVATION_PRICE_CENTS,
            maxGuestsPerBooking: MAX_GUESTS_PER_BOOKING,
            slots: RESERVATION_SLOTS.map((time) => {
              const used = usedByTime.get(time) ?? 0;
              const remaining = Math.max(0, SLOT_CAPACITY - used);
              return {
                time,
                remaining,
                available: remaining > 0,
              };
            }),
          });
        } catch (error) {
          console.error("reservation availability error", error);
          return errorResponse(
            "Não foi possível consultar os horários agora.",
            500,
          );
        }
      },
      POST: async ({ request }) => {
        let reservationId: string | null = null;

        try {
          const body = await request.json();
          const parsed = createReservationSchema.safeParse(body);

          if (!parsed.success) {
            return errorResponse(
              parsed.error.issues[0]?.message ?? "Dados da reserva inválidos.",
            );
          }

          const data = parsed.data;
          if (!validateReservationDate(data.date)) {
            return errorResponse(
              "Escolha uma data válida entre hoje e os próximos 60 dias.",
            );
          }

          const reservation = await createReservationHold({
            customerName: data.name,
            customerEmail: data.email,
            customerPhone: data.phone,
            reservationDate: data.date,
            reservationTime: data.time,
            guests: data.guests,
          });

          reservationId = reservation.id;

          const origin = new URL(request.url).origin;
          const order = await createCheckoutOrder({
            reservationId: reservation.id,
            customerEmail: reservation.customer_email,
            customerName: reservation.customer_name,
            date: reservation.reservation_date,
            time: reservation.reservation_time.slice(0, 5),
            guests: reservation.guests,
            unitPriceCents: RESERVATION_PRICE_CENTS,
            origin,
          });

          if (!order.id || !order.checkout_url) {
            throw new Error(
              "Mercado Pago não retornou o ID ou a URL do checkout.",
            );
          }

          await updateReservation(reservation.id, {
            mercado_pago_order_id: order.id,
            mercado_pago_checkout_url: order.checkout_url,
            mercado_pago_status: order.status,
            mercado_pago_status_detail: order.status_detail ?? null,
          });

          return Response.json(
            {
              reservationId: reservation.id,
              checkoutUrl: order.checkout_url,
            },
            { status: 201 },
          );
        } catch (error) {
          console.error("create reservation error", error);

          if (reservationId) {
            try {
              await updateReservation(reservationId, { status: "cancelled" });
            } catch (rollbackError) {
              console.error("reservation rollback error", rollbackError);
            }
          }

          const message = error instanceof Error ? error.message : "";
          if (message.includes("vagas suficientes")) {
            return errorResponse(message, 409);
          }
          if (message.includes("Mercado Pago não configurado")) {
            return errorResponse(
              "O pagamento ainda não foi configurado no servidor.",
              503,
            );
          }
          if (message.includes("Supabase não configurado")) {
            return errorResponse(
              "O banco de reservas ainda não foi configurado.",
              503,
            );
          }

          return errorResponse(
            "Não foi possível iniciar a reserva. Tente novamente.",
            500,
          );
        }
      },
    },
  },
});
