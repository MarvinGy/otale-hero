# Favicon einbinden

Alle Dateien aus diesem Ordner ins Root-Verzeichnis der Website legen, dann in den `<head>`:

```html
<link rel="icon" href="/favicon.ico" sizes="48x48">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
```

Die Favicons nutzen eine vereinfachte Version des Logos (flache Farben, ohne Akzentformen) auf dunkler Kachel, damit das Zeichen in hellen und dunklen Browser-Tabs lesbar bleibt.
