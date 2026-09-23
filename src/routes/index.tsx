import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { AmbientInterface, StatusLine } from "@/components/AmbientInterface";
import { TrainFront, PersonStanding, Bus, MapPin, Star, Calendar, TriangleAlert, ArrowUpRight, Radio, Ticket } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Afterlife Pub — Sábado: Back to the Future em Santo André" },
      {
        name: "description",
        content:
          "Sábado no Afterlife: sinuca, karaokê e sala de jogos liberada a noite toda, DJ Ninja das 20h às 04h. Rua Onze de Junho, 17 — Casa Branca, Santo André/SP.",
      },
      { property: "og:title", content: "Afterlife Pub — Sábado: Back to the Future" },
      {
        property: "og:description",
        content:
          "Sinuca, karaokê e sala de jogos liberada a noite toda. DJ Ninja das 20h às 04h. Santo André/SP.",
      },
    ],
  }),
  component: HomePage,
});

const directions = [
  {
    icon: TrainFront,
    step: "1. METRÔ / CPTM",
    text: "Desça na estação Prefeito Celso Daniel — Santo André",
    color: "neon-magenta",
    frame: "neon-frame-pink",
  },
  {
    icon: PersonStanding,
    step: "2. SAÍDA DA ESTAÇÃO",
    text: "Saia pela saída principal em direção à Avenida Queirós dos Santos",
    color: "neon-cyan",
    frame: "neon-frame-cyan",
  },
  {
    icon: Bus,
    step: "3. SIGA PELA AVENIDA",
    text: "Caminhe pela Avenida Queirós dos Santos (sentido Museu de Santo André)",
    color: "neon-magenta",
    frame: "neon-frame-pink",
  },
  {
    icon: MapPin,
    step: "4. VIRE À DIREITA",
    text: "Vire à direita na Rua 11 de Junho",
    color: "neon-cyan",
    frame: "neon-frame-cyan",
  },
  {
    icon: Star,
    step: "5. CHEGOU!",
    text: "O rolê é na Rua 11 de Junho, 17 — Casa Branca, Santo André/SP (antigo Cyber)",
    color: "neon-pink",
    frame: "neon-frame-pink",
  },
];

function HomePage() {
  return (
    <AmbientInterface>
      <Header />

      <main>
      <section className="hero-section mx-auto grid min-h-[calc(100svh-4rem)] max-w-7xl grid-cols-1 content-center gap-5 px-5 py-12 sm:px-8 lg:min-h-[calc(100svh-5rem)] lg:grid-cols-12 lg:gap-6 lg:py-16">
        <div className="hero-panel tech-panel reveal-up lg:col-span-8 lg:row-span-2">
          <div className="flex items-center justify-between gap-4">
            <StatusLine label="SATURDAY PROTOCOL / ACTIVE" />
            <span className="hud-label hidden sm:block">SA · 23°39' S</span>
          </div>
          <div className="my-auto py-10 sm:py-14 lg:py-20">
            <p className="font-body text-xs font-semibold uppercase tracking-[0.35em] text-primary sm:text-sm">SÁBADO NO</p>
            <h1 className="glitch-title mt-3 font-display text-[clamp(4.5rem,13vw,10.5rem)] leading-[0.78] tracking-[0.03em] text-foreground" data-text="AFTERLIFE">
              AFTERLIFE
            </h1>
            <p className="mt-7 font-display text-2xl tracking-[0.18em] text-accent sm:text-4xl">BACK TO THE FUTURE</p>
          </div>
          <div className="flex flex-wrap gap-2 border-t border-border/60 pt-5">
            {['SINUCA', 'KARAOKÊ', 'TORNEIO DE JOGOS'].map((activity) => (
              <span key={activity} className="activity-chip">{activity}</span>
            ))}
          </div>
        </div>

        <div className="tech-panel reveal-up delay-one flex min-h-48 flex-col justify-between lg:col-span-4">
          <div className="flex items-center justify-between">
            <Radio className="h-5 w-5 text-accent" />
            <span className="hud-label">LIVE WINDOW</span>
          </div>
          <div>
            <p className="font-display text-5xl tracking-[0.08em] text-foreground sm:text-6xl">20H — 04H</p>
            <p className="mt-2 text-sm uppercase tracking-[0.2em] text-muted-foreground">Operação noturna</p>
          </div>
          <div className="signal-bars" aria-hidden="true"><span /><span /><span /><span /><span /></div>
        </div>

        <div className="tech-panel reveal-up delay-two flex flex-col justify-between gap-8 lg:col-span-4">
          <div className="flex items-center justify-between">
            <Ticket className="h-5 w-5 text-primary" />
            <span className="hud-label">ACCESS PASS</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><p className="hud-label">ANTECIPADO</p><p className="mt-1 font-display text-4xl text-foreground">R$20,00</p></div>
            <div><p className="hud-label">NA PORTA</p><p className="mt-1 font-display text-4xl text-foreground">R$30,00</p></div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Link to="/reservar" className="primary-action group">
              RESERVAR AGORA <ArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            <Link
              to="/cardapio"
              className="inline-flex items-center justify-center rounded-md border border-border px-5 py-3 text-sm font-semibold tracking-[0.12em] text-foreground transition hover:border-accent"
            >
              VER CARDÁPIO
            </Link>
          </div>
        </div>
      </section>

      <section className="section-band">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
          <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div><span className="hud-label text-accent">NAVIGATION SEQUENCE / 05 STEPS</span><h2 className="mt-3 font-display text-5xl tracking-[0.06em] text-foreground sm:text-7xl">COMO CHEGAR</h2></div>
            <StatusLine label="ROUTE CALCULATED" />
          </div>
          <div className="route-grid">
          {directions.map((d) => (
            <div
              key={d.step}
              className="route-card group"
            >
              <div className="route-icon"><d.icon className="h-5 w-5" /></div>
              <div className="relative z-10">
                <p className="font-display text-2xl tracking-[0.08em] text-foreground transition-colors group-hover:text-accent">{d.step}</p>
                <p className="mt-2 max-w-lg leading-relaxed text-muted-foreground">{d.text}</p>
              </div>
            </div>
          ))}
          </div>

        <div className="notice-bar mt-8">
          <TriangleAlert className="h-5 w-5 text-primary" />
          <p className="font-body text-sm font-semibold tracking-[0.12em] text-foreground sm:text-base">
            CHEGUE CEDO E GARANTA SUA ENTRADA!
          </p>
        </div>
        </div>
      </section>
      </main>

      <footer className="border-t border-border/60 bg-background/60 px-5 py-10 text-center backdrop-blur-sm">
        <p className="flex items-center justify-center gap-2 font-body text-sm font-semibold tracking-[0.14em] text-muted-foreground">
          <Calendar className="h-4 w-4" /> SÁBADO A PARTIR DAS 20H
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Rua Onze de Junho, 17 — Casa Branca, Santo André/SP (antigo Cyber)
        </p>
      </footer>
    </AmbientInterface>
  );
}
