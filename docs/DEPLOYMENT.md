# Twój jadłospis — dokumentacja wdrożeniowa

## Wersja

`v4.8.0`

## Zawartość paczki

- `index.html` — główny plik aplikacji.
- `styles.css` — style UI.
- `app.js` — logika aplikacji, dane startowe i moduły PWA.
- `sw.js` — service worker offline/cache.
- `manifest.json` — manifest PWA.
- `data/` — dane pomocnicze, w tym baza produktów.
- `recipes/` — pliki przepisów JSON.
- `.htaccess` — przykładowa konfiguracja Apache.
- `docs/` — dokumentacja techniczna.

## Moduły aplikacji

1. Ekran startowy z jadłospisem przypisanym do dnia.
2. Kalendarz i przypisywanie jadłospisów do dat.
3. Jadłospisy dzienne.
4. Przepisy: podgląd, edycja, import i eksport.
5. Produkty: baza produktów, dane użytkownika, źródła wartości.
6. Lista zakupów: zakres dat, edycja ilości, zapis i udostępnianie.
7. Ustawienia: godziny i kaloryczność posiłków.
8. PWA/offline.

## Ikony produktów

Zaimplementowano zestaw ikon z pliku `zestaw_ikon_produktow_pwa-1.html`.

| Kategoria | Symbol |
|---|---|
| Warzywa | `nutrition` |
| Owoce | `spa` |
| Pieczywo | `bakery_dining` |
| Zboża | `wheat` |
| Nabiał | `grocery` |
| Jaja | `egg_alt` |
| Mięso | `savings` |
| Ryby | `set_meal` |
| Strączki | `avocado_bean` |
| Tłuszcze | `water_do` |
| Orzechy | `neurology` |
| Przyprawy i zioła | `psychiatry` |
| Dodatki | `local_pizza` |
| Napoje | `water_medium` |
| Produkty użytkownika | `person` |
| Produkty z przepisów | `menu_book` |
| Inne | `shopping_cart` |

## Wdrożenie na serwer

1. Rozpakuj ZIP.
2. Wgraj całą zawartość katalogu na serwer.
3. Upewnij się, że serwer udostępnia pliki statyczne:
   - `.html`
   - `.css`
   - `.js`
   - `.json`
   - obrazy z katalogu `assets/`
4. Otwórz `index.html` w przeglądarce.
5. Po aktualizacji wersji wyczyść cache PWA albo odśwież aplikację po ponownym uruchomieniu.

## Dane i prywatność

Aplikacja zapisuje dane lokalnie w przeglądarce przez `localStorage`.
Nie wymaga backendu ani bazy danych na serwerze.

## Uwaga produkcyjna

Do stabilnej produkcji warto w przyszłości dodać:
- migracje danych między wersjami,
- eksport/import pełnej kopii zapasowej,
- testy automatyczne UI,
- opcjonalną synchronizację przez backend.
