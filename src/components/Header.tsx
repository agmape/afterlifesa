import { Link } from "@tanstack/react-router";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link to="/" className="font-display text-2xl tracking-widest neon-white-pink animate-flicker">
          AFTERLIFE
        </Link>
        <nav className="flex items-center gap-6 font-display text-lg tracking-widest">
          <Link
            to="/"
            className="text-muted-foreground transition-colors hover:text-foreground"
            activeProps={{ className: "neon-cyan" }}
            activeOptions={{ exact: true }}
          >
            INÍCIO
          </Link>
          <Link
            to="/cardapio"
            className="text-muted-foreground transition-colors hover:text-foreground"
            activeProps={{ className: "neon-cyan" }}
          >
            CARDÁPIO
          </Link>
        </nav>
      </div>
    </header>
  );
}
