# @grafana/support-bundles

The Grafana support bundles feature module, extracted from `public/app/features/support-bundles/`.

Contains the support bundles types, redux state (reducers + thunk actions), and presentational
components for listing and creating support bundles. App-specific wiring (page chrome, redux
`connect`, permission checks via `contextSrv`) stays in thin shims under
`public/app/features/support-bundles/`.
