import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { TrainFront, PersonStanding, Bus, MapPin, Star, Calendar, TriangleAlert } from "lucide-react";

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
    <div className="min-h-screen starfield">
      <Header />

      {/* Hero */}
      <section className="mx-auto max-w-5xl px-4 pt-16 pb-12 text-center">
        <p className="font-display text-3xl tracking-[0.3em] neon-magenta sm:text-4xl">SÁBADO NO</p>
        <h1 className="mt-2 font-display text-7xl leading-none tracking-wider neon-white-pink animate-flicker sm:text-9xl">
          AFTERLIFE
        </h1>
        <p className="mt-4 font-display text-2xl tracking-[0.5em] neon-purple sm:text-3xl">
          BACK TO THE FUTURE
        </p>

        <div className="mx-auto mt-10 flex max-w-2xl flex-wrap items-center justify-center gap-3 font-display text-xl tracking-widest">
          <span className="neon-frame-purple rounded-md px-5 py-2 neon-cyan">SINUCA</span>
          <span className="neon-frame-purple rounded-md px-5 py-2 neon-magenta">KARAOKÊ</span>
          <span className="neon-frame-purple rounded-md px-5 py-2 neon-green">
            TORNEIO DE JOGOS
          </span>
        </div>

        <div className="mt-10 flex flex-col items-center gap-2">
          <p className="font-display text-4xl tracking-[0.3em] neon-magenta sm:text-5xl">20H ÀS 04H</p>
        </div>

        <div className="mx-auto mt-10 flex max-w-md flex-col gap-2 rounded-lg neon-frame-cyan bg-card/60 p-6">
          <p className="font-display text-3xl tracking-wider neon-green">
            R$20,00 <span className="text-lg text-muted-foreground">ANTECIPADO</span>
          </p>
          <p className="font-display text-3xl tracking-wider neon-green">
            R$30,00 <span className="text-lg text-muted-foreground">NA PORTA</span>
          </p>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/cardapio"
            className="rounded-md bg-primary px-8 py-3 font-display text-xl tracking-widest text-primary-foreground transition-transform hover:scale-105"
          >
            VER CARDÁPIO
          </Link>
        </div>
      </section>

      {/* Como chegar */}
      <section className="mx-auto max-w-3xl px-4 py-16">
        <h2 className="text-center font-display text-4xl tracking-[0.2em] neon-white-pink sm:text-5xl">
          COMO CHEGAR
        </h2>
        <div className="mt-10 flex flex-col gap-6">
          {directions.map((d) => (
            <div
              key={d.step}
              className={`flex items-start gap-4 rounded-lg bg-card/60 p-5 ${d.frame}`}
            >
              <d.icon className={`mt-1 h-8 w-8 shrink-0 ${d.color}`} />
              <div>
                <p className={`font-display text-xl tracking-widest ${d.color}`}>{d.step}</p>
                <p className="mt-1 text-lg text-foreground/90">{d.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex items-center justify-center gap-3 rounded-lg neon-frame-pink bg-card/60 p-4">
          <TriangleAlert className="h-6 w-6 neon-pink" />
          <p className="font-display text-xl tracking-widest neon-pink">
            CHEGUE CEDO E GARANTA SUA ENTRADA!
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 text-center">
        <p className="flex items-center justify-center gap-2 font-display text-lg tracking-widest text-muted-foreground">
          <Calendar className="h-4 w-4" /> SÁBADO A PARTIR DAS 20H
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Rua Onze de Junho, 17 — Casa Branca, Santo André/SP (antigo Cyber)
        </p>
      </footer>
    </div>
  );
}
