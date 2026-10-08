import { storeJson } from './fileModels/store.json'
import { i18n } from './i18n'
import { sdk } from './sdk'
import { uiInterfaceId, uiMultiHostId } from './utils'

export const primaryUrl = sdk.setupPrimaryUrl({
  id: 'set-primary-url',
  hostId: uiMultiHostId,
  interfaceId: uiInterfaceId,
  metadata: {
    name: i18n('Set Primary Address'),
    description: i18n(
      'Choose the address Frappe Helpdesk puts in the links it emails — ticket updates, agent invitations and customer portal links. A local address works for testing, but only a domain or Tor address is reachable for people outside your network.',
    ),
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  },
  field: { name: i18n('Address'), description: null },
  get: storeJson.read((s) => s.primaryUrl),
  set: (effects, url) => storeJson.merge(effects, { primaryUrl: url }),
})
