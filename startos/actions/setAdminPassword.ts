import { utils } from '@start9labs/start-sdk'
import { storeJson } from '../fileModels/store.json'
import { i18n } from '../i18n'
import { sdk } from '../sdk'
import {
  bench,
  getHelpdeskSub,
  getMariadbEnv,
  getMariadbSub,
  mariadbFlags,
  mariadbReady,
  siteName,
} from '../utils'

const SET_PASSWORD_TIMEOUT = 300_000

export const setAdminPassword = sdk.Action.withoutInput(
  'set-admin-password',

  async () => ({
    name: i18n('Set Administrator Password'),
    description: i18n(
      'Generate a new random password for the Administrator account and apply it. Use this to set the first password, or if you are locked out of Frappe Helpdesk.',
    ),
    warning: null,
    allowedStatuses: 'only-stopped',
    group: null,
    visibility: 'enabled',
  }),

  async ({ effects }) => {
    const store = await storeJson.read().const(effects)
    if (!store?.dbRootPassword) {
      throw new Error(
        'Frappe Helpdesk is not initialized yet, so there is no account to set a password on.',
      )
    }

    const adminPassword = utils.getDefaultString({
      charset: 'a-z,A-Z,0-9',
      len: 24,
    })

    const mariadbSub = getMariadbSub(effects, 'mariadb-set-password')

    await sdk.Daemons.of(effects)
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
      .addOneshot('set-password', {
        subcontainer: getHelpdeskSub(effects, 'bench-set-password'),
        exec: {
          command: bench(
            `bench --site ${siteName} set-admin-password "$NEW_ADMIN_PASSWORD"`,
          ),
          env: { NEW_ADMIN_PASSWORD: adminPassword },
        },
        requires: ['mariadb'],
      })
      .runUntilSuccess(SET_PASSWORD_TIMEOUT)

    await storeJson.merge(effects, { adminPassword })

    return {
      version: '1',
      title: i18n('Frappe Helpdesk Administrator Credentials'),
      message: i18n('Use these credentials to sign in to Frappe Helpdesk.'),
      result: {
        type: 'group',
        value: [
          {
            type: 'single',
            name: i18n('Username'),
            description: null,
            value: 'Administrator',
            masked: false,
            copyable: true,
            qr: false,
          },
          {
            type: 'single',
            name: i18n('Password'),
            description: null,
            value: adminPassword,
            masked: true,
            copyable: true,
            qr: false,
          },
        ],
      },
    }
  },
)
