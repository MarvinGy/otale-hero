Ersetze auf der Startseite die bestehende Section „Unser Versprechen“ (bisher vier Punkte: Blitzschnelle Lieferung, Kostenloser Versand, Sicherer Checkout, 30 Tage Rückgabe) durch die neue Komponente `TrustSection`. Die Dateien sind fertig, getestet und abgestimmt. Übernimm sie **exakt wie geliefert** – nichts umschreiben, vereinfachen, „verbessern“ oder neu interpretieren.

**1. Abhängigkeiten**
- Keine. Die Animationen sind reines CSS. Kein framer-motion, keine Icon-Library.

**2. Neue Dateien anlegen (Inhalt 1:1)**
- `src/components/otale-trust/TrustSection.tsx`
- `src/components/otale-trust/trust-icons.css`

**3. Einbinden**
- `import TrustSection from "@/components/otale-trust/TrustSection";`
- Die bisherige „Unser Versprechen“-Section an derselben Stelle durch `<TrustSection />` ersetzen und den alten Code dieser Section entfernen.
- Icon-Imports (z. B. aus lucide-react), die danach nirgends mehr genutzt werden, entfernen.
- Alle anderen Sections bleiben unverändert.

**Nicht ändern**
- **Farben:** Alle Farben laufen über `var(--token)` und `color-mix()` in `trust-icons.css`, weil die Theme-Tokens Hex-Werte sind. Nicht in `hsl(var(--…))` umschreiben und nicht durch Tailwind-Farbklassen (`text-foreground`, `bg-background/40` usw.) ersetzen – sonst werden die Icons unsichtbar.
- **Icons:** Die vier SVG-Icons sind eigens gezeichnet und animiert. Nicht gegen Lucide- oder andere Icons tauschen.
- **Schrift:** Wird absichtlich nicht gesetzt, die Section erbt die Schrift der Seite.
- **Texte:** Die drei Versprechen sind mit den Rechtstexten des Shops abgestimmt. Keine Versprechen hinzufügen oder umformulieren. „Kostenloser Versand“ und „30 Tage Rückgabe“ sind absichtlich entfernt.
- Die Section hat absichtlich keinen eigenen Hintergrund.

**Abnahme-Checkliste**
- [ ] Desktop: drei Karten nebeneinander, Icons mit hellen Linien und lavendelfarbenen Akzenten gut sichtbar.
- [ ] Hover über eine Karte: Karte hebt sich, Rahmen färbt sich lavendel, das Icon spielt seine Animation (Schloss rastet ein · Karton schließt sich · Lieferwagen fährt).
- [ ] Handy: drei kompakte Zeilen untereinander, Icon links, Text rechts, kein seitliches Scrollen.
- [ ] Systemeinstellung „Bewegung reduzieren“: keine Animationen, alles sichtbar.
- [ ] Sind die Icons unsichtbar oder schwarz, wurden die Farben umgeschrieben – Dateien erneut 1:1 übernehmen.
- [ ] Keine Konsolenfehler, `npm run build` läuft durch.
