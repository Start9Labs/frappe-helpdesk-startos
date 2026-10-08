import { sdk } from './sdk'

// A volume copy, not a dump: StartOS stops the service for a backup, so MariaDB's files are at rest.
export const { createBackup, restoreInit } = sdk.setupBackups(async () =>
  sdk.Backups.ofVolumes('db', 'sites', 'main'),
)
