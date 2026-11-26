import { useEffect, useRef, useState } from "react";
import { QrCode } from "lucide-react";
import qrAsset from "@/assets/qr-entrada.png.asset.json";

const QR_IMAGE = qrAsset.url;

export function EntradaQR({ className = "" }: { className?: string }) {
  const imageRef = useRef<HTMLImageElement>(null);
  const [imageMissing, setImageMissing] = useState(false);

  // A 404 on the QR file can fire before React hydrates, so check the load state on mount too.
  useEffect(() => {
    const img = imageRef.current;
    if (img?.complete && img.naturalWidth === 0) {
      setImageMissing(true);
    }
  }, []);

  return (
    <div className={`tech-panel qr-panel ${className}`}>
      <div className="flex items-center justify-between gap-4">
        <span className="hud-label">PAGAMENTO ANTECIPADO / PIX</span>
        <QrCode className="h-5 w-5 text-accent" />
      </div>

      <div>
        <p className="font-display text-3xl tracking-[0.1em] text-foreground sm:text-4xl">
          PAGAR ENTRADA
        </p>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
          Abra o app do seu banco, escolha <span className="text-foreground">Pagar com QR Code</span> e
          aponte a câmera para o código abaixo. A entrada antecipada é <span className="text-foreground">R$ 20,00</span>.
        </p>
      </div>

      <div className="qr-frame">
        {imageMissing ? (
          <p className="qr-placeholder">QR Code indisponível no momento</p>
        ) : (
          <img
            ref={imageRef}
            src={QR_IMAGE}
            alt="QR Code Pix para pagar a entrada antecipada do Afterlife Pub"
            width={480}
            height={480}
            onError={() => setImageMissing(true)}
          />
        )}
      </div>

      <p className="qr-hint">
        Pagou? Mostre o comprovante na portaria. Dúvidas? Chame no WhatsApp.
      </p>
    </div>
  );
}
