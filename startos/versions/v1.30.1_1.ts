import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'
import { storeJson } from '../fileModels/store.json'
import { uiPath } from '../utils'

export const v_1_30_1_1 = VersionInfo.of({
  version: '1.30.1:1',
  releaseNotes: {
    en_US: `Initial release for StartOS

- Open UI opens Frappe Helpdesk at its primary address.
- Set Administrator Password asks for confirmation before replacing an existing password.
- While no primary address is chosen, or the chosen one is unavailable, a task asks you to choose one. Meanwhile Frappe Helpdesk uses a public domain if it has one, otherwise its local address, and it returns to your choice when that address comes back.
- When only the port of the primary address changes, as after a restore, Frappe Helpdesk keeps it at its new port.`,
    es_ES: `Lanzamiento inicial para StartOS

- Abrir interfaz abre Frappe Helpdesk en su dirección principal.
- Establecer la contraseña de Administrator pide confirmación antes de sustituir una contraseña existente.
- Mientras no haya una dirección principal elegida, o la elegida no esté disponible, una tarea te pide elegir una. Mientras tanto, Frappe Helpdesk usa un dominio público si lo tiene, o si no su dirección local, y vuelve a tu elección cuando esa dirección regresa.
- Cuando solo cambia el puerto de la dirección principal, como tras una restauración, Frappe Helpdesk la conserva en su nuevo puerto.`,
    de_DE: `Erstveröffentlichung für StartOS

- „Oberfläche öffnen“ öffnet Frappe Helpdesk unter seiner primären Adresse.
- „Administrator-Passwort festlegen“ fragt nach einer Bestätigung, bevor ein bestehendes Passwort ersetzt wird.
- Solange keine primäre Adresse gewählt oder die gewählte nicht verfügbar ist, fordert eine Aufgabe Sie auf, eine zu wählen. Bis dahin verwendet Frappe Helpdesk eine öffentliche Domain, falls vorhanden, sonst seine lokale Adresse, und kehrt zu Ihrer Wahl zurück, sobald diese Adresse wieder verfügbar ist.
- Ändert sich nur der Port der primären Adresse, etwa nach einer Wiederherstellung, behält Frappe Helpdesk sie auf dem neuen Port bei.`,
    pl_PL: `Pierwsze wydanie dla StartOS

- „Otwórz interfejs” otwiera Frappe Helpdesk pod jego adresem głównym.
- „Ustaw hasło Administratora” prosi o potwierdzenie przed zastąpieniem istniejącego hasła.
- Dopóki nie wybrano adresu głównego lub wybrany jest niedostępny, zadanie prosi o wybranie adresu. W tym czasie Frappe Helpdesk używa domeny publicznej, jeśli ją ma, a w przeciwnym razie adresu lokalnego, i wraca do Twojego wyboru, gdy ten adres znów jest dostępny.
- Gdy zmienia się tylko port adresu głównego, na przykład po przywróceniu, Frappe Helpdesk zachowuje go na nowym porcie.`,
    fr_FR: `Version initiale pour StartOS

- Ouvrir l'interface ouvre Frappe Helpdesk sur son adresse principale.
- Définir le mot de passe Administrator demande une confirmation avant de remplacer un mot de passe existant.
- Tant qu'aucune adresse principale n'est choisie, ou que celle choisie est indisponible, une tâche vous demande d'en choisir une. Entre-temps, Frappe Helpdesk utilise un domaine public s'il en a un, sinon son adresse locale, et revient à votre choix lorsque cette adresse réapparaît.
- Lorsque seul le port de l'adresse principale change, par exemple après une restauration, Frappe Helpdesk la conserve sur son nouveau port.`,
  },
  migrations: {
    up: async ({ effects }) => {
      const stored = await storeJson.read((s) => s.primaryUrl).once()
      if (stored && URL.canParse(stored) && new URL(stored).pathname === '/')
        await storeJson.merge(effects, {
          primaryUrl: new URL(stored).origin + uiPath,
        })
    },
    down: IMPOSSIBLE,
  },
})
