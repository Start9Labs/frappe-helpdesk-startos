import { i18n } from './i18n'
import { primaryUrl } from './primaryUrl'
import { sdk } from './sdk'
import { uiInterfaceId, uiMultiHostId, uiPath, uiPort } from './utils'

export const setInterfaces = sdk.setupInterfaces(async ({ effects }) => {
  const uiMulti = sdk.MultiHost.of(effects, uiMultiHostId)
  const uiMultiOrigin = await uiMulti.bindPort(uiPort, {
    protocol: 'http',
  })

  const ui = sdk.createInterface(effects, {
    name: i18n('Web UI'),
    id: uiInterfaceId,
    description: i18n('The Frappe Helpdesk agent and customer portals'),
    type: 'ui',
    masked: false,
    schemeOverride: null,
    username: null,
    path: uiPath,
    query: {},
    preferredLauncherAddress: await primaryUrl.bestUsable(effects).const(),
  })

  const uiReceipt = await uiMultiOrigin.export([ui])

  return [uiReceipt]
})
