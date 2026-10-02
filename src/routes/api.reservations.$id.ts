import { createFileRoute } from "@tanstack/react-router";
import {
  getReservationById,
  publicReservation,
} from "@/lib/reservations.server";

export const Route = createFileRoute("/api/reservations/$id")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        try {
          const reservation = await getReservationById(params.id);
          if (!reservation) {
            return Response.json(
              { error: "Reserva não encontrada." },
              { status: 404 },
            );
          }

          return Response.json(publicReservation(reservation));
        } catch (error) {
          console.error("reservation status error", error);
          return Response.json(
            { error: "Não foi possível consultar a reserva." },
            { status: 500 },
          );
        }
      },
    },
  },
});
