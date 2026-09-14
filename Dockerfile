ARG FRAPPE_BRANCH=version-15

FROM frappe/build:${FRAPPE_BRANCH} AS builder

ARG FRAPPE_BRANCH

USER frappe

COPY --chown=frappe:frappe apps.json /opt/frappe/apps.json

RUN bench init \
      --apps_path=/opt/frappe/apps.json \
      --frappe-branch=${FRAPPE_BRANCH} \
      --no-procfile \
      --no-backups \
      --skip-redis-config-generation \
      --verbose \
      /home/frappe/frappe-bench \
  && cd /home/frappe/frappe-bench \
  && echo "{}" > sites/common_site_config.json \
  && find apps -mindepth 1 -path "*/.git" | xargs rm -fr

# start9_support is a subdirectory of the private support-server repository (the submodule), which
# `bench get-app` cannot install, so this does what get-app does: copy it into apps/, install it
# into the env, link its assets. The portal it serves is built from the same commit's web/.
COPY --chown=frappe:frappe support-server/start9_support /home/frappe/frappe-bench/apps/start9_support
COPY --chown=frappe:frappe support-server/web /home/frappe/support-server/web
RUN cd /home/frappe/frappe-bench \
  && env/bin/pip install --quiet -e apps/start9_support \
  && ln -s /home/frappe/frappe-bench/apps/start9_support/start9_support/public sites/assets/start9_support \
  && PORTAL_SRC=/home/frappe/support-server/web apps/start9_support/scripts/build-portal.sh \
  && rm -rf /home/frappe/support-server

FROM frappe/base:${FRAPPE_BRANCH} AS backend

USER frappe

COPY --from=builder --chown=frappe:frappe /home/frappe/frappe-bench /home/frappe/frappe-bench

WORKDIR /home/frappe/frappe-bench

# The sites volume mounts over sites/, so the built assets have to live outside it.
RUN cp -r sites/assets assets && rm -rf sites/assets

# The portal loads its Taiga icons from /assets/taiga-ui, which nginx serves from here and never proxies.
RUN ln -s /home/frappe/frappe-bench/apps/start9_support/start9_support/public/portal/assets/taiga-ui assets/taiga-ui

# The socket.io proxy has to name this nginx, not the browser's host; see nginx/frappe.conf.template.
COPY nginx/frappe.conf.template /templates/nginx/frappe.conf.template

# Article keyword extraction fetches these from the internet on a scheduler tick otherwise.
RUN env/bin/python -m nltk.downloader -d /home/frappe/nltk_data \
      averaged_perceptron_tagger_eng punkt_tab brown
