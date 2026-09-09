import { T, utils } from '@start9labs/start-sdk'
import { storeJson } from '../fileModels/store.json'
import { i18n } from '../i18n'
import { sdk } from '../sdk'
import {
  bench,
  configuratorScript,
  dbName,
  getHelpdeskSub,
  getMariadbEnv,
  getMariadbSub,
  getRedisSub,
  getSeedSub,
  mariadbFlags,
  mariadbReady,
  redisCachePort,
  redisFlags,
  redisQueuePort,
  redisReady,
  seedSitesScript,
  siteName,
} from '../utils'

// Creating the site builds the schema and installs the Helpdesk app.
const INSTALL_TIMEOUT = 1_800_000

export const bootstrapHelpdesk = sdk.setupOnInit(
  async (effects, kind, progress) => {
    if (kind === 'update') {
      const migrating = progress.addPhase(i18n('Migrating the database'))
      migrating.start()
      await runSiteMigrate(effects)
      migrating.complete()
      return
    }
    if (kind !== 'install') return

    await createSite(effects, progress)
  },
)

async function createSite(
  effects: T.Effects,
  progress: utils.FullProgressTracker,
): Promise<void> {
  const starting = progress.addPhase(i18n('Starting the database'), 4)
  const framework = progress.addPhase(
    i18n('Installing the Frappe framework'),
    5,
  )
  const app = progress.addPhase(i18n('Installing the Helpdesk app'), 4)

  starting.start()

  const throwawayAdminPassword = utils.getDefaultString({
    charset: 'a-z,A-Z,0-9',
    len: 24,
  })
  const dbRootPassword = utils.getDefaultString({
    charset: 'a-z,A-Z,0-9',
    len: 32,
  })

  const mariadbSub = getMariadbSub(effects, 'mariadb-init')
  const cacheSub = getRedisSub(effects, 'redis-cache-init')
  const queueSub = getRedisSub(effects, 'redis-queue-init')
  const seedSub = getSeedSub(effects, 'seed-sites-init')
  const benchSub = getHelpdeskSub(effects, 'site-init')

  // Passwords go through the environment so they stay out of the process table.
  const newSite = [
    'bench new-site',
    '--mariadb-user-host-login-scope=%',
    '--db-root-password "$DB_ROOT_PASSWORD"',
    '--admin-password "$ADMIN_PASSWORD"',
    `--db-name ${dbName}`,
    '--install-app helpdesk',
    siteName,
  ].join(' ')

  await sdk.Daemons.of(effects)
    .addOneshot('seed-sites', {
      subcontainer: seedSub,
      exec: { command: ['bash', '-c', seedSitesScript], user: 'root' },
      requires: [],
    })
    .addDaemon('mariadb', {
      subcontainer: mariadbSub,
      exec: {
        command: sdk.useEntrypoint(mariadbFlags),
        env: getMariadbEnv(dbRootPassword),
      },
      ready: {
        display: null,
        gracePeriod: 120_000,
        fn: mariadbReady(mariadbSub),
      },
      requires: [],
    })
    .addDaemon('redis-cache', {
      subcontainer: cacheSub,
      exec: { command: sdk.useEntrypoint(redisFlags(redisCachePort)) },
      ready: { display: null, fn: redisReady(cacheSub, redisCachePort) },
      requires: [],
    })
    .addDaemon('redis-queue', {
      subcontainer: queueSub,
      exec: { command: sdk.useEntrypoint(redisFlags(redisQueuePort)) },
      ready: { display: null, fn: redisReady(queueSub, redisQueuePort) },
      requires: [],
    })
    .addOneshot('configurator', {
      subcontainer: benchSub,
      exec: { command: bench(configuratorScript(null)) },
      requires: ['seed-sites', 'mariadb', 'redis-cache', 'redis-queue'],
    })
    .addOneshot('new-site', {
      subcontainer: benchSub,
      exec: {
        // bench reads enable_scheduler before the site exists, so it always creates one with the scheduler off.
        command: bench(
          `${newSite} && bench use ${siteName} && bench --site ${siteName} enable-scheduler`,
        ),
        env: {
          DB_ROOT_PASSWORD: dbRootPassword,
          ADMIN_PASSWORD: throwawayAdminPassword,
        },
        ...siteProgress(starting, framework, app),
      },
      requires: ['configurator'],
    })
    .runUntilSuccess(INSTALL_TIMEOUT)

  starting.complete()
  framework.complete()
  app.complete()

  await storeJson.merge(effects, { dbRootPassword })
}

