# Offline i aktualizacje PWA

## Offline

Service Worker zapisuje app shell oraz pliki z `assets/`. Nawigacja ma strategię network-first z fallbackiem do `index.html` albo `offline.html`.

## Cache

- pliki lokalne: cache-first,
- nawigacja: network-first,
- zasoby zewnętrzne: stale-while-revalidate,
- aktywacja nowej wersji usuwa stare cache.

## Aktualizacje

Po wykryciu nowego Service Workera aplikacja pokazuje komunikat „Dostępna aktualizacja”.
