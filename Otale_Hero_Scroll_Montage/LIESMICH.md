# Otale Hero – Scroll-Montage · Übergabe

## Inhalt
- `src/components/otale-hero/engine.ts` – three.js-Szene: Geometrie, Materialien, Licht, Animation, Qualitätsstufen
- `src/components/otale-hero/OtaleHeroMontage.tsx` – komplette Hero-Section (Sticky-Scroll, Überschrift, Fallbacks)
- `src/components/otale-hero/logo-data.json` – 3D-Formdaten aus der Master-SVG
- `src/assets/otale-logo-light.svg` – statischer Fallback
- `LOVABLE_PROMPT.md` – Prompt für den Lovable-Agenten

## Verhalten
| Situation | Darstellung |
|---|---|
| Normal | Scroll-Montage über 2,2 Bildschirmhöhen, danach normales Scrollen |
| „Bewegung reduzieren“ aktiv | fertiges Logo als 3D-Standbild, Section 1 Bildschirm hoch |
| Kein WebGL / Datensparmodus / Ladefehler | statisches SVG, Section 1 Bildschirm hoch |
| Schwaches Gerät | automatisch niedrigere Qualitätsstufe, bei Rucklern stufenweise weiter herunter |
| Hero nicht sichtbar / Tab im Hintergrund | Rendering pausiert |

## Falls später doch etwas angepasst werden soll
Alle Gestaltungswerte stehen gesammelt im Objekt `LOOK` oben in `engine.ts`, die Scroll-Länge als `SCROLL_LENGTH` in `OtaleHeroMontage.tsx`.
