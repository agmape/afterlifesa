import { useEffect, useRef, type ReactNode } from "react";

export function AmbientInterface({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const updateSpotlight = (event: PointerEvent) => {
      root.style.setProperty("--cursor-x", `${event.clientX}px`);
      root.style.setProperty("--cursor-y", `${event.clientY}px`);
    };

    window.addEventListener("pointermove", updateSpotlight, { passive: true });
    return () => window.removeEventListener("pointermove", updateSpotlight);
  }, []);

  return (
    <div ref={rootRef} className="interface-shell">
      <div className="ambient-grid" aria-hidden="true" />
      <div className="ambient-orbit ambient-orbit-one" aria-hidden="true" />
      <div className="ambient-orbit ambient-orbit-two" aria-hidden="true" />
      <div className="cursor-light" aria-hidden="true" />
      <div className="scanlines" aria-hidden="true" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export function StatusLine({ label = "SYSTEM ONLINE" }: { label?: string }) {
  return (
    <div className="flex items-center gap-2 font-body text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
      <span className="status-pulse" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}