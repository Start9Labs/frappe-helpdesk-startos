import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '1.30.1:1',
  releaseNotes: {
    en_US:
      'Adds the Start9 support portal (the start9_support app), served at the address root. Live updates now work on every address.',
    es_ES:
      'Añade el portal de soporte de Start9 (la app start9_support), servido en la raíz de la dirección. Las actualizaciones en vivo ahora funcionan en todas las direcciones.',
    de_DE:
      'Fügt das Start9-Supportportal (die App start9_support) hinzu, das unter der Adresswurzel bereitgestellt wird. Live-Updates funktionieren jetzt auf jeder Adresse.',
    pl_PL:
      'Dodaje portal wsparcia Start9 (aplikację start9_support), serwowany w katalogu głównym adresu. Aktualizacje na żywo działają teraz na każdym adresie.',
    fr_FR:
      'Ajoute le portail d’assistance Start9 (l’application start9_support), servi à la racine de l’adresse. Les mises à jour en direct fonctionnent désormais sur chaque adresse.',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
