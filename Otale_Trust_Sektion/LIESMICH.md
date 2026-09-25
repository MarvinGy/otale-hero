# Otale Trust-Sektion „Unser Versprechen“ · Übergabe

## Inhalt
- `src/components/otale-trust/TrustSection.tsx` – komplette Section: Überschrift, drei Karten, vier SVG-Icons als React-Komponenten
- `src/components/otale-trust/trust-icons.css` – alle Farben, Rahmen, Rundungen und die Hover-Animationen
- `LOVABLE_PROMPT.md` – Prompt für den Lovable-Agenten

Keine Abhängigkeiten. Die Animationen sind reines CSS, kein framer-motion.

## Die drei Versprechen
Reihenfolge wie der Ablauf einer Bestellung: bezahlen, verpacken, liefern.

| Karte | Text | Grundlage |
|---|---|---|
| Sicherer Checkout | PayPal, Klarna & mehr | Versandrichtlinie im Shop listet PayPal Checkout und Shopify Payments inkl. Klarna |
| Sorgfältig verpackt | Gepolstert im Umkarton versendet | Versandpraxis, vom Betreiber bestätigt |
| Schnelle Lieferung | In 3–5 Werktagen, meist schneller | Versandrichtlinie: „innerhalb von 3 – 5 Werktagen“; „meist schneller“ stützt sich auf die Whatnot-Lieferzeiten |

Bewusst entfernt (Stand 25.09.2026):
- **Kostenloser Versand ab 150 €**: Die Versandrichtlinie nennt pauschal 4,99 €, keinen Gratisversand.
- **30 Tage Rückgabe**: Die Widerrufsbelehrung nennt 14 Tage. Die gesetzlichen 14 Tage als Vorteil zu bewerben, wäre Werbung mit einer Selbstverständlichkeit.

Neue Versprechen nur aufnehmen, wenn die Rechtstexte sie decken.

## Farben
Die Theme-Tokens in `:root` sind Hex-Werte (`--accent: #B497C7`). Deshalb:
- Farben werden direkt mit `var(--token)` benutzt, Transparenz über `color-mix()`.
- Keine `hsl(var(--…))`-Schreibweise und keine Tailwind-Farbklassen. Tailwind nur für Layout und Schriftgrößen.
- Verwendete Tokens: `--foreground`, `--muted-foreground`, `--card`, `--background`, `--border`, `--accent`, `--radius`.
- Die Schrift wird nicht gesetzt, sie kommt von der Seite.

## Verhalten
| Situation | Darstellung |
|---|---|
| Desktop / Tablet | drei Karten nebeneinander, Icon oben, Textfeld unten |
| Handy (unter 640 px) | drei kompakte Zeilen untereinander, Icon links, Text rechts |
| Hover | Karte hebt sich, Rahmen und Schein in der Akzentfarbe, Icon spielt seine Animation |
| Touch | Animation startet beim Antippen |
| „Bewegung reduzieren“ aktiv | keine Bewegung, Icons stehen still |

Die Animationen im Einzelnen:
- **Schloss:** Bügel rastet ein, Schloss pulsiert, Schlüsselloch leuchtet
- **Karton:** Box hebt sich, landet im Polster, Klappen gehen zu, Folie glänzt
- **Lieferwagen:** Räder drehen, Fahrtwind zieht vorbei, Blitz flackert

## Falls später etwas angepasst werden soll
- **Texte:** Array `promises` in `TrustSection.tsx`
- **Akzentfarbe der Icons:** eine Zeile oben in `trust-icons.css`: `.trust-card { --ti-accent: var(--accent); }`
- **Kartenrundung:** folgt `--radius` (Karte doppelt, Textfeld einfach)
