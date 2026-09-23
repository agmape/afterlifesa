import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  CircleCheck,
  CircleX,
  Clock3,
  LoaderCircle,
  RotateCcw,
} from "lucide-react";
import { Header } from "@/components/Header";
import { AmbientInterface, StatusLine } from "@/components/AmbientInterface";

type ReservationView = {
  id: string;
  customerName: string;
  reservationDate: string;
  reservationTime: string;
  guests: number;
  amountCents: number;
  status: string;
  paymentStatus: string | null;
  paymentStatusDetail: string | null;
};

const finalStatuses = new Set([
  "paid",
  "failed",
  "cancelled",
  "expired",
  "refunded",
]);

export const Route = createFileRoute("/reserva/status")({
  validateSearch: (search: Record<string, unknown>) => ({
    reservation:
      typeof search.reservation === "string" ? search.reservation : "",
    result: typeof search.result === "string" ? search.result : "",
  }),
  component: ReservationStatusPage,
});

function money(cents: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(cents / 100);
}

function ReservationStatusPage() {
  const { reservation: reservationId } = Route.useSearch();
  const [reservation, setReservation] = useState<ReservationView | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!reservationId) {
      setError("Código da reserva ausente.");
      return;
    }

    let stopped = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const load = async () => {
      try {
        const response = await fetch(
          `/api/reservations/${encodeURIComponent(reservationId)}`,
        );
        const payload = await response.json();
        if (!response.ok) {
          throw new Error(payload.error ?? "Reserva não encontrada.");
        }
        if (stopped) return;

        const next = payload as ReservationView;
        setReservation(next);
        setError("");

        if (!finalStatuses.has(next.status)) {
          timer = setTimeout(load, 3000);
        }
      } catch (loadError) {
        if (stopped) return;
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Não foi possível consultar a reserva.",
        );
      }
    };

    load();
    return () => {
      stopped = true;
      if (timer) clearTimeout(timer);
    };
  }, [reservationId]);

  const paid = reservation?.status === "paid";
  const rejected =
    reservation &&
    ["failed", "cancelled", "expired", "refunded"].includes(reservation.status);

  return (
    <AmbientInterface>
      <Header />
      <main className="mx-auto flex min-h-[70vh] max-w-3xl items-center px-5 py-16 sm:px-8">
        <section className="tech-panel w-full text-center">
          <div className="flex justify-center">
            <StatusLine label="PAYMENT STATUS / LIVE" />
          </div>

          <div className="mt-8 flex justify-center">
            {paid ? (
              <CircleCheck className="h-16 w-16 text-accent" />
            ) : rejected ? (
              <CircleX className="h-16 w-16 text-destructive" />
            ) : (
              <LoaderCircle className="h-16 w-16 animate-spin text-primary" />
            )}
          </div>

          <h1 className="mt-5 font-display text-5xl tracking-[0.06em] text-foreground sm:text-7xl">
            {paid
              ? "RESERVA CONFIRMADA"
              : rejected
                ? "PAGAMENTO NÃO CONCLUÍDO"
                : "AGUARDANDO CONFIRMAÇÃO"}
          </h1>

          {reservation && (
            <div className="mx-auto mt-8 grid max-w-xl gap-3 border-y border-border/60 py-6 text-left sm:grid-cols-2">
              <p>
                <span className="hud-label block">DATA</span>
                <span className="text-foreground">
                  {reservation.reservationDate}
                </span>
              </p>
              <p>
                <span className="hud-label block">HORÁRIO</span>
                <span className="text-foreground">
                  {reservation.reservationTime.slice(0, 5)}
                </span>
              </p>
              <p>
                <span className="hud-label block">PESSOAS</span>
                <span className="text-foreground">{reservation.guests}</span>
              </p>
              <p>
                <span className="hud-label block">TOTAL</span>
                <span className="text-foreground">
                  {money(reservation.amountCents)}
                </span>
              </p>
            </div>
          )}

          <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground">
            {paid
              ? "Pagamento aprovado pelo Mercado Pago. Guarde o código da reserva e apresente seu nome na entrada."
              : rejected
                ? "Você pode voltar à página de reservas e tentar novamente com outro horário ou meio de pagamento."
                : "O Mercado Pago ainda está processando o pagamento. Esta tela atualiza automaticamente quando o webhook confirmar o resultado."}
          </p>

          {reservationId && (
            <p className="mt-4 font-mono text-xs text-muted-foreground">
              Reserva: {reservationId}
            </p>
          )}

          {error && (
            <p className="mt-5 text-sm text-destructive">{error}</p>
          )}

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/reservar" className="primary-action">
              <RotateCcw className="h-4 w-4" />
              NOVA RESERVA
            </Link>
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-border px-5 py-3 text-sm font-semibold tracking-[0.12em] text-foreground transition hover:border-accent"
            >
              <Clock3 className="h-4 w-4" />
              VOLTAR AO INÍCIO
            </Link>
          </div>
        </section>
      </main>
    </AmbientInterface>
  );
}
