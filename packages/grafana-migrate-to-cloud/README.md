# @grafana/migrate-to-cloud

The Grafana "Migrate to Cloud" feature module (`/admin/migrate-to-cloud`), extracted from
`public/app/features/migrate-to-cloud` as part of the monolith decomposition effort.

This package is private and not published to NPM. It is consumed by the Grafana app through
the `@grafana-app/source` export condition.

App-specific services (folder API facade, app notifications, date formatting, local plugin
listing) are injected by the app-side shim in `public/app/features/migrate-to-cloud/` via
`setMigrateToCloudDependencies()`.
