# @grafana/auth-config

Authentication configuration UI for Grafana (`/admin/authentication`), extracted from
`public/app/features/auth-config` as part of the monolith decomposition effort.

The package is app-agnostic: app-specific services (Page chrome, notifications, contextSrv,
FormPrompt, branding badges) are injected at boot via `setAuthConfigDeps` — see
`public/app/features/auth-config/index.ts` in the Grafana app for the wiring shim.
