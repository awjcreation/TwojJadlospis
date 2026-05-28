# Twój jadłospis — PWA v1.0.0

Instalowalna aplikacja PWA do planowania jadłospisów, przepisów, produktów i list zakupów.

## Publikacja

Wgraj całą zawartość katalogu na serwer HTTPS:

- `index.html`
- `styles.css`
- `app.js`
- `manifest.webmanifest`
- `sw.js`
- `assets/`
- `docs/`

## Dane

Dane użytkownika są zapisywane lokalnie w `localStorage`. Kopia zapasowa eksportuje ustawienia, produkty użytkownika, przepisy, jadłospisy, przypisania, preferencje i listę zakupów.

## Wersja

Numer wersji jest zapisany w `manifest.webmanifest` i wyświetlany w Ustawieniach.

## Autor

awj.creation — awj.creation@gmail.com


## Pakiety zależności

Import przepisów i jadłospisów obsługuje pakiety:

- `recipePack`: produkty + przepisy,
- `mealPlanPack`: produkty + przepisy + jadłospisy,
- `resourcePack`: pełny pakiet zasobów traktowany jak `mealPlanPack`.

Przy imporcie produktów aplikacja pyta, jak obsłużyć konflikty:
użyć obecnej bazy, uzupełnić braki, nadpisać importem albo dodać kopie.
