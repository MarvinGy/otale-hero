// Trust-Sektion "Unser Versprechen"
// Alle Farben, Rahmen und Rundungen stehen in ./trust-icons.css und kommen aus den
// Theme-Tokens (--foreground, --muted-foreground, --card, --background, --border,
// --accent, --radius). Tailwind wird hier nur für Layout und Schriftgrößen benutzt.
// Die Schrift wird nicht gesetzt, sie kommt von der Seite.
// Keine zusätzliche Abhängigkeit, die Animationen sind reines CSS.
// Jede Aussage in `promises` ist durch die Rechtstexte des Shops gedeckt.
import "./trust-icons.css";

function LockIcon({ className }: { className?: string }) {
  return (
    <svg className={`ti ti-lock ${className ?? ""}`} viewBox="0 0 64 64" aria-hidden="true">
      <rect className="pulse a" fill="none" x="15" y="29" width="34" height="26" rx="4.5" strokeWidth="1.5" vectorEffect="non-scaling-stroke"/>
      <path className="shackle l" fill="none" d="M22 29.5V22a10 10 0 0 1 20 0v7.5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <rect className="l fs" x="15" y="29" width="34" height="26" rx="4.5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <g className="key"><circle className="fa" cx="32" cy="39.5" r="3.2"/><path className="fa" d="M30.6 41.5l-.8 6h4.4l-.8-6z"/></g>
    </svg>
  );
}

function PackIcon({ className }: { className?: string }) {
  return (
    <svg className={`ti ti-pack ${className ?? ""}`} viewBox="0 0 64 64" aria-hidden="true">
      <g className="flap-l"><path className="l" fill="none" d="M12 30L3.81 24.26" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></g>
      <g className="flap-r"><path className="l" fill="none" d="M52 30L60.19 24.26" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></g>
      <g className="item">
        <path className="l fs" d="M22 30V20.5a2.5 2.5 0 0 1 2.5-2.5h15a2.5 2.5 0 0 1 2.5 2.5V30" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path className="shine a" fill="none" d="M37.5 20.5l-4.5 6.5" strokeWidth="1.5" strokeLinecap="round"/>
      </g>
      <g className="bubbles">
        <circle className="b1 a" fill="none" cx="17" cy="27.4" r="2.3" strokeWidth="1.5"/>
        <circle className="b2 a" fill="none" cx="19.4" cy="23.4" r="1.4" strokeWidth="1.5"/>
        <circle className="b3 a" fill="none" cx="47" cy="27.4" r="2.3" strokeWidth="1.5"/>
        <circle className="b4 a" fill="none" cx="44.6" cy="23.4" r="1.4" strokeWidth="1.5"/>
      </g>
      <rect className="l fs" x="12" y="30" width="40" height="24" rx="2.5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path className="l" fill="none" d="M41 49.5v-6M38.9 45.6l2.1-2.1 2.1 2.1M46.5 49.5v-6M44.4 45.6l2.1-2.1 2.1 2.1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function TruckIcon({ className }: { className?: string }) {
  return (
    <svg className={`ti ti-truck ${className ?? ""}`} viewBox="0 0 64 64" aria-hidden="true">
      <g className="speed"><path className="a" d="M3 23H9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path className="a" d="M1 29H8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path className="a" d="M4 35H9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></g>
      <g className="drive">
        <g className="rumble">
          <path className="l" fill="none" d="M14.5 40H14a2 2 0 0 1-2-2V19a2 2 0 0 1 2-2h24a2 2 0 0 1 2 2v21M25.5 40h18M40 23h9.5l7.5 8.5V38a2 2 0 0 1-2 2h-.5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path className="l fs" d="M43 26.5h5.3l4.1 5H43z" strokeWidth="1.5" strokeLinejoin="round"/>
          <path className="bolt fa" d="M27.8 21l-5.2 8.4h3.8L24.6 36l5.2-8.6H26z"/>
        </g>
        <g className="w1"><circle className="l" fill="none" cx="20" cy="41" r="4.5" strokeWidth="2"/><circle className="fa" cx="20" cy="41" r="1.4"/><path className="a" d="M20 39.2v-1.6" strokeWidth="1.5" strokeLinecap="round"/></g>
        <g className="w2"><circle className="l" fill="none" cx="49" cy="41" r="4.5" strokeWidth="2"/><circle className="fa" cx="49" cy="41" r="1.4"/><path className="a" d="M49 39.2v-1.6" strokeWidth="1.5" strokeLinecap="round"/></g>
      </g>
    </svg>
  );
}

const promises = [
  { Icon: LockIcon, title: "Sicherer Checkout", text: "PayPal, Klarna & mehr" },
  { Icon: PackIcon, title: "Sorgfältig verpackt", text: "Gepolstert im Umkarton versendet" },
  { Icon: TruckIcon, title: "Schnelle Lieferung", text: "In 3–5 Werktagen, meist schneller" },
];

export default function TrustSection() {
  return (
    <section aria-labelledby="trust-heading" className="mx-auto w-full max-w-6xl px-4 py-16 md:py-24">
      <div className="trust-head mb-10 text-center md:mb-14">
        <h2 id="trust-heading" className="text-2xl font-black uppercase tracking-tight md:text-5xl">
          Unser Versprechen
        </h2>
        <p className="mt-3 text-sm md:text-base">Worauf du dich bei Otale verlassen kannst</p>
      </div>

      <ul className="mx-auto grid max-w-5xl grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4 lg:gap-5">
        {promises.map(({ Icon, title, text }) => (
          <li key={title} className="trust-card relative flex flex-row items-center sm:flex-col sm:items-stretch overflow-hidden">
            <div aria-hidden="true" className="ti-glow pointer-events-none absolute inset-0" />

            <div className="relative flex h-20 w-20 shrink-0 items-center justify-center sm:h-28 sm:w-auto lg:h-40">
              <div className="ti-wrap">
                <Icon className="h-12 w-12 sm:h-14 sm:w-14 lg:h-[72px] lg:w-[72px]" />
              </div>
            </div>

            <div className="ti-panel relative z-10 my-2 mr-2 sm:mx-2 sm:mb-2 sm:mt-0 flex-1 p-3 backdrop-blur-sm lg:p-4">
              <h3 className="text-sm font-bold leading-snug lg:text-base">{title}</h3>
              <p className="mt-1 text-xs leading-relaxed lg:text-sm">{text}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
