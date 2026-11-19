import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '16.2.0:0',
  releaseNotes: {
    en_US: `Updated Frappe Helpdesk to 16.2.0.

- Redesigned customer portal, with a public knowledge base.
- Knowledge base subcategories and pinned articles.
- The ticket list can be grouped by a field, with counts and totals per group.
- Agents can set a status that clears itself after a chosen time.
- Splitting a ticket now requires write access to it, as merging already did.

[Full upstream release notes](https://github.com/frappe/helpdesk/releases/tag/v16.2.0)`,
    es_ES: `Actualizado Frappe Helpdesk a 16.2.0.

- Portal de clientes rediseñado, con base de conocimiento pública.
- Subcategorías y artículos fijados en la base de conocimiento.
- La lista de tickets puede agruparse por un campo, con recuentos y totales por grupo.
- Los agentes pueden fijar un estado que se borra solo tras el tiempo elegido.
- Dividir un ticket ahora requiere permiso de escritura sobre él, como ya ocurría al fusionar.

[Notas completas de la versión original](https://github.com/frappe/helpdesk/releases/tag/v16.2.0)`,
    de_DE: `Frappe Helpdesk auf 16.2.0 aktualisiert.

- Neu gestaltetes Kundenportal mit öffentlicher Wissensdatenbank.
- Unterkategorien und angeheftete Artikel in der Wissensdatenbank.
- Die Ticketliste lässt sich nach einem Feld gruppieren, mit Anzahl und Summen je Gruppe.
- Agenten können einen Status setzen, der sich nach einer gewählten Zeit selbst zurücksetzt.
- Das Aufteilen eines Tickets erfordert jetzt Schreibrechte darauf, wie bereits beim Zusammenführen.

[Vollständige Upstream-Versionshinweise](https://github.com/frappe/helpdesk/releases/tag/v16.2.0)`,
    pl_PL: `Zaktualizowano Frappe Helpdesk do 16.2.0.

- Przeprojektowany portal klienta z publiczną bazą wiedzy.
- Podkategorie i przypięte artykuły w bazie wiedzy.
- Listę zgłoszeń można grupować według pola, z liczbą i sumami dla każdej grupy.
- Agenci mogą ustawić status, który sam się czyści po wybranym czasie.
- Podział zgłoszenia wymaga teraz uprawnień do jego edycji, tak jak już przy scalaniu.

[Pełne informacje o wydaniu projektu](https://github.com/frappe/helpdesk/releases/tag/v16.2.0)`,
    fr_FR: `Mise à jour de Frappe Helpdesk vers 16.2.0.

- Portail client repensé, avec une base de connaissances publique.
- Sous-catégories et articles épinglés dans la base de connaissances.
- La liste des tickets peut être regroupée par champ, avec des comptes et des totaux par groupe.
- Les agents peuvent définir un statut qui s'efface de lui-même après une durée choisie.
- Scinder un ticket exige désormais un accès en écriture à celui-ci, comme c'était déjà le cas pour la fusion.

[Notes de version complètes du projet](https://github.com/frappe/helpdesk/releases/tag/v16.2.0)`,
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
