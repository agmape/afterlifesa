import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { AmbientInterface, StatusLine } from "@/components/AmbientInterface";
import { Martini, Beer, GlassWater, Popcorn } from "lucide-react";

export const Route = createFileRoute("/cardapio")({
  head: () => ({
    meta: [
      { title: "Cardápio — Afterlife Pub" },
      {
        name: "description",
        content:
          "Cardápio do Afterlife Pub: drinks, caipirinhas, copões, cervejas, não alcoólicos e petiscos. Santo André/SP.",
      },
      { property: "og:title", content: "Cardápio — Afterlife Pub" },
      {
        property: "og:description",
        content: "Drinks, caipirinhas, copões, cervejas, não alcoólicos e petiscos no Afterlife Pub.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
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
  { name: "Copão de Gin Tanqueray", detail: "500ml", price: "R$ 45,00" },
  { name: "Copão de Whisky Chanceler", detail: "750ml", price: "R$ 15,00" },
  { name: "Copão de Whisky Passport", detail: "750ml", price: "R$ 25,00" },
  {
    name: "Copão de Whisky White Horse",
    detail: "750ml",
    price: "R$ 35,00",
    note: "Com Red Bull + R$ 15,00",
  },
  { name: "Copão de Vodka Smirnoff", detail: "750ml", price: "R$ 20,00" },
  { name: "Caipirinha Vodka Smirnoff", detail: "500ml", price: "R$ 30,00" },
  { name: "Caipirinha Cachaça", detail: "500ml", price: "R$ 25,00" },
  {
    name: "Copão de Kariri com Mel",
    detail: "750ml",
    price: "R$ 15,00",
    note: "Com Gelo de Coco + R$ 5,00",
  },
  { name: "Copão Espanhola", detail: "500ml", price: "R$ 18,00" },
  { name: "Cuba Libre", detail: "500ml", price: "R$ 25,00" },
  { name: "Xeque-Mate", detail: "Lata", price: "R$ 14,00" },
  { name: "Balena", detail: "shot 75ml", price: "R$ 30,00" },
  { name: "José Cuervo Gold", detail: "shot 50ml", price: "R$ 20,00" },
];

const cervejas: Item[] = [
  { name: "Copão Budweiser", detail: "500ml", price: "R$ 10,00" },
  { name: "Patagonia", detail: "350ml", price: "R$ 8,00" },
  { name: "Spaten Long Neck", detail: "330ml", price: "R$ 9,00" },
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

const petiscos: Item[] = [
  { name: "Salgadinho Fofura", price: "R$ 4,00" },
  { name: "Amendoim Jazam", detail: "50g", price: "R$ 5,00" },
];

function MenuSection({
  title,
  icon: Icon,
  items,
  accent,
}: {
  title: string;
  icon: typeof Beer;
  items: Item[];
  accent: string;
}) {
  return (
    <section className="menu-panel group">
      <div className="flex items-center justify-between gap-4 border-b border-border/60 pb-5">
        <div className="flex items-center gap-3">
          <span className={`menu-icon ${accent}`}><Icon className="h-5 w-5" /></span>
          <h2 className="font-display text-3xl tracking-[0.1em] text-foreground sm:text-4xl">{title}</h2>
        </div>
        <span className="hud-label">{String(items.length).padStart(2, '0')} ITEMS</span>
      </div>
      <ul className="mt-2 flex flex-col divide-y divide-border/50">
        {items.map((item) => (
          <li key={`${item.name}-${item.detail ?? item.price}`} className="menu-row">
            <div className="flex items-baseline justify-between gap-4">
              <p className="text-base font-semibold text-foreground sm:text-lg">
                {item.name}
                {item.detail && (
                  <span className="ml-2 text-sm font-medium text-muted-foreground">
                    {item.detail}
                  </span>
                )}
              </p>
              <p className={`shrink-0 font-display text-2xl tracking-[0.06em] ${accent}`}>
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
    <AmbientInterface>
      <Header />

      <main className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-20">
        <header className="menu-heading reveal-up">
          <div className="flex justify-center"><StatusLine label="BEVERAGE DATABASE / ONLINE" /></div>
          <h1 className="mt-5 text-center font-display text-7xl leading-none tracking-[0.06em] text-foreground sm:text-9xl">CARDÁPIO</h1>
          <p className="mt-3 text-center font-body text-xs font-semibold tracking-[0.35em] text-accent sm:text-sm">AFTERLIFE PUB</p>
        </header>

        <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <MenuSection
            title="ALCOÓLICOS"
            icon={Martini}
            items={alcoolicos}
            accent="neon-magenta"
          />
          <MenuSection
            title="CERVEJAS"
            icon={Beer}
            items={cervejas}
            accent="neon-green"
          />
          <MenuSection
            title="NÃO ALCOÓLICOS"
            icon={GlassWater}
            items={naoAlcoolicos}
            accent="neon-cyan"
          />
          <MenuSection
            title="PETISCOS"
            icon={Popcorn}
            items={petiscos}
            accent="neon-magenta"
          />
        </div>

        <p className="mt-14 border-t border-border/60 pt-8 text-center text-sm text-muted-foreground">
          Rua Onze de Junho, 17 — Casa Branca, Santo André/SP (antigo Cyber)
        </p>
      </main>
    </AmbientInterface>
  );
}
