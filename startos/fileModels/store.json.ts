import { FileHelper, smtpShape, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

const shape = z.looseObject({
  // Minted and applied by the Set Administrator Password action; absent until it runs.
  adminPassword: z.string().optional().catch(undefined),
  // Internal only; bench needs it to create the site and to run schema migrations.
  dbRootPassword: z.string().optional().catch(undefined),
  // The Set Primary Address choice, a ui URL; frappe gets its origin. Absent until chosen.
  primaryUrl: z.string().optional().catch(undefined),
  // .catch() makes a missing or corrupt value read as "no email".
  smtp: smtpShape.catch({ selection: 'disabled', value: {} }),
})

export const storeJson = FileHelper.json(
  { base: sdk.volumes.main, subpath: 'store.json' },
  shape,
)
