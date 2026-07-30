# @grafana/serviceaccounts

Service accounts feature module extracted from the Grafana app (`public/app/features/serviceaccounts`).

Exports the service accounts pages (list, create, detail), their redux reducers, and the types used by them.

App-specific services (contextSrv, Page chrome, role pickers, resource permissions) are injected by the host app via `setServiceAccountsDeps` — see `public/app/features/serviceaccounts/index.ts` in the Grafana app for the wiring.
