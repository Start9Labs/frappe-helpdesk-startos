import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '16.2.2:0',
  releaseNotes: {
    en_US: `Updated Frappe Helpdesk to 16.2.2. Fixes keyboard focus in the Flow chat, fixes Flow server callbacks being blocked, and shows the full name beside user avatars.

[Full release notes](https://github.com/frappe/helpdesk/releases/tag/v16.2.2)`,
    es_ES: `Actualizado Frappe Helpdesk a 16.2.2. Corrige el foco del teclado en el chat de Flow, corrige el bloqueo de las devoluciones de llamada del servidor de Flow y muestra el nombre completo junto a los avatares de usuario.

[Notas completas de la versión](https://github.com/frappe/helpdesk/releases/tag/v16.2.2)`,
    de_DE: `Frappe Helpdesk auf 16.2.2 aktualisiert. Behebt den Tastaturfokus im Flow-Chat, behebt blockierte Server-Callbacks von Flow und zeigt den vollständigen Namen neben Benutzer-Avataren an.

[Vollständige Versionshinweise](https://github.com/frappe/helpdesk/releases/tag/v16.2.2)`,
    pl_PL: `Zaktualizowano Frappe Helpdesk do 16.2.2. Naprawiono fokus klawiatury w czacie Flow, naprawiono blokowanie wywołań zwrotnych serwera Flow, a obok awatarów użytkowników wyświetlane jest teraz pełne imię i nazwisko.

[Pełne informacje o wydaniu](https://github.com/frappe/helpdesk/releases/tag/v16.2.2)`,
    fr_FR: `Mise à jour de Frappe Helpdesk vers 16.2.2. Corrige le focus clavier dans le chat Flow, corrige le blocage des rappels serveur de Flow et affiche le nom complet à côté des avatars des utilisateurs.

[Notes de version complètes](https://github.com/frappe/helpdesk/releases/tag/v16.2.2)`,
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
