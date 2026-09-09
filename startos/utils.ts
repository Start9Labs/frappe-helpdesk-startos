import { SmtpSelection, T } from '@start9labs/start-sdk'
import { sdk } from './sdk'

// Subcontainers share one network namespace, so no two of these may collide.
export const uiPort = 8080
export const backendPort = 8000
export const socketioPort = 9000
export const dbPort = 3306
export const redisCachePort = 6379
export const redisQueuePort = 6380

// FRAPPE_SITE_NAME_HEADER pins nginx to this site whatever Host header arrives.
export const siteName = 'helpdesk.localhost'

export const uiMultiHostId = 'ui-multi'
export const uiInterfaceId = 'ui'

// Origins only: frappe appends its own paths to host_name, and the interface carries `/helpdesk`.
export const getOrigins = (effects: T.Effects): Promise<string[]> =>
  sdk.host
    .getOwn(effects, uiMultiHostId, (host) => {
      const iface =
        host &&
        Object.values(host.bindings)
          .flatMap((b) => Object.values(b.interfaces))
          .find((i) => i.id === uiInterfaceId)
      if (!iface) return []
      return [
        ...new Set(
          iface.addressInfo.nonLocal.format('url').map((u) => u.origin),
        ),
      ]
    })
    .const()

export const benchDir = '/home/frappe/frappe-bench'
export const sitesDir = `${benchDir}/sites`
export const dbDir = '/var/lib/mysql'

// uid:gid of the `frappe` user inside the image.
export const frappeOwner = '1000:1000'

export const sitesMount = sdk.Mounts.of().mountVolume({
  volumeId: 'sites',
  subpath: null,
  mountpoint: sitesDir,
  readonly: false,
})

export const dbMount = sdk.Mounts.of().mountVolume({
  volumeId: 'db',
  subpath: null,
  mountpoint: dbDir,
  readonly: false,
})

export const getHelpdeskSub = (effects: T.Effects, name: string) =>
  sdk.SubContainer.of(effects, { imageId: 'helpdesk' }, sitesMount, name)

// Must differ from sitesDir: mounting the volume over its own path hides the image's copy.
export const seedMountpoint = '/seed'

export const getSeedSub = (effects: T.Effects, name: string) =>
  sdk.SubContainer.of(
    effects,
    { imageId: 'helpdesk' },
    sdk.Mounts.of().mountVolume({
      volumeId: 'sites',
      subpath: null,
      mountpoint: seedMountpoint,
      readonly: false,
    }),
    name,
  )

// StartOS volumes start empty, so the image's sites/ skeleton has to be copied in, and the
// assets the image builds outside the volume have to be linked back into it for nginx.
export const seedSitesScript = [
  `cp -rn ${sitesDir}/. ${seedMountpoint}/ 2>/dev/null || true`,
  `chown -R ${frappeOwner} ${seedMountpoint}`,
  `ln -sfn ${benchDir}/assets ${seedMountpoint}/assets`,
  `chown -h ${frappeOwner} ${seedMountpoint}/assets`,
].join('; ')

export const getMariadbSub = (effects: T.Effects, name = 'mariadb') =>
  sdk.SubContainer.of(effects, { imageId: 'mariadb' }, dbMount, name)

export const getRedisSub = (effects: T.Effects, name: string) =>
  sdk.SubContainer.of(effects, { imageId: 'redis' }, sdk.Mounts.of(), name)

// bench resolves apps and sites relative to the bench directory.
export const bench = (script: string): [string, ...string[]] => [
  'bash',
  '-c',
  `cd ${benchDir} && ${script}`,
]

export const gunicorn: [string, ...string[]] = [
  `${benchDir}/env/bin/gunicorn`,
  `--chdir=${sitesDir}`,
  `--bind=127.0.0.1:${backendPort}`,
  '--threads=4',
  '--workers=2',
  '--worker-class=gthread',
  '--worker-tmp-dir=/dev/shm',
  '--timeout=120',
  '--preload',
  'frappe.app:application',
]

export const redisFlags = (port: number) => [
  '--port',
  String(port),
  '--bind',
  '127.0.0.1',
]

export const mariadbFlags = [
  `--bind-address=127.0.0.1`,
  `--port=${dbPort}`,
  '--character-set-server=utf8mb4',
  '--collation-server=utf8mb4_unicode_ci',
  '--skip-character-set-client-handshake',
]

export const getMariadbEnv = (rootPassword: string) => ({
  MYSQL_ROOT_PASSWORD: rootPassword,
  MARIADB_AUTO_UPGRADE: '1',
})

export const getFrontendEnv = () => ({
  BACKEND: `127.0.0.1:${backendPort}`,
  SOCKETIO: `127.0.0.1:${socketioPort}`,
  FRAPPE_SITE_NAME_HEADER: siteName,
  UPSTREAM_REAL_IP_ADDRESS: '127.0.0.1',
  UPSTREAM_REAL_IP_HEADER: 'X-Forwarded-For',
  UPSTREAM_REAL_IP_RECURSIVE: 'off',
  PROXY_READ_TIMEOUT: '120',
  CLIENT_MAX_BODY_SIZE: '50m',
})

