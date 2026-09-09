import { smtpPrefill } from '@start9labs/start-sdk'
import { storeJson } from '../fileModels/store.json'
import { i18n } from '../i18n'
import { sdk } from '../sdk'

const { InputSpec } = sdk

export const inputSpec = InputSpec.of({
  smtp: sdk.inputSpecConstants.smtpInputSpec,
})

export const manageSmtp = sdk.Action.withInput(
  'manage-smtp',

  async () => ({
    name: i18n('Configure Email (SMTP)'),
    description: i18n(
      'Choose how Frappe Helpdesk sends outgoing mail — agent invitations, notifications and password resets. Use the StartOS system SMTP server, your own provider, or turn it off. Receiving mail as tickets is set up inside Helpdesk under Settings, and a mailbox configured there takes precedence over this one.',
    ),
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),

  inputSpec,

  async ({ effects }) => ({
    smtp: smtpPrefill(await storeJson.read((s) => s.smtp).const(effects)),
  }),

  async ({ effects, input }) => storeJson.merge(effects, { smtp: input.smtp }),
)
