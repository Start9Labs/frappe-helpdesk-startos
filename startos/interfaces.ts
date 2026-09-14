import { i18n } from './i18n'
import { sdk } from './sdk'
import { uiPort } from './utils'

export const setInterfaces = sdk.setupInterfaces(async ({ effects }) => {
  const uiMulti = sdk.MultiHost.of(effects, 'ui-multi')
  const uiMultiOrigin = await uiMulti.bindPort(uiPort, {
    protocol: 'http',
  })

  const ui = sdk.createInterface(effects, {
    name: i18n('Web UI'),
    id: 'ui',
    description: i18n(
      'The Start9 support portal — the customer and staff chat experience.',
    ),
    type: 'ui',
    masked: false,
    schemeOverride: null,
    username: null,
    path: '/',
    query: {},
  })

  const helpdesk = sdk.createInterface(effects, {
    name: i18n('Helpdesk'),
    id: 'helpdesk',
    description: i18n(
      'The Frappe Helpdesk agent workspace — the ticket queue, replies and assignment behind the portal.',
    ),
    type: 'ui',
    masked: false,
    schemeOverride: null,
    username: null,
    path: '/helpdesk',
    query: {},
  })

  const desk = sdk.createInterface(effects, {
    name: i18n('Desk'),
    id: 'desk',
    description: i18n(
      'The Frappe admin desk — direct access to every record. For administrators.',
    ),
    type: 'ui',
    masked: false,
    schemeOverride: null,
    username: null,
    path: '/app',
    query: {},
  })

  const uiReceipt = await uiMultiOrigin.export([ui, helpdesk, desk])

  return [uiReceipt]
})
