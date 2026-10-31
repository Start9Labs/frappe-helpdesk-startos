import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '1.31.1:0',
  releaseNotes: {
    en_US: `Updated Frappe Helpdesk to 1.31.1 and the StartOS SDK to 3.1.1.

**Security and upgrade requirements**

- Ticket field permissions now prevent customers from changing agent-only fields through the REST API. Customers can only close tickets, leave feedback, or edit template fields marked Editable after creation. A description cannot be changed once set; ticket templates cannot be renamed.
- Existing template visibility settings migrate automatically to Visible to (Everyone / Agents). This setting hides fields only on Helpdesk pages; use Customize Form permission levels to restrict REST API access too.
- After updating, sites with custom staff roles must grant permission level 8 in Role Permission Manager where access to agent-only fields is needed. Review custom code that saves or reads tickets as a customer, or reads hide_from_customer: [migration guide](https://github.com/frappe/helpdesk/wiki/Migrating-customizations-for-ticket-field-permissions).

**Fixes**

- Ticket actions no longer wait for automatic emails to send; editor whitespace and inline images are handled more reliably.
- The SDK fixes container startup for images without /proc or with a symlinked /etc/resolv.conf.

[Full upstream release notes](https://github.com/frappe/helpdesk/releases/tag/v1.31.1)`,
    es_ES: `Actualizados Frappe Helpdesk a 1.31.1 y el SDK de StartOS a 3.1.1.

**Seguridad y requisitos de actualización**

- Los permisos de los campos impiden que los clientes cambien campos exclusivos de agentes mediante la API REST. Los clientes solo pueden cerrar tickets, dejar valoraciones o editar campos de plantilla marcados como editables después de la creación. La descripción no puede cambiarse una vez establecida; las plantillas de tickets no pueden renombrarse.
- La visibilidad de las plantillas existentes migra automáticamente a Visible para (Todos / Agentes). Este ajuste solo oculta campos en las páginas de Helpdesk; usa los niveles de permisos de Customize Form para restringir también el acceso por la API REST.
- Tras actualizar, los sitios con roles de personal personalizados deben conceder el nivel de permisos 8 en Role Permission Manager cuando necesiten acceso a campos exclusivos de agentes. Revisa el código personalizado que guarda o lee tickets como cliente, o lee hide_from_customer: [guía de migración](https://github.com/frappe/helpdesk/wiki/Migrating-customizations-for-ticket-field-permissions).

**Correcciones**

- Las acciones de tickets ya no esperan al envío de correos automáticos; se mejora el tratamiento de espacios del editor e imágenes insertadas.
- El SDK corrige el inicio de contenedores con imágenes sin /proc o con /etc/resolv.conf como enlace simbólico.

[Notas completas de la versión original](https://github.com/frappe/helpdesk/releases/tag/v1.31.1)`,
    de_DE: `Frappe Helpdesk auf 1.31.1 und das StartOS-SDK auf 3.1.1 aktualisiert.

**Sicherheit und Hinweise zum Update**

- Feldberechtigungen verhindern, dass Kunden über die REST-API agentenexklusive Ticketfelder ändern. Kunden können Tickets nur schließen, Feedback geben oder Vorlagenfelder bearbeiten, die nach der Erstellung bearbeitbar sind. Eine einmal gesetzte Beschreibung ist unveränderlich; Ticketvorlagen können nicht umbenannt werden.
- Bestehende Sichtbarkeitseinstellungen werden automatisch nach Sichtbar für (Alle / Agenten) migriert. Dies verbirgt Felder nur auf Helpdesk-Seiten; REST-API-Zugriff muss zusätzlich über Berechtigungsstufen in Customize Form eingeschränkt werden.
- Nach dem Update benötigen eigene Mitarbeiterrollen die Berechtigungsstufe 8 im Role Permission Manager, wenn sie auf agentenexklusive Felder zugreifen sollen. Eigenen Code prüfen, der Tickets als Kunde liest oder speichert oder hide_from_customer liest: [Migrationsanleitung](https://github.com/frappe/helpdesk/wiki/Migrating-customizations-for-ticket-field-permissions).

**Fehlerbehebungen**

- Ticketaktionen warten nicht mehr auf den Versand automatischer E-Mails; Leerraum im Editor und eingebettete Bilder werden zuverlässiger verarbeitet.
- Das SDK behebt Containerstarts bei Images ohne /proc oder mit symbolisch verlinkter /etc/resolv.conf.

[Vollständige Upstream-Versionshinweise](https://github.com/frappe/helpdesk/releases/tag/v1.31.1)`,
    pl_PL: `Zaktualizowano Frappe Helpdesk do 1.31.1 i SDK StartOS do 3.1.1.

**Bezpieczeństwo i wymagania aktualizacji**

- Uprawnienia pól uniemożliwiają klientom zmianę pól przeznaczonych dla agentów przez API REST. Klienci mogą jedynie zamykać zgłoszenia, wystawiać oceny lub edytować pola szablonu oznaczone jako edytowalne po utworzeniu. Ustawionego opisu nie można zmienić; nie można zmieniać nazw szablonów zgłoszeń.
- Widoczność w istniejących szablonach jest automatycznie przenoszona do opcji Widoczne dla (Wszyscy / Agenci). Ukrywa ona pola tylko na stronach Helpdesk; dostęp przez API REST należy dodatkowo ograniczyć poziomami uprawnień w Customize Form.
- Po aktualizacji witryny z własnymi rolami pracowników muszą przyznać poziom uprawnień 8 w Role Permission Manager tam, gdzie potrzebny jest dostęp do pól agentów. Sprawdź własny kod zapisujący lub odczytujący zgłoszenia jako klient albo odczytujący hide_from_customer: [poradnik migracji](https://github.com/frappe/helpdesk/wiki/Migrating-customizations-for-ticket-field-permissions).

**Poprawki**

- Operacje na zgłoszeniach nie czekają już na wysłanie automatycznych e-maili; poprawiono obsługę odstępów w edytorze i osadzonych obrazów.
- SDK naprawia uruchamianie kontenerów z obrazami bez /proc lub z dowiązaniem symbolicznym /etc/resolv.conf.

[Pełne informacje o wydaniu projektu](https://github.com/frappe/helpdesk/releases/tag/v1.31.1)`,
    fr_FR: `Mise à jour de Frappe Helpdesk vers 1.31.1 et du SDK StartOS vers 3.1.1.

**Sécurité et exigences de mise à jour**

- Les permissions des champs empêchent les clients de modifier les champs réservés aux agents via l'API REST. Les clients peuvent uniquement fermer un ticket, donner un avis ou modifier les champs du modèle marqués comme modifiables après création. Une description déjà définie ne peut plus être modifiée ; les modèles de tickets ne peuvent plus être renommés.
- Les réglages de visibilité existants migrent automatiquement vers Visible par (Tout le monde / Agents). Ce réglage masque les champs uniquement sur les pages Helpdesk ; utilisez les niveaux de permission de Customize Form pour restreindre aussi l'accès par l'API REST.
- Après la mise à jour, les sites ayant des rôles de personnel personnalisés doivent accorder le niveau de permission 8 dans Role Permission Manager lorsque l'accès aux champs réservés aux agents est nécessaire. Vérifiez le code personnalisé qui lit ou enregistre des tickets en tant que client, ou lit hide_from_customer : [guide de migration](https://github.com/frappe/helpdesk/wiki/Migrating-customizations-for-ticket-field-permissions).

**Corrections**

- Les actions sur les tickets n'attendent plus l'envoi des e-mails automatiques ; les espaces de l'éditeur et les images intégrées sont mieux gérés.
- Le SDK corrige le démarrage des conteneurs avec une image sans /proc ou avec un lien symbolique pour /etc/resolv.conf.

[Notes de version complètes du projet](https://github.com/frappe/helpdesk/releases/tag/v1.31.1)`,
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