// Re-run on every start so a restored backup never leaves stale endpoints behind.
// host_name is what frappe builds absolute links from in background jobs, where there is no request to read a Host header off.
export const configuratorScript = (primaryOrigin: string | null) =>
  [
    `ls -1 apps > sites/apps.txt`,
    `bench set-config -g db_host 127.0.0.1`,
    `bench set-config -gp db_port ${dbPort}`,
    `bench set-config -g redis_cache redis://127.0.0.1:${redisCachePort}`,
    `bench set-config -g redis_queue redis://127.0.0.1:${redisQueuePort}`,
    `bench set-config -g redis_socketio redis://127.0.0.1:${redisQueuePort}`,
    `bench set-config -gp socketio_port ${socketioPort}`,
    `bench set-config -g chromium_path /usr/bin/chromium-headless-shell`,
    ...(primaryOrigin
      ? [`bench set-config -g host_name ${primaryOrigin}`]
      : []),
  ].join(' && ')

type Sub = Awaited<ReturnType<typeof sdk.SubContainer.of>>

export const redisReady = (sub: Sub, port: number) => async () => {
  const res = await sub.exec(['redis-cli', '-p', String(port), 'ping'])
  return res.exitCode === 0
    ? { result: 'success' as const, message: null }
    : { result: 'loading' as const, message: null }
}

export const mariadbReady = (sub: Sub) => async () => {
  const res = await sub.exec([
    'healthcheck.sh',
    '--connect',
    '--innodb_initialized',
  ])
  return res.exitCode === 0
    ? { result: 'success' as const, message: null }
    : { result: 'loading' as const, message: null }
}

// Pinned; bench would otherwise generate a random database name per site.
export const dbName = 'helpdesk'

// The Email Account row this package owns; anything the user creates is left alone.
export const smtpAccountName = 'StartOS'

export const resolveSmtp = async (
  effects: T.Effects,
  smtp: SmtpSelection,
): Promise<T.SmtpValue | null> => {
  if (smtp.selection === 'system') {
    const system = await sdk.getSystemSmtp(effects).const()
    if (system && smtp.value.customFrom) system.from = smtp.value.customFrom
    return system
  }
  if (smtp.selection === 'custom') {
    const p = smtp.value.provider.value
    return {
      host: p.host,
      port: Number(p.security.value.port),
      from: p.from,
      username: p.username,
      password: p.password ?? null,
      security: p.security.selection,
    }
  }
  return null
}

// frappe's two mutually exclusive transport flags: use_tls is STARTTLS, use_ssl_for_outgoing is implicit TLS.
export const buildSmtpFields = (smtp: T.SmtpValue) => {
  const separateLogin = !!smtp.username && smtp.username !== smtp.from
  return {
    email_id: smtp.from,
    smtp_server: smtp.host,
    smtp_port: String(smtp.port),
    use_tls: smtp.security === 'starttls' ? 1 : 0,
    use_ssl_for_outgoing: smtp.security === 'tls' ? 1 : 0,
    login_id_is_different: separateLogin ? 1 : 0,
    ...(separateLogin ? { login_id: smtp.username } : {}),
    // frappe refuses to save an unauthenticated account unless this says so.
    ...(smtp.password
      ? { password: smtp.password }
      : { no_smtp_authentication: 1 }),
    enable_outgoing: 1,
    enable_incoming: 0,
    always_use_account_email_id_as_sender: 1,
  }
}

// Claimed only when no other account holds it, so a mailbox the user configures in Helpdesk is not overridden on the next start.
const defaultOutgoing = `int(not __import__("frappe").db.exists("Email Account", {"default_outgoing": 1, "name": ("!=", "${smtpAccountName}")}))`

const smtpFields = `dict(__import__("json").load(open("/tmp/smtp.json")), default_outgoing=${defaultOutgoing})`

// Disabled rather than deleted: Email Queue rows link to it, and frappe refuses to delete a linked document.
export const smtpApplyScript = [
  `if [ -n "$SMTP_FIELDS" ]; then`,
  `printf '%s' "$SMTP_FIELDS" > /tmp/smtp.json;`,
  `bench --site ${siteName} execute frappe.client.set_value`,
  `--args '["Email Account","${smtpAccountName}",${smtpFields}]'`,
  `|| bench --site ${siteName} execute frappe.client.insert`,
  `--args '[dict(${smtpFields},doctype="Email Account",email_account_name="${smtpAccountName}")]'`,
  `|| echo "[smtp] Helpdesk rejected the email settings — it tests the connection when saving an outgoing account. Mail is left unconfigured; check the credentials and that the relay is reachable, then restart." >&2;`,
  `rm -f /tmp/smtp.json;`,
  `else`,
  `bench --site ${siteName} execute frappe.client.set_value`,
  `--args '["Email Account","${smtpAccountName}",{"enable_outgoing":0,"default_outgoing":0}]' >/dev/null 2>&1 || true;`,
  `fi;`,
  `exit 0`,
].join(' ')
