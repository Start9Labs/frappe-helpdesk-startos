import { sdk } from '../sdk'
import { setDependencies } from '../dependencies'
import { setInterfaces } from '../interfaces'
import { versionGraph } from '../versions'
import { actions } from '../actions'
import { restoreInit } from '../backups'
import { bootstrapHelpdesk } from './bootstrapHelpdesk'
import { watchPrimaryUrl } from './watchPrimaryUrl'
import { watchCredentials } from './watchCredentials'

export const init = sdk.setupInit(
  restoreInit,
  versionGraph,
  setInterfaces,
  setDependencies,
  actions,
  bootstrapHelpdesk,
  watchCredentials,
  watchPrimaryUrl,
)

export const uninit = sdk.setupUninit(versionGraph)
