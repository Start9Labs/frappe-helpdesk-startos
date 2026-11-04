import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '16.0.0:0',
  releaseNotes: {
    en_US: `Updated Frappe Helpdesk to 16.0.0, on Frappe Framework 16.

- Notifications can be filtered by read state and category; settings navigation and ticket view switching are clearer.
- Customer managers now have all customer permissions, including article feedback and ticket feedback options.
- The Frappe administration desk is at /desk; Helpdesk remains at /helpdesk.

**Before updating**

Create a StartOS backup. The update migrates the existing site's database to Frappe 16. If you customized standard Frappe workspaces, copy their layouts with Copy to Clipboard before updating and restore them afterwards. Review custom scripts and integrations against the [Frappe 16 migration guide](https://github.com/frappe/frappe/wiki/Migrating-to-version-16), especially permission hooks, database queries and state-changing API calls.

[Helpdesk changes](https://github.com/frappe/helpdesk/compare/v1.31.1...v16.0.0) · [Frappe 16 migration guide](https://github.com/frappe/frappe/wiki/Migrating-to-version-16)`,
    es_ES: `Actualizado Frappe Helpdesk a 16.0.0, sobre Frappe Framework 16.

- Las notificaciones pueden filtrarse por estado de lectura y categoría; la navegación de ajustes y el cambio de vista de tickets son más claros.
- Los gestores de clientes disponen de todos los permisos de cliente, incluidos los comentarios sobre artículos y las opciones de valoración de tickets.
- El escritorio de administración de Frappe está en /desk; Helpdesk sigue en /helpdesk.

**Antes de actualizar**

Crea una copia de seguridad en StartOS. La actualización migra la base de datos del sitio existente a Frappe 16. Si personalizaste espacios de trabajo estándar de Frappe, copia sus diseños con Copy to Clipboard antes de actualizar y restáuralos después. Revisa los scripts e integraciones personalizados con la [guía de migración a Frappe 16](https://github.com/frappe/frappe/wiki/Migrating-to-version-16), especialmente los hooks de permisos, las consultas a la base de datos y las llamadas API que cambian datos.

[Cambios de Helpdesk](https://github.com/frappe/helpdesk/compare/v1.31.1...v16.0.0) · [Guía de migración a Frappe 16](https://github.com/frappe/frappe/wiki/Migrating-to-version-16)`,
    de_DE: `Frappe Helpdesk auf 16.0.0 mit Frappe Framework 16 aktualisiert.

- Benachrichtigungen lassen sich nach Lesestatus und Kategorie filtern; Einstellungsnavigation und Ticketansichtswechsel sind übersichtlicher.
- Kundenmanager erhalten alle Kundenberechtigungen, einschließlich Artikelbewertungen und Ticketbewertungsoptionen.
- Die Frappe-Verwaltungsoberfläche liegt unter /desk; Helpdesk bleibt unter /helpdesk.

**Vor dem Update**

Ein StartOS-Backup erstellen. Das Update migriert die Datenbank der bestehenden Site auf Frappe 16. Angepasste Standard-Arbeitsbereiche von Frappe vor dem Update mit Copy to Clipboard kopieren und danach wiederherstellen. Eigene Skripte und Integrationen anhand der [Frappe-16-Migrationsanleitung](https://github.com/frappe/frappe/wiki/Migrating-to-version-16) prüfen, insbesondere Berechtigungs-Hooks, Datenbankabfragen und zustandsändernde API-Aufrufe.

[Helpdesk-Änderungen](https://github.com/frappe/helpdesk/compare/v1.31.1...v16.0.0) · [Frappe-16-Migrationsanleitung](https://github.com/frappe/frappe/wiki/Migrating-to-version-16)`,
    pl_PL: `Zaktualizowano Frappe Helpdesk do 16.0.0 na Frappe Framework 16.

- Powiadomienia można filtrować według stanu przeczytania i kategorii; poprawiono nawigację ustawień i przełączanie widoków zgłoszeń.
- Menedżerowie klientów mają wszystkie uprawnienia klientów, w tym oceny artykułów i opcje oceny zgłoszeń.
- Panel administracyjny Frappe jest dostępny pod /desk; Helpdesk pozostaje pod /helpdesk.

**Przed aktualizacją**

Utwórz kopię zapasową w StartOS. Aktualizacja migruje bazę danych istniejącej witryny do Frappe 16. Jeśli zmieniono standardowe obszary robocze Frappe, skopiuj ich układy przyciskiem Copy to Clipboard przed aktualizacją i przywróć je później. Sprawdź własne skrypty i integracje według [poradnika migracji do Frappe 16](https://github.com/frappe/frappe/wiki/Migrating-to-version-16), zwłaszcza hooki uprawnień, zapytania do bazy danych i wywołania API zmieniające dane.

[Zmiany Helpdesk](https://github.com/frappe/helpdesk/compare/v1.31.1...v16.0.0) · [Poradnik migracji do Frappe 16](https://github.com/frappe/frappe/wiki/Migrating-to-version-16)`,
    fr_FR: `Mise à jour de Frappe Helpdesk vers 16.0.0, sur Frappe Framework 16.

- Les notifications peuvent être filtrées par état de lecture et catégorie ; la navigation des paramètres et le changement de vue des tickets sont plus clairs.
- Les responsables clients disposent de toutes les permissions des clients, notamment les avis sur les articles et les options d'évaluation des tickets.
- Le bureau d'administration Frappe est accessible à /desk ; Helpdesk reste à /helpdesk.

**Avant la mise à jour**

Créez une sauvegarde StartOS. La mise à jour migre la base de données du site existant vers Frappe 16. Si vous avez personnalisé des espaces de travail standard de Frappe, copiez leurs mises en page avec Copy to Clipboard avant la mise à jour et restaurez-les ensuite. Vérifiez vos scripts et intégrations avec le [guide de migration Frappe 16](https://github.com/frappe/frappe/wiki/Migrating-to-version-16), en particulier les hooks de permissions, les requêtes de base de données et les appels API modifiant des données.

[Modifications de Helpdesk](https://github.com/frappe/helpdesk/compare/v1.31.1...v16.0.0) · [Guide de migration Frappe 16](https://github.com/frappe/frappe/wiki/Migrating-to-version-16)`,
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
