# @grafana/teams

Teams management feature module extracted from the Grafana app (`public/app/features/teams`).

The package is app-agnostic: everything it needs from the Grafana app shell (contextSrv, Page
chrome, role picker components, notifications, nav index, etc.) is provided through a small
dependency-injection registry. The app wires these in via
`public/app/features/teams/index.ts` (see `setTeamsDependencies`).
