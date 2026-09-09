import { storeJson } from './fileModels/store.json'
import { i18n } from './i18n'
import { sdk } from './sdk'
import {
  backendPort,
  bench,
  buildSmtpFields,
  configuratorScript,
  getFrontendEnv,
  getHelpdeskSub,
  getMariadbEnv,
  getMariadbSub,
  getRedisSub,
  getSeedSub,
  gunicorn,
  mariadbFlags,
  mariadbReady,
  redisCachePort,
  redisFlags,
  redisQueuePort,
  redisReady,
  resolveSmtp,
  seedSitesScript,
  smtpApplyScript,
  socketioPort,
  uiPort,
} from './utils'

// The workers and scheduler expose no port and no status endpoint to probe.
const alwaysReady = async () => ({ result: 'success' as const, message: null })

export const main = sdk.setupMain(async ({ effects }) => {
  console.info(i18n('Starting Frappe Helpdesk!'))

  const store = await storeJson.read().const(effects)
  if (!store?.dbRootPassword) {
    throw new Error(
      'Frappe Helpdesk is not initialized: no database password was stored during install.',
    )
  }

  const mariadbSub = getMariadbSub(effects)
  const cacheSub = getRedisSub(effects, 'redis-cache')
  const queueSub = getRedisSub(effects, 'redis-queue')
  const seedSub = getSeedSub(effects, 'seed-sites')
  const configuratorSub = getHelpdeskSub(effects, 'configurator')
  const backendSub = getHelpdeskSub(effects, 'backend')
  const websocketSub = getHelpdeskSub(effects, 'websocket')
  const schedulerSub = getHelpdeskSub(effects, 'scheduler')
  const queueShortSub = getHelpdeskSub(effects, 'queue-short')
  const queueLongSub = getHelpdeskSub(effects, 'queue-long')
  const frontendSub = getHelpdeskSub(effects, 'frontend')
  const smtpSub = getHelpdeskSub(effects, 'smtp')

  const smtp = await resolveSmtp(effects, store.smtp)

  return (
    sdk.Daemons.of(effects)
      .addOneshot('seed-sites', {
        subcontainer: seedSub,
        exec: {
          command: ['bash', '-c', seedSitesScript],
          user: 'root',
        },
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
        exec: {
          command: sdk.useEntrypoint(redisFlags(redisCachePort)),
        },
        ready: {
          display: null,
          fn: redisReady(cacheSub, redisCachePort),
        },
        requires: [],
      })
      .addDaemon('redis-queue', {
        subcontainer: queueSub,
        exec: {
          command: sdk.useEntrypoint(redisFlags(redisQueuePort)),
        },
        ready: {
          display: null,
          fn: redisReady(queueSub, redisQueuePort),
        },
        requires: [],
      })
      .addOneshot('configurator', {
        subcontainer: configuratorSub,
        exec: { command: bench(configuratorScript(store.primaryUrl ?? null)) },
        requires: ['seed-sites', 'mariadb', 'redis-cache', 'redis-queue'],
      })
      // Nothing requires this, so a bad relay cannot hold up the service.
      .addOneshot('smtp', {
        subcontainer: smtpSub,
        exec: {
          command: bench(smtpApplyScript),
          env: {
            SMTP_FIELDS: smtp ? JSON.stringify(buildSmtpFields(smtp)) : '',
          },
        },
        requires: ['configurator'],
      })
      .addDaemon('backend', {
        subcontainer: backendSub,
        exec: { command: gunicorn },
        ready: {
          display: null,
          gracePeriod: 120_000,
          fn: () =>
            sdk.healthCheck.checkPortListening(effects, backendPort, {
              successMessage: i18n('Ready'),
              errorMessage: i18n('Not ready'),
            }),
        },
        requires: ['configurator'],
      })
      .addDaemon('websocket', {
        subcontainer: websocketSub,
        exec: {
          command: [
            'node',
            '/home/frappe/frappe-bench/apps/frappe/socketio.js',
          ],
        },
        ready: {
          display: null,
          gracePeriod: 60_000,
          fn: () =>
            sdk.healthCheck.checkPortListening(effects, socketioPort, {
              successMessage: i18n('Ready'),
              errorMessage: i18n('Not ready'),
            }),
        },
        requires: ['configurator'],
      })
      .addDaemon('scheduler', {
        subcontainer: schedulerSub,
        exec: { command: bench('bench schedule') },
        ready: { display: null, fn: alwaysReady },
        requires: ['backend'],
      })
      .addDaemon('queue-short', {
        subcontainer: queueShortSub,
        exec: { command: bench('bench worker --queue short,default') },
        ready: { display: null, fn: alwaysReady },
        requires: ['backend'],
      })
      .addDaemon('queue-long', {
        subcontainer: queueLongSub,
        exec: { command: bench('bench worker --queue long,default,short') },
        ready: { display: null, fn: alwaysReady },
        requires: ['backend'],
      })
      .addDaemon('frontend', {
        subcontainer: frontendSub,
        exec: {
          command: ['nginx-entrypoint.sh'],
          env: getFrontendEnv(),
        },
        ready: {
          display: i18n('Web Interface'),
          gracePeriod: 60_000,
          fn: () =>
            sdk.healthCheck.checkPortListening(effects, uiPort, {
              successMessage: i18n('The web interface is ready'),
              errorMessage: i18n('The web interface is not ready'),
            }),
        },
        requires: ['backend', 'websocket'],
      })
  )
})
