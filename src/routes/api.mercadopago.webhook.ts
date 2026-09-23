import { createFileRoute } from "@tanstack/react-router";
import {
  getCheckoutOrder,
  verifyMercadoPagoWebhook,
} from "@/lib/mercadopago.server";
import {
  getReservationById,
  updateReservation,
  type ReservationStatus,
} from "@/lib/reservations.server";

function mapOrderStatus(
  status: string,
  statusDetail?: string,
): ReservationStatus {
  if (status === "processed") {
    if (statusDetail === "refunded") return "refunded";
    return "paid";
  }
  if (status === "refunded") return "refunded";
  if (status === "canceled") return "cancelled";
  if (status === "expired") return "expired";
  if (status === "failed") return "failed";
  if (status === "processing" || status === "action_required") {
    return "processing";
  }
  return "pending";
}

export const Route = createFileRoute("/api/mercadopago/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const url = new URL(request.url);
          const queryDataId = url.searchParams.get("data.id");
          const xSignature = request.headers.get("x-signature");
          const xRequestId = request.headers.get("x-request-id");

          const isValid = await verifyMercadoPagoWebhook({
            xSignature,
            xRequestId,
            dataId: queryDataId,
          });

          if (!isValid) {
            return Response.json(
              { error: "Assinatura inválida." },
              { status: 401 },
            );
          }

          const body = (await request.json().catch(() => null)) as
            | { type?: string; data?: { id?: string } }
            | null;

          const orderId = queryDataId ?? body?.data?.id ?? "";
          if (!orderId || (body?.type && body.type !== "order")) {
            return Response.json({ received: true });
          }

          const order = await getCheckoutOrder(orderId);
          const reservationId = order.external_reference;
          if (!reservationId) {
            return Response.json({ received: true });
          }

          const reservation = await getReservationById(reservationId);
          if (!reservation) {
            return Response.json({ received: true });
          }

          if (
            reservation.mercado_pago_order_id &&
            reservation.mercado_pago_order_id !== order.id
          ) {
            console.error("Mercado Pago order mismatch", {
              reservationId,
              expected: reservation.mercado_pago_order_id,
              received: order.id,
            });
            return Response.json(
              { error: "Order não corresponde à reserva." },
              { status: 409 },
            );
          }

          const orderTotalCents = Math.round(
            Number(order.total_amount ?? "0") * 100,
          );
          if (orderTotalCents !== reservation.amount_cents) {
            console.error("Mercado Pago amount mismatch", {
              reservationId,
              expected: reservation.amount_cents,
              received: orderTotalCents,
            });
            return Response.json(
              { error: "Valor da order não corresponde à reserva." },
              { status: 409 },
            );
          }

          await updateReservation(reservation.id, {
            status: mapOrderStatus(order.status, order.status_detail),
            mercado_pago_order_id: order.id,
            mercado_pago_status: order.status,
            mercado_pago_status_detail: order.status_detail ?? null,
          });

          return Response.json({ received: true });
        } catch (error) {
          console.error("Mercado Pago webhook error", error);
          return Response.json(
            { error: "Falha ao processar webhook." },
            { status: 500 },
          );
        }
      },
    },
  },
});
