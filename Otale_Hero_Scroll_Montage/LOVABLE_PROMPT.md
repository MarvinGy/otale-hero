Ersetze die Hero-Section der Startseite durch die neue Komponente `OtaleHeroMontage` (3D-Scroll-Montage des Logos). Die Dateien sind fertig, getestet und final abgestimmt. Übernimm sie **exakt wie geliefert** – nichts umschreiben, vereinfachen, „verbessern“ oder neu interpretieren. Geometrie-Daten, Material-, Licht- und Timing-Werte bitte nicht verändern.

**1. Abhängigkeiten**
- `three` als dependency (aktuelle Version), `@types/three` als devDependency.
- Keine weiteren Libraries (kein react-three-fiber, kein drei, kein GSAP).

**2. Neue Dateien anlegen (Inhalt 1:1)**
- `src/components/otale-hero/engine.ts`
- `src/components/otale-hero/OtaleHeroMontage.tsx`
- `src/components/otale-hero/logo-data.json`
- `src/assets/otale-logo-light.svg`

**3. `src/pages/Landing.tsx`**
- `import OtaleHeroMontage from "@/components/otale-hero/OtaleHeroMontage";`
- Die bisherige `<HeroSection />` durch `<OtaleHeroMontage />` ersetzen und die alte `HeroSection`-Funktion entfernen.
- Den Import von `OtaleMark` entfernen sowie `useScroll`, `useTransform` und andere framer-motion-Imports, falls sie danach nirgends mehr genutzt werden.
- Alle anderen Sections bleiben unverändert und folgen direkt nach der neuen Hero-Section.

**4. Aufräumen**
- In `src/index.css` den Block `.hero-mark .otale-mark { width: 100% !important; }` entfernen.
- `src/components/OtaleMark.tsx` nur löschen, wenn es nirgends sonst importiert wird.

**5. Zwingend prüfen (sonst funktioniert die Scroll-Animation nicht)**
- Die Hero-Section nutzt `position: sticky`. Kein Eltern-Element der Section (Layout-Wrapper, `main`, Page-Container) darf `overflow: hidden`, `overflow-x: hidden`, `overflow: auto` oder `overflow: scroll` haben. Falls doch: auf diesem Wrapper durch `overflow-x: clip` ersetzen.
- Die Seite muss eine **einfarbige** Hintergrundfarbe auf `body` oder einem Eltern-Element haben (euer dunkler Seitenhintergrund). Die Komponente liest diese Farbe aus, damit 3D-Bild und Seite nahtlos ineinander übergehen.

**Nicht ändern**
- `engine.ts` muss per `import("./engine")` dynamisch geladen bleiben (three.js gehört in einen eigenen Chunk).
- Die Section ist absichtlich 220svh hoch: das ist die Scroll-Strecke der Animation, kein Layoutfehler.
- Das leere `div` über der Überschrift ist ein Platzhalter, der Endgröße und Endposition des 3D-Logos bestimmt – nicht entfernen.
- Die Überschrift ist absichtlich beim Laden unsichtbar und erscheint beim Scrollen.

**Falls TypeScript bei `import LOGO from "./logo-data.json"` meckert:** in der tsconfig `"resolveJsonModule": true` setzen.

**Abnahme-Checkliste**
- [ ] Beim Laden: Logo steht groß als Explosionszeichnung (Silberband schwebt über violetten Ringen) auf dem dunklen Hintergrund, ohne sichtbare Kante zwischen 3D-Bild und Seite.
- [ ] Beim Scrollen setzt sich das Logo zusammen, rastet ein, ein sanfter Lichtschwenk läuft darüber, dann wandert es klein über die Überschrift „Otale“, die dabei einblendet.
- [ ] Zurückscrollen zerlegt das Logo wieder.
- [ ] Nach der Hero-Section scrollt die Seite normal weiter.
- [ ] Systemeinstellung „Bewegung reduzieren“: fertiges Logo mit Überschrift, Section nur einen Bildschirm hoch.
- [ ] Keine Konsolenfehler, `npm run build` läuft durch.
