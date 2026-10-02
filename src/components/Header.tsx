import { Link } from "@tanstack/react-router";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:h-20 sm:px-8">
        <Link to="/" className="group flex items-center gap-3" aria-label="Afterlife — início">
          <span className="brand-mark" aria-hidden="true"><span /></span>
          <span className="font-display text-2xl tracking-[0.12em] text-foreground sm:text-3xl">
            AFTER<span className="text-accent transition-colors group-hover:text-primary">LIFE</span>
          </span>
        </Link>
        <nav className="flex items-center gap-1 font-body text-[10px] font-semibold tracking-[0.12em] sm:gap-3 sm:text-sm sm:tracking-[0.18em]" aria-label="Navegação principal">
          <Link
            to="/"
            className="nav-link"
            activeProps={{ className: "nav-link nav-link-active" }}
            activeOptions={{ exact: true }}
          >
            INÍCIO
          </Link>
          <Link
            to="/cardapio"
            className="nav-link"
            activeProps={{ className: "nav-link nav-link-active" }}
          >
            CARDÁPIO
          </Link>
          <Link
            to="/reservar"
            className="nav-link"
            activeProps={{ className: "nav-link nav-link-active" }}
          >
            RESERVAR
          </Link>
        </nav>
      </div>
    </header>
  );
}
