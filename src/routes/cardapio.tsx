import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Martini, Beer, GlassWater } from "lucide-react";

export const Route = createFileRoute("/cardapio")({
  head: () => ({
    meta: [
      { title: "Cardápio — Afterlife Pub" },
      {
        name: "description",
        content:
          "Cardápio do Afterlife Pub: drinks, caipirinhas, copões, cervejas e não alcoólicos. Santo André/SP.",
      },
      { property: "og:title", content: "Cardápio — Afterlife Pub" },
      {
        property: "og:description",
        content: "Drinks, caipirinhas, copões, cervejas e não alcoólicos no Afterlife Pub.",
      },
    ],
  }),
  component: CardapioPage,
});

type Item = { name: string; detail?: string; price: string; note?: string };

const alcoolicos: Item[] = [
  {
    name: "Copão de Gin Eternity",
    detail: "750ml",
    price: "R$ 10,00",
    note: "Opções: Melancia, Morango com Pêssego e Tropical",
  },
  { name: "Copão de Gin Tanqueray", detail: "500ml", price: "R$ 50,00" },
  { name: "Copão de Whisky Chanceler", detail: "750ml", price: "R$ 15,00" },
  { name: "Copão de Whisky Passport", detail: "750ml", price: "R$ 25,00" },
  {
    name: "Copão de Whisky White Horse",
    detail: "750ml",
    price: "R$ 35,00",
    note: "Com Red Bull + R$ 15,00",
  },
  { name: "Caipirinha de Cachaça", detail: "500ml", price: "R$ 25,00" },
  { name: "Caipirinha de Vodka Smirnoff", detail: "500ml", price: "R$ 35,00" },
  { name: "Copão de Vodka Smirnoff", detail: "750ml", price: "R$ 20,00" },
  { name: "Cuba Libre", detail: "500ml", price: "R$ 25,00" },
  { name: "Balena", detail: "shot 75ml", price: "R$ 30,00" },
  { name: "José Cuervo Gold", detail: "shot 50ml", price: "R$ 30,00" },
];

const cervejas: Item[] = [
  { name: "Copão Budweiser", detail: "500ml", price: "R$ 10,00" },
  { name: "Patagonia", detail: "350ml", price: "R$ 9,00" },
  { name: "Spaten Long Neck", detail: "330ml", price: "R$ 8,00" },
  { name: "Heineken Long Neck", detail: "330ml", price: "R$ 10,00" },
  { name: "Mike's Limão", price: "R$ 12,00" },
  { name: "Skol Beats GT", price: "R$ 12,00" },
];

const naoAlcoolicos: Item[] = [
  { name: "Suco Del Valle Uva", detail: "lata", price: "R$ 7,00" },
  { name: "Coca-Cola Mini", price: "R$ 4,00" },
  { name: "Coca-Cola Mini Zero", price: "R$ 4,00" },
  { name: "Fanta Laranja Mini", price: "R$ 5,00" },
  { name: "Fanta Uva Mini", price: "R$ 5,00" },
  { name: "Monster", detail: "lata", price: "R$ 15,00" },
  { name: "Guaraviton", price: "R$ 6,00" },
  { name: "Água Bio", price: "R$ 3,00" },
  { name: "Água com Gás Nestlé", price: "R$ 4,00" },
];

function MenuSection({
  title,
  icon: Icon,
  items,
  accent,
  frame,
}: {
  title: string;
  icon: typeof Beer;
  items: Item[];
  accent: string;
  frame: string;
}) {
  return (
    <section className={`rounded-xl bg-card/60 p-6 sm:p-8 ${frame}`}>
      <div className="flex items-center gap-3">
        <Icon className={`h-8 w-8 ${accent}`} />
        <h2 className={`font-display text-3xl tracking-[0.2em] sm:text-4xl ${accent}`}>{title}</h2>
      </div>
      <ul className="mt-6 flex flex-col divide-y divide-border">
        {items.map((item) => (
          <li key={item.name} className="py-4">
            <div className="flex items-baseline justify-between gap-4">
              <p className="text-lg font-semibold text-foreground">
                {item.name}
                {item.detail && (
                  <span className="ml-2 text-sm font-medium text-muted-foreground">
                    {item.detail}
                  </span>
                )}
              </p>
              <p className={`shrink-0 font-display text-2xl tracking-wider ${accent}`}>
                {item.price}
              </p>
            </div>
            {item.note && <p className="mt-1 text-sm text-muted-foreground">{item.note}</p>}
          </li>
        ))}
      </ul>
    </section>
  );
}

function CardapioPage() {
  return (
    <div className="min-h-screen starfield">
      <Header />

      <main className="mx-auto max-w-3xl px-4 py-14">
        <h1 className="text-center font-display text-6xl tracking-wider neon-white-pink animate-flicker sm:text-7xl">
          CARDÁPIO
        </h1>
        <p className="mt-3 text-center font-display text-xl tracking-[0.4em] neon-purple">
          AFTERLIFE PUB
        </p>

        <div className="mt-12 flex flex-col gap-10">
          <MenuSection
            title="ALCOÓLICOS"
            icon={Martini}
            items={alcoolicos}
            accent="neon-magenta"
            frame="neon-frame-pink"
          />
          <MenuSection
            title="CERVEJAS"
            icon={Beer}
            items={cervejas}
            accent="neon-green"
            frame="neon-frame-cyan"
          />
          <MenuSection
            title="NÃO ALCOÓLICOS"
            icon={GlassWater}
            items={naoAlcoolicos}
            accent="neon-cyan"
            frame="neon-frame-purple"
          />
        </div>

        <p className="mt-12 text-center text-sm text-muted-foreground">
          Rua Onze de Junho, 17 — Casa Branca, Santo André/SP (antigo Cyber)
        </p>
      </main>
    </div>
  );
}
