# Dokumentacja techniczna

## Struktura

- `index.html` — root aplikacji i nawigacja,
- `styles.css` — UI, responsywność, motywy,
- `app.js` — logika, stan i widoki,
- `manifest.webmanifest` — konfiguracja PWA i numer wersji,
- `sw.js` — Service Worker,
- `assets/` — ikony i grafiki.

## Stan

Stan aplikacji jest przechowywany w `localStorage` pod kluczem `twoj-jadlospis-state-v1`.

## Motywy

Dostępne są: `Auto`, `Jasny`, `Ciemny`. Tryb Auto używa `prefers-color-scheme`.

## Import i eksport

Import JSON używa `showOpenFilePicker`, z fallbackiem do `<input type="file" accept=".json">`.

## Walidacja

Wykonano lokalnie:
- `node --check app.js`,
- parse JSON manifestu,
- kontrolę struktury HTML/PWA,
- kontrolę balansu nawiasów CSS.
