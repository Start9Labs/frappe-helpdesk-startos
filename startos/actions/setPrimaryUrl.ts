import { storeJson } from '../fileModels/store.json'
import { i18n } from '../i18n'
import { sdk } from '../sdk'
import { getOrigins } from '../utils'

const { InputSpec, Value } = sdk

export const inputSpec = InputSpec.of({
  url: Value.dynamicSelect(async ({ effects }) => ({
    name: i18n('Address'),
    values: (await getOrigins(effects)).reduce(
      (obj, url) => ({ ...obj, [url]: url }),
      {} as Record<string, string>,
    ),
    default: '',
  })),
})

export const setPrimaryUrl = sdk.Action.withInput(
  'set-primary-url',

  async () => ({
    name: i18n('Set Primary Address'),
    description: i18n(
      'Choose the address Frappe Helpdesk puts in the links it emails — ticket updates, agent invitations and customer portal links. A local address works for testing, but only a domain or Tor address is reachable for people outside your network.',
    ),
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),

  inputSpec,

  async ({ effects }) => ({
    url:
      (await storeJson.read((s) => s.primaryUrl).const(effects)) || undefined,
  }),

  async ({ effects, input }) =>
    storeJson.merge(effects, { primaryUrl: input.url }),
)
