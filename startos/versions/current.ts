import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '16.2.1:0',
  releaseNotes: {
    en_US: `Updated Frappe Helpdesk to 16.2.1. The first-run setup screen now appears whenever the site still needs setup, rather than being skipped in a browser that had completed it before, and the Email Accounts settings screen is spaced like the others.

[Full upstream release notes](https://github.com/frappe/helpdesk/releases/tag/v16.2.1)`,
    es_ES: `Actualizado Frappe Helpdesk a 16.2.1. La pantalla de configuración inicial ahora aparece siempre que el sitio aún necesita configurarse, en lugar de omitirse en un navegador que ya la había completado antes, y la pantalla de ajustes de Cuentas de correo tiene el mismo espaciado que las demás.

[Notas completas de la versión original](https://github.com/frappe/helpdesk/releases/tag/v16.2.1)`,
    de_DE: `Frappe Helpdesk auf 16.2.1 aktualisiert. Der Einrichtungsbildschirm beim ersten Start erscheint jetzt immer, solange die Seite noch eingerichtet werden muss, statt in einem Browser übersprungen zu werden, der ihn schon einmal abgeschlossen hatte, und die Einstellungsseite für E-Mail-Konten hat denselben Abstand wie die anderen.

[Vollständige Upstream-Versionshinweise](https://github.com/frappe/helpdesk/releases/tag/v16.2.1)`,
    pl_PL: `Zaktualizowano Frappe Helpdesk do 16.2.1. Ekran konfiguracji początkowej pojawia się teraz zawsze, gdy witryna wciąż wymaga konfiguracji, zamiast być pomijany w przeglądarce, w której wcześniej go ukończono, a ekran ustawień kont e-mail ma takie same odstępy jak pozostałe.

[Pełne informacje o wydaniu projektu](https://github.com/frappe/helpdesk/releases/tag/v16.2.1)`,
    fr_FR: `Mise à jour de Frappe Helpdesk vers 16.2.1. L'écran de configuration initiale s'affiche désormais tant que le site doit encore être configuré, au lieu d'être ignoré dans un navigateur qui l'avait déjà terminé, et l'écran des paramètres des comptes e-mail a le même espacement que les autres.

[Notes de version complètes du projet](https://github.com/frappe/helpdesk/releases/tag/v16.2.1)`,
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
