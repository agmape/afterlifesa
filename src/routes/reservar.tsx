import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { CalendarDays, Clock3, CreditCard, Users } from "lucide-react";
import { Header } from "@/components/Header";
import { AmbientInterface, StatusLine } from "@/components/AmbientInterface";

export const Route = createFileRoute("/reservar")({
  head: () => ({
    meta: [
      { title: "Reservar — Afterlife Pub" },
      {
        name: "description",
        content:
          "Escolha a data e o horário, informe seus dados e garanta sua entrada antecipada no Afterlife Pub.",
      },
    ],
  }),
  component: ReservationPage,
});

type Slot = {
  time: string;
  remaining: number;
  available: boolean;
};

type Availability = {
  date: string;
  priceCents: number;
  maxGuestsPerBooking: number;
  slots: Slot[];
};

function localDateString(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function money(cents: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(cents / 100);
}

function ReservationPage() {
  const today = useMemo(() => new Date(), []);
  const maxDate = useMemo(() => {
    const date = new Date(today);
    date.setDate(date.getDate() + 60);
    return date;
  }, [today]);

  const [date, setDate] = useState(localDateString(today));
  const [time, setTime] = useState("");
  const [guests, setGuests] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [availability, setAvailability] = useState<Availability | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    setLoadingSlots(true);
    setError("");
    setTime("");

    fetch(`/api/reservations?date=${encodeURIComponent(date)}`, {
      signal: controller.signal,
    })
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok) {
          throw new Error(payload.error ?? "Falha ao carregar horários.");
        }
        return payload as Availability;
      })
      .then(setAvailability)
      .catch((fetchError) => {
        if (fetchError instanceof DOMException && fetchError.name === "AbortError") {
          return;
        }
        setAvailability(null);
        setError(
          fetchError instanceof Error
            ? fetchError.message
            : "Falha ao carregar horários.",
        );
      })
      .finally(() => setLoadingSlots(false));

    return () => controller.abort();
  }, [date]);

  const totalCents = (availability?.priceCents ?? 2000) * guests;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!time) {
      setError("Escolha um horário disponível.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          date,
          time,
          guests,
        }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error ?? "Não foi possível criar a reserva.");
      }

      window.location.assign(payload.checkoutUrl);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Não foi possível criar a reserva.",
      );
      setSubmitting(false);
    }
  }

  return (
    <AmbientInterface>
      <Header />

      <main className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-20">
        <header className="reveal-up">
          <StatusLine label="RESERVATION SYSTEM / ONLINE" />
          <h1 className="mt-5 font-display text-6xl leading-none tracking-[0.06em] text-foreground sm:text-8xl">
            RESERVAR
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Escolha quando você vem, informe seus dados e finalize o pagamento
            com segurança no Mercado Pago.
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]"
        >
          <section className="tech-panel space-y-8">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-accent" />
                <h2 className="font-display text-3xl tracking-[0.08em]">
                  DATA
                </h2>
              </div>
              <input
                type="date"
                value={date}
                min={localDateString(today)}
                max={localDateString(maxDate)}
                onChange={(event) => setDate(event.target.value)}
                className="w-full rounded-md border border-border bg-background/70 px-4 py-3 text-foreground outline-none transition focus:border-accent"
                required
              />
            </div>

            <div>
              <div className="mb-4 flex items-center gap-2">
                <Clock3 className="h-5 w-5 text-primary" />
                <h2 className="font-display text-3xl tracking-[0.08em]">
                  HORÁRIO
                </h2>
              </div>

              {loadingSlots ? (
                <p className="text-muted-foreground">Carregando horários...</p>
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {availability?.slots.map((slot) => (
                    <button
                      key={slot.time}
                      type="button"
                      disabled={!slot.available}
                      onClick={() => setTime(slot.time)}
                      className={[
                        "rounded-md border px-4 py-4 text-left transition",
                        time === slot.time
                          ? "border-accent bg-accent/10 text-accent"
                          : "border-border bg-background/50 text-foreground hover:border-accent/70",
                        !slot.available
                          ? "cursor-not-allowed opacity-40"
                          : "",
                      ].join(" ")}
                    >
                      <span className="font-display text-2xl">{slot.time}</span>
                      <span className="mt-1 block text-xs text-muted-foreground">
                        {slot.available
                          ? `${slot.remaining} vagas`
                          : "lotado"}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <div className="mb-4 flex items-center gap-2">
                <Users className="h-5 w-5 text-accent" />
                <h2 className="font-display text-3xl tracking-[0.08em]">
                  PESSOAS
                </h2>
              </div>
              <select
                value={guests}
                onChange={(event) => setGuests(Number(event.target.value))}
                className="w-full rounded-md border border-border bg-background/70 px-4 py-3 text-foreground outline-none transition focus:border-accent"
              >
                {Array.from(
                  { length: availability?.maxGuestsPerBooking ?? 8 },
                  (_, index) => index + 1,
                ).map((value) => (
                  <option key={value} value={value}>
                    {value} {value === 1 ? "pessoa" : "pessoas"}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 sm:col-span-2">
                <span className="hud-label">NOME</span>
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  minLength={2}
                  maxLength={100}
                  autoComplete="name"
                  className="w-full rounded-md border border-border bg-background/70 px-4 py-3 text-foreground outline-none transition focus:border-accent"
                  required
                />
              </label>
              <label className="space-y-2">
                <span className="hud-label">E-MAIL</span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="email"
                  className="w-full rounded-md border border-border bg-background/70 px-4 py-3 text-foreground outline-none transition focus:border-accent"
                  required
                />
              </label>
              <label className="space-y-2">
                <span className="hud-label">WHATSAPP / TELEFONE</span>
                <input
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  autoComplete="tel"
                  minLength={8}
                  maxLength={30}
                  className="w-full rounded-md border border-border bg-background/70 px-4 py-3 text-foreground outline-none transition focus:border-accent"
                  required
                />
              </label>
            </div>
          </section>

          <aside className="tech-panel h-fit lg:sticky lg:top-28">
            <div className="flex items-center justify-between">
              <CreditCard className="h-5 w-5 text-primary" />
              <span className="hud-label">CHECKOUT PRO</span>
            </div>

            <div className="mt-8 space-y-4 border-b border-border/60 pb-6">
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Data</span>
                <span className="font-semibold text-foreground">{date}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Horário</span>
                <span className="font-semibold text-foreground">
                  {time || "Selecione"}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Pessoas</span>
                <span className="font-semibold text-foreground">{guests}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Por pessoa</span>
                <span className="font-semibold text-foreground">
                  {money(availability?.priceCents ?? 2000)}
                </span>
              </div>
            </div>

            <div className="py-7">
              <span className="hud-label">TOTAL</span>
              <p className="mt-1 font-display text-5xl text-accent">
                {money(totalCents)}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                O horário fica reservado por 30 minutos enquanto você conclui
                o pagamento.
              </p>
            </div>

            {error && (
              <div className="mb-5 rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting || loadingSlots || !time}
              className="primary-action w-full disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? "ABRINDO PAGAMENTO..." : "IR PARA PAGAMENTO"}
            </button>

            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
              O pagamento é processado no ambiente seguro do Mercado Pago. A
              reserva só é confirmada após a aprovação informada pelo webhook.
            </p>
          </aside>
        </form>
      </main>
    </AmbientInterface>
  );
}
