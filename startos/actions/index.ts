import { sdk } from '../sdk'
import { manageSmtp } from './manageSmtp'
import { setAdminPassword } from './setAdminPassword'
import { setPrimaryUrl } from './setPrimaryUrl'

export const actions = sdk.Actions.of()
  .addAction(setAdminPassword)
  .addAction(setPrimaryUrl)
  .addAction(manageSmtp)
