---
name: testing-grafana-dev
description: How to build, run, and browser-test the Grafana local dev environment (gdev datasources, dev dashboards, admin login).
---

# Testing the Grafana local dev environment

## Setup
- Activate toolchain: `eval "$(~/.local/bin/mise activate bash)"` (Go + Node pinned via mise).
- Frontend: `yarn install --immutable` then `yarn build` (production assets) or `yarn start` (dev watch).
- Backend: `make build-backend` produces `./bin/grafana`; run `./bin/grafana server` (serves on localhost:3000).
- Provision dev data: `./devenv/setup.sh` creates gdev datasources + "gdev dashboards" folder (provisioned, read-only).

## Login
- admin/admin at http://localhost:3000. A "Update your password" screen may appear — click **Skip**.

## Golden-path checks
- Dashboards → "gdev dashboards" folder should contain many dashboards. Dashboards backed by `gdev-testdata` (e.g. "Panel Tests - Graph NG") render data with no external services running.
- Dashboards for other datasources (elasticsearch, loki, mssql, prometheus...) need `make devenv sources=...` backing services and will show errors otherwise — don't treat that as a failure of the environment.
- Connections → Data sources should list ~30 `gdev-*` entries; `gdev-testdata` is the default.
- Panel edit: panel menu → Edit; change Title in Panel options — the panel header updates live. Use Discard to avoid modifying provisioned dashboards (saves to provisioned dashboards may be rejected/read-only anyway).

## Gotchas
- Grafana uses embedded SQLite; no DB setup needed.
- First backend build is slow (~minutes); frontend production build also takes several minutes.

## Devin Secrets Needed
- None for the golden path.
