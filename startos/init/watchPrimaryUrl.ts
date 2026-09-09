import { storeJson } from '../fileModels/store.json'
import { i18n } from '../i18n'
import { sdk } from '../sdk'
import { getOrigins } from '../utils'

export const watchPrimaryUrl = sdk.setupOnInit(async (effects) => {
  const available = await getOrigins(effects)
  const primaryUrl = await storeJson.read((s) => s.primaryUrl).const(effects)

  if (primaryUrl && available.includes(primaryUrl)) return

  const fallback =
    available.find((u) => u.includes('.local')) ?? available.at(0)
  if (!fallback) return

  // The write re-runs this handler, which then takes the early return — so the notice fires once.
  await storeJson.merge(
    effects,
    { primaryUrl: fallback },
    { allowWriteAfterConst: true },
  )

  if (primaryUrl)
    await sdk.notification.create(effects, {
      level: 'warning',
      title: i18n('Primary Address Changed'),
      message: i18n(
        'The address Frappe Helpdesk put in the links it emails is no longer available, so it has fallen back to a local one. Links sent from now on will only work on your own network until you choose another address.',
      ),
    })
})
