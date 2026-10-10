import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '1.30.2:0',
  releaseNotes: {
    en_US:
      'Updated Frappe Helpdesk to 1.30.2. Fixes email loops from bounces and autoresponders, email HTML rendering in the customer portal, and SLA deadline timezones and time-on-hold calculations. Updated start-sdk to 3.0.4. Full release notes: https://github.com/frappe/helpdesk/releases/tag/v1.30.2',
    es_ES:
      'Frappe Helpdesk actualizado a 1.30.2. Corrige los bucles de correo causados por rebotes y respuestas automáticas, la visualización de correos HTML en el portal de clientes y las zonas horarias de los plazos SLA y los cálculos del tiempo en espera. start-sdk actualizado a 3.0.4. Notas completas: https://github.com/frappe/helpdesk/releases/tag/v1.30.2',
    de_DE:
      'Frappe Helpdesk auf 1.30.2 aktualisiert. Behebt E-Mail-Schleifen durch Unzustellbarkeitsmeldungen und automatische Antworten, die HTML-Darstellung von E-Mails im Kundenportal sowie Zeitzonen der SLA-Fristen und die Berechnung von Wartezeiten. start-sdk auf 3.0.4 aktualisiert. Vollständige Versionshinweise: https://github.com/frappe/helpdesk/releases/tag/v1.30.2',
    pl_PL:
      'Zaktualizowano Frappe Helpdesk do 1.30.2. Naprawiono pętle pocztowe powodowane przez zwroty i automatyczne odpowiedzi, wyświetlanie wiadomości HTML w portalu klienta oraz strefy czasowe terminów SLA i obliczanie czasu wstrzymania. Zaktualizowano start-sdk do 3.0.4. Pełne informacje o wydaniu: https://github.com/frappe/helpdesk/releases/tag/v1.30.2',
    fr_FR:
      'Frappe Helpdesk mis à jour vers 1.30.2. Corrige les boucles de courrier dues aux messages de rejet et aux réponses automatiques, le rendu HTML des e-mails dans le portail client, ainsi que les fuseaux horaires des échéances SLA et le calcul du temps en attente. start-sdk mis à jour vers 3.0.4. Notes complètes : https://github.com/frappe/helpdesk/releases/tag/v1.30.2',
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
