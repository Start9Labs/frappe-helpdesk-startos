import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '16.2.1:1',
  releaseNotes: {
    en_US: `Updated the Frappe framework to 16.61.0. Private workspace pages are now visible only to their owner and Workspace Managers, and actions on saved records such as submitting, cancelling or renaming check permissions against the stored record.

[Full framework release notes](https://github.com/frappe/frappe/releases/tag/v16.61.0)`,
    es_ES: `Actualizado el framework Frappe a 16.61.0. Las páginas de espacio de trabajo privadas ahora solo son visibles para su propietario y los Workspace Managers, y las acciones sobre registros guardados, como enviar, cancelar o renombrar, comprueban los permisos con el registro almacenado.

[Notas completas de la versión del framework](https://github.com/frappe/frappe/releases/tag/v16.61.0)`,
    de_DE: `Frappe-Framework auf 16.61.0 aktualisiert. Private Workspace-Seiten sind jetzt nur noch für ihren Eigentümer und Workspace Manager sichtbar, und Aktionen auf gespeicherten Datensätzen wie Einreichen, Stornieren oder Umbenennen prüfen die Berechtigungen am gespeicherten Datensatz.

[Vollständige Versionshinweise des Frameworks](https://github.com/frappe/frappe/releases/tag/v16.61.0)`,
    pl_PL: `Zaktualizowano framework Frappe do 16.61.0. Prywatne strony obszarów roboczych są teraz widoczne tylko dla ich właściciela i Workspace Managerów, a działania na zapisanych rekordach, takie jak zatwierdzanie, anulowanie czy zmiana nazwy, sprawdzają uprawnienia względem zapisanego rekordu.

[Pełne informacje o wydaniu frameworka](https://github.com/frappe/frappe/releases/tag/v16.61.0)`,
    fr_FR: `Mise à jour du framework Frappe vers 16.61.0. Les pages d'espace de travail privées ne sont désormais visibles que par leur propriétaire et les Workspace Managers, et les actions sur les enregistrements sauvegardés, comme la soumission, l'annulation ou le renommage, vérifient les permissions par rapport à l'enregistrement stocké.

[Notes de version complètes du framework](https://github.com/frappe/frappe/releases/tag/v16.61.0)`,
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
