export const DEFAULT_LANG = 'en_US'

const dict = {
  // main.ts
  'Starting Frappe Helpdesk!': 0,
  'Web Interface': 1,
  'The web interface is ready': 2,
  'The web interface is not ready': 3,
  // internal daemon readiness (display: null — never rendered, but the API requires text)
  Ready: 4,
  'Not ready': 5,
  // interfaces.ts
  'Web UI': 6,
  'The Frappe Helpdesk agent and customer portals': 7,
  // init/bootstrapHelpdesk.ts
  'Starting the database': 8,
  'Installing the Frappe framework': 9,
  'Installing the Helpdesk app': 10,
  'Migrating the database': 11,
  // init/watchCredentials.ts
  'Set the Administrator password before signing in to Frappe Helpdesk': 12,
  // actions/setAdminPassword.ts
  'Set Administrator Password': 13,
  'Generate a new random password for the Administrator account and apply it. Use this to set the first password, or if you are locked out of Frappe Helpdesk.': 14,
  'Frappe Helpdesk Administrator Credentials': 15,
  'Use these credentials to sign in to Frappe Helpdesk.': 16,
  Username: 17,
  Password: 18,
  // actions/setPrimaryUrl.ts
  Address: 19,
  'Set Primary Address': 20,
  'Choose the address Frappe Helpdesk puts in the links it emails — ticket updates, agent invitations and customer portal links. A local address works for testing, but only a domain or Tor address is reachable for people outside your network.': 21,
  // init/watchPrimaryUrl.ts
  'Primary Address Changed': 22,
  'The address Frappe Helpdesk put in the links it emails is no longer available, so it has fallen back to a local one. Links sent from now on will only work on your own network until you choose another address.': 23,
  // actions/manageSmtp.ts
  'Configure Email (SMTP)': 24,
  'Choose how Frappe Helpdesk sends outgoing mail — agent invitations, notifications and password resets. Use the StartOS system SMTP server, your own provider, or turn it off. Receiving mail as tickets is set up inside Helpdesk under Settings, and a mailbox configured there takes precedence over this one.': 25,
} as const

/**
 * Plumbing. DO NOT EDIT.
 */
export type I18nKey = keyof typeof dict
export type LangDict = Record<(typeof dict)[I18nKey], string>
export default dict
