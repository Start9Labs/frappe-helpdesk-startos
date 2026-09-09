import { setupManifest } from '@start9labs/start-sdk'
import { long, short } from './i18n'

export const manifest = setupManifest({
  id: 'frappe-helpdesk',
  title: 'Frappe Helpdesk',
  license: 'AGPL-3.0',
  packageRepo: 'https://github.com/Start9Labs/frappe-helpdesk-startos',
  upstreamRepo: 'https://github.com/frappe/helpdesk',
  marketingUrl: 'https://frappe.io/helpdesk',
  donationUrl: null,
  description: { short, long },
  volumes: ['main', 'sites', 'db'],
  images: {
    helpdesk: {
      source: { dockerBuild: {} },
      arch: ['x86_64', 'aarch64'],
    },
    mariadb: {
      source: { dockerTag: 'mariadb:11.8.8' },
      arch: ['x86_64', 'aarch64'],
    },
    redis: {
      source: { dockerTag: 'redis:8.6-alpine' },
      arch: ['x86_64', 'aarch64'],
    },
  },
  dependencies: {},
})
