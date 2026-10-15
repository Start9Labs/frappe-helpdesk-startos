import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '1.31.0:0',
  releaseNotes: {
    en_US: `Updated Frappe Helpdesk to 1.31.0.

- Adds pinned comments, a refreshed ticket timeline and dashboard charts; fixes permissions and SLA timers for tickets on hold.
- The update migrates comments, ticket activities, notifications, reactions and attachment links to Frappe's core records. Large installations may need extra database space and a longer update; search may be temporarily unavailable if its index must be rebuilt.
- Custom scripts using HD Ticket Comment, HD Ticket Activity or HD Notification must move to the new records: [customization migration guide](https://github.com/frappe/helpdesk/wiki/Migrating-customizations-from-HD-Ticket-Comment-to-Comment).

[Full upstream changes](https://github.com/frappe/helpdesk/compare/v1.30.2...v1.31.0)`,
    es_ES: `Actualizado Frappe Helpdesk a 1.31.0.

- Añade comentarios fijados, una cronología de tickets renovada y gráficos del panel; corrige permisos y temporizadores SLA de tickets en espera.
- La actualización migra comentarios, actividades de tickets, notificaciones, reacciones y enlaces de adjuntos a los registros del núcleo de Frappe. Las instalaciones grandes pueden necesitar más espacio en la base de datos y una actualización más larga; la búsqueda puede quedar temporalmente indisponible si debe reconstruirse su índice.
- Los scripts personalizados que usan HD Ticket Comment, HD Ticket Activity o HD Notification deben adaptarse a los nuevos registros: [guía de migración de personalizaciones](https://github.com/frappe/helpdesk/wiki/Migrating-customizations-from-HD-Ticket-Comment-to-Comment).

[Todos los cambios de upstream](https://github.com/frappe/helpdesk/compare/v1.30.2...v1.31.0)`,
    de_DE: `Frappe Helpdesk auf 1.31.0 aktualisiert.

- Fügt angeheftete Kommentare, einen überarbeiteten Ticketverlauf und Dashboard-Diagramme hinzu; korrigiert Berechtigungen und SLA-Zeitmessung bei pausierten Tickets.
- Das Update migriert Kommentare, Ticketaktivitäten, Benachrichtigungen, Reaktionen und Anhangsverknüpfungen in Frappe-Kerndatensätze. Große Installationen benötigen möglicherweise zusätzlichen Datenbankspeicher und mehr Zeit für das Update; die Suche kann während eines nötigen Indexneuaufbaus vorübergehend ausfallen.
- Eigene Skripte mit HD Ticket Comment, HD Ticket Activity oder HD Notification müssen auf die neuen Datensätze umgestellt werden: [Anleitung zur Migration von Anpassungen](https://github.com/frappe/helpdesk/wiki/Migrating-customizations-from-HD-Ticket-Comment-to-Comment).

[Alle Upstream-Änderungen](https://github.com/frappe/helpdesk/compare/v1.30.2...v1.31.0)`,
    pl_PL: `Zaktualizowano Frappe Helpdesk do 1.31.0.

- Dodano przypinanie komentarzy, odświeżoną oś czasu zgłoszeń i wykresy pulpitu; poprawiono uprawnienia i liczniki SLA wstrzymanych zgłoszeń.
- Aktualizacja przenosi komentarze, aktywności zgłoszeń, powiadomienia, reakcje i odnośniki do załączników do rekordów rdzenia Frappe. Duże instalacje mogą wymagać dodatkowego miejsca w bazie danych i dłuższej aktualizacji; wyszukiwanie może być czasowo niedostępne, jeśli trzeba przebudować indeks.
- Własne skrypty używające HD Ticket Comment, HD Ticket Activity lub HD Notification muszą przejść na nowe rekordy: [poradnik migracji dostosowań](https://github.com/frappe/helpdesk/wiki/Migrating-customizations-from-HD-Ticket-Comment-to-Comment).

[Pełna lista zmian upstream](https://github.com/frappe/helpdesk/compare/v1.30.2...v1.31.0)`,
    fr_FR: `Mise à jour de Frappe Helpdesk vers 1.31.0.

- Ajout des commentaires épinglés, d'une chronologie des tickets remaniée et de graphiques du tableau de bord ; correction des permissions et des compteurs SLA des tickets en attente.
- La mise à jour migre les commentaires, activités des tickets, notifications, réactions et liens des pièces jointes vers les enregistrements du cœur de Frappe. Les grandes installations peuvent nécessiter davantage d'espace en base et une mise à jour plus longue ; la recherche peut être temporairement indisponible si son index doit être reconstruit.
- Les scripts personnalisés utilisant HD Ticket Comment, HD Ticket Activity ou HD Notification doivent adopter les nouveaux enregistrements : [guide de migration des personnalisations](https://github.com/frappe/helpdesk/wiki/Migrating-customizations-from-HD-Ticket-Comment-to-Comment).

[Tous les changements upstream](https://github.com/frappe/helpdesk/compare/v1.30.2...v1.31.0)`,
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