// bench's narration on stdout is the only progress the site build emits.
function siteProgress(
  starting: utils.PhaseHandle,
  framework: utils.PhaseHandle,
  app: utils.PhaseHandle,
) {
  const doctypes =
    /Updating DocTypes for (frappe|helpdesk)[^[]*\[[^\]]*\]\s*(\d+)%/g
  let stage: 'starting' | 'framework' | 'app' = 'starting'
  let tail = ''

  return {
    onStdout: (chunk: Buffer | string) => {
      process.stdout.write(chunk)

      // A marker can straddle two chunks, so match on the carry-over too.
      const text = tail + chunk
      tail = text.slice(-4096)

      if (stage === 'starting' && text.includes('Installing frappe...')) {
        stage = 'framework'
        starting.complete()
        framework.start()
      }
      if (stage === 'framework' && text.includes('Installing helpdesk...')) {
        stage = 'app'
        framework.complete()
        app.start()
      }

      const latest = [...text.matchAll(doctypes)].pop()
      if (latest) {
        const phase = latest[1] === 'frappe' ? framework : app
        phase.setTotal(100)
        phase.setDone(Number(latest[2]))
      }
    },
    // Either callback pipes all three streams, so stderr has to be drained too.
    onStderr: (chunk: Buffer | string) => process.stderr.write(chunk),
  }
}

// Runs in init, where StartOS has snapshotted the volumes, so a failed migration rolls the update back.
async function runSiteMigrate(effects: T.Effects): Promise<void> {
  const store = await storeJson.read().const(effects)
  if (!store?.dbRootPassword) return

  const mariadbSub = getMariadbSub(effects, 'mariadb-migrate')
  const cacheSub = getRedisSub(effects, 'redis-cache-migrate')
  const queueSub = getRedisSub(effects, 'redis-queue-migrate')
  const seedSub = getSeedSub(effects, 'seed-sites-migrate')
  const benchSub = getHelpdeskSub(effects, 'site-migrate')

  await sdk.Daemons.of(effects)
    .addOneshot('seed-sites', {
      subcontainer: seedSub,
      exec: { command: ['bash', '-c', seedSitesScript], user: 'root' },
      requires: [],
    })
    .addDaemon('mariadb', {
      subcontainer: mariadbSub,
      exec: {
        command: sdk.useEntrypoint(mariadbFlags),
        env: getMariadbEnv(store.dbRootPassword),
      },
      ready: {
        display: null,
        gracePeriod: 120_000,
        fn: mariadbReady(mariadbSub),
      },
      requires: [],
    })
    .addDaemon('redis-cache', {
      subcontainer: cacheSub,
      exec: { command: sdk.useEntrypoint(redisFlags(redisCachePort)) },
      ready: { display: null, fn: redisReady(cacheSub, redisCachePort) },
      requires: [],
    })
    .addDaemon('redis-queue', {
      subcontainer: queueSub,
      exec: { command: sdk.useEntrypoint(redisFlags(redisQueuePort)) },
      ready: { display: null, fn: redisReady(queueSub, redisQueuePort) },
      requires: [],
    })
    .addOneshot('configurator', {
      subcontainer: benchSub,
      exec: { command: bench(configuratorScript(null)) },
      requires: ['seed-sites', 'mariadb', 'redis-cache', 'redis-queue'],
    })
    .addOneshot('migrate', {
      subcontainer: benchSub,
      exec: { command: bench(`bench --site ${siteName} migrate`) },
      requires: ['configurator'],
    })
    .runUntilSuccess(INSTALL_TIMEOUT)
}
