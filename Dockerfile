FROM frappe/build:version-16@sha256:0920ea61bfd96ab4b6b5d317163faeb2057088e405973c92afc91504c71bf4ef AS builder

ARG FRAPPE_COMMIT=8b19f8c8e334b48e14ecee7231a1a98774c2ebd5
ARG TELEPHONY_COMMIT=99c0c3b2cbd70246ed33295ebe8548e2ddded17d
ARG HELPDESK_COMMIT=68d00645de26fa28fdb2e511785be7c1bc0e6a71

USER frappe

# bench clones only by branch or tag, so each app is fetched at its commit onto a local `pinned` branch.
RUN set -e; \
    for pin in frappe=${FRAPPE_COMMIT} telephony=${TELEPHONY_COMMIT} helpdesk=${HELPDESK_COMMIT}; do \
      app=${pin%%=*}; src=/home/frappe/src/$app; \
      git init -q "$src"; \
      git -C "$src" remote add origin "https://github.com/frappe/$app.git"; \
      git -C "$src" fetch -q --depth 1 origin "${pin#*=}"; \
      git -C "$src" checkout -q -b pinned FETCH_HEAD; \
    done

COPY --chown=frappe:0 apps.json /opt/frappe/apps.json

# Cached Frappe assets omit the frontend dependencies required by Helpdesk's Studio portal.
RUN bench init \
      --apps_path=/opt/frappe/apps.json \
      --frappe-path=/home/frappe/src/frappe \
      --frappe-branch=pinned \
      --no-procfile \
      --no-backups \
      --skip-redis-config-generation \
      --skip-assets \
      --verbose \
      /home/frappe/frappe-bench \
  && cd /home/frappe/frappe-bench \
  && bench build --force \
  && echo "{}" > sites/common_site_config.json \
  && find apps -mindepth 1 -path "*/.git" | xargs rm -fr

FROM frappe/base:version-16@sha256:fb32a6cc24e4473fe7f72383e1bf1ac8bcc70e21603b3a43811765c2ab71368c AS backend

USER frappe

COPY --from=builder --chown=frappe:0 /home/frappe/frappe-bench /home/frappe/frappe-bench

WORKDIR /home/frappe/frappe-bench

# The sites volume mounts over sites/, so the built assets have to live outside it.
RUN cp -r sites/assets assets && rm -rf sites/assets

# Article keyword extraction fetches these from the internet on a scheduler tick otherwise.
RUN env/bin/python -m nltk.downloader -d /home/frappe/nltk_data \
      averaged_perceptron_tagger_eng punkt_tab brown

RUN env/bin/python -m pip install --no-cache-dir --upgrade 'certifi>=2026.10.19'
