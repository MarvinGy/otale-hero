import { useEffect, useRef, useState } from "react";
import logoUrl from "@/assets/otale-logo-light.svg";

/**
 * OtaleHeroMontage – Hero der Startseite mit Scroll-Montage des Logos.
 *
 * Ablauf beim Scrollen: Das Logo steht gross als Explosionszeichnung im Bild,
 * setzt sich zusammen, rastet ein und wandert an seine Position ueber der Ueberschrift.
 *
 * - three.js laedt per dynamic import in einem eigenen Chunk (Haupt-Bundle bleibt schlank).
 * - Qualitaet passt sich automatisch an das Geraet an und senkt sich bei Rucklern selbst.
 * - Rendering pausiert ausserhalb des Viewports und in Hintergrund-Tabs.
 * - prefers-reduced-motion: fertiges Logo als 3D-Standbild, Section nur 1 Bildschirm hoch.
 * - Kein WebGL / Datensparmodus / Ladefehler: statisches SVG, Section nur 1 Bildschirm hoch.
 */
type Mode = "loading" | "3d" | "static";

const SCROLL_LENGTH = "220svh"; // Hoehe der Section = Laenge der Scroll-Montage
const MARK_WIDTH = "clamp(168px, 20vw, 268px)"; // gleiche Groesse wie das bisherige Hero-Logo

function cannotUse3D() {
  const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
  if (nav.connection?.saveData) return true;
  try {
    const c = document.createElement("canvas");
    return !(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return true;
  }
}

/** Erste nicht-transparente Hintergrundfarbe ab dem Element aufwaerts */
function pageBackground(el: HTMLElement | null) {
  for (let n = el; n; n = n.parentElement) {
    const c = getComputedStyle(n).backgroundColor;
    if (c && c !== "transparent" && !/rgba\(.*,\s*0\)$/.test(c)) return c;
  }
  return "#0c0910";
}

export default function OtaleHeroMontage() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const markRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [mode, setMode] = useState<Mode>("loading");
  const [still, setStill] = useState(false);

  useEffect(() => {
    if (cannotUse3D()) { setMode("static"); return; }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setStill(reduce);
    let cancelled = false;
    let handle: { setActive: (on: boolean) => void; destroy: () => void } | null = null;
    let io: IntersectionObserver | null = null;
    let inView = true;
    const sync = () => handle?.setActive(inView && !document.hidden);

    import("./engine")
      .then(({ createMontage }) => {
        const section = sectionRef.current, canvas = canvasRef.current, mark = markRef.current;
        if (cancelled || !section || !canvas || !mark) return;
        handle = createMontage(canvas, {
          still: reduce,
          background: pageBackground(section),
          getProgress: () => {
            const r = section.getBoundingClientRect();
            const range = r.height - window.innerHeight;
            return range > 0 ? Math.min(1, Math.max(0, -r.top / range)) : 1;
          },
          getTarget: () => mark.getBoundingClientRect(),
          onPhase: (b) => {
            const el = titleRef.current;
            if (!el) return;
            const ls = 0.18 + 0.14 * (1 - b); // Buchstaben ziehen sich beim Erscheinen leicht zusammen
            el.style.opacity = String(b);
            el.style.letterSpacing = `${ls}em`;
            el.style.textIndent = `${ls}em`;
            el.style.transform = `translateY(${(1 - b) * 16}px)`;
          },
          onReady: () => !cancelled && setMode("3d"),
        });
        io = new IntersectionObserver(([e]) => { inView = e.isIntersecting; sync(); });
        io.observe(section);
        document.addEventListener("visibilitychange", sync);
        sync();
      })
      .catch(() => !cancelled && setMode("static"));

    return () => {
      cancelled = true;
      io?.disconnect();
      document.removeEventListener("visibilitychange", sync);
      handle?.destroy();
    };
  }, []);

  const animated = mode !== "static" && !still;

  return (
    <section
      id="landing-hero"
      ref={sectionRef}
      aria-label="Otale"
      style={{ position: "relative", height: animated ? SCROLL_LENGTH : "100svh" }}
    >
      <div style={{ position: "sticky", top: 0, height: "100svh", overflow: "hidden" }}>
        {mode !== "static" && (
          <canvas
            ref={canvasRef}
            aria-hidden="true"
            style={{
              position: "absolute", inset: 0, width: "100%", height: "100%", display: "block",
              opacity: mode === "3d" ? 1 : 0, transition: "opacity 0.6s ease",
            }}
          />
        )}
        <div
          style={{
            position: "relative", zIndex: 1, height: "100%", display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", textAlign: "center", padding: "0 24px 80px",
            pointerEvents: "none",
          }}
        >
          {/* Platzhalter: bestimmt Endgroesse und Endposition des 3D-Logos */}
          <div ref={markRef} style={{ width: MARK_WIDTH, aspectRatio: "880 / 584", marginBottom: "clamp(24px, 3vw, 32px)", position: "relative" }}>
            {mode === "static" && (
              <img src={logoUrl} alt="" draggable={false} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
            )}
          </div>
          <h1
            ref={titleRef}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase leading-none"
            style={{
              margin: 0,
              letterSpacing: "0.18em",
              textIndent: "0.18em",
              opacity: animated ? 0 : 1,
              background: "linear-gradient(180deg, var(--text) 0%, var(--brand-lavender) 42%, var(--text-muted) 70%, var(--text) 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Otale
          </h1>
        </div>
      </div>
    </section>
  );
}
