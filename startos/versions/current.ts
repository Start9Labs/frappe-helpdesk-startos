import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '16.1.0:0',
  releaseNotes: {
    en_US: `Updated Frappe Helpdesk to 16.1.0.

- SLA working hours now support an optional break per workday. SLA timers pause during the break; open tickets pick up changed breaks when next updated.
- Working hours follow the system time format, and the settings Save button stays visible on narrow screens.

Requires StartOS 0.4.1 or later.

[Full upstream release notes](https://github.com/frappe/helpdesk/releases/tag/v16.1.0)`,
    es_ES: `Actualizado Frappe Helpdesk a 16.1.0.

- El horario de los SLA admite una pausa opcional por día laboral. Los temporizadores se detienen durante la pausa; los tickets abiertos incorporan los cambios en su próxima actualización.
- El horario respeta el formato de hora del sistema y el botón Guardar de los ajustes sigue visible en pantallas estrechas.

Requiere StartOS 0.4.1 o posterior.

[Notas completas de la versión original](https://github.com/frappe/helpdesk/releases/tag/v16.1.0)`,
    de_DE: `Frappe Helpdesk auf 16.1.0 aktualisiert.

- SLA-Arbeitszeiten unterstützen eine optionale Pause pro Arbeitstag. SLA-Zähler pausieren währenddessen; offene Tickets übernehmen geänderte Pausen bei ihrer nächsten Aktualisierung.
- Arbeitszeiten verwenden das Zeitformat des Systems; die Speichern-Schaltfläche der Einstellungen bleibt auf schmalen Bildschirmen sichtbar.

Erfordert StartOS 0.4.1 oder neuer.

[Vollständige Upstream-Versionshinweise](https://github.com/frappe/helpdesk/releases/tag/v16.1.0)`,
    pl_PL: `Zaktualizowano Frappe Helpdesk do 16.1.0.

- Godziny pracy SLA obsługują opcjonalną przerwę w każdym dniu roboczym. Liczniki SLA zatrzymują się na czas przerwy; otwarte zgłoszenia uwzględniają zmienione przerwy przy następnej aktualizacji.
- Godziny pracy używają systemowego formatu czasu, a przycisk zapisu ustawień pozostaje widoczny na wąskich ekranach.

Wymaga StartOS 0.4.1 lub nowszego.

[Pełne informacje o wydaniu projektu](https://github.com/frappe/helpdesk/releases/tag/v16.1.0)`,
    fr_FR: `Mise à jour de Frappe Helpdesk vers 16.1.0.

- Les horaires des SLA permettent une pause facultative par jour ouvré. Les compteurs SLA s'arrêtent pendant la pause ; les tickets ouverts prennent en compte les pauses modifiées lors de leur prochaine mise à jour.
- Les horaires suivent le format horaire du système et le bouton d'enregistrement des paramètres reste visible sur les écrans étroits.

Nécessite StartOS 0.4.1 ou une version ultérieure.

[Notes de version complètes du projet](https://github.com/frappe/helpdesk/releases/tag/v16.1.0)`,
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
