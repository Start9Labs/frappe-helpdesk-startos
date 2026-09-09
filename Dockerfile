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

FROM frappe/base:${FRAPPE_BRANCH} AS backend

USER frappe

COPY --from=builder --chown=frappe:frappe /home/frappe/frappe-bench /home/frappe/frappe-bench

WORKDIR /home/frappe/frappe-bench

# The sites volume mounts over sites/, so the built assets have to live outside it.
RUN cp -r sites/assets assets && rm -rf sites/assets

# Article keyword extraction fetches these from the internet on a scheduler tick otherwise.
RUN env/bin/python -m nltk.downloader -d /home/frappe/nltk_data \
      averaged_perceptron_tagger_eng punkt_tab brown
