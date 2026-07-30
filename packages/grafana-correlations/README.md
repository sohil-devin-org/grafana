# @grafana/correlations

The Grafana correlations feature module: the correlations settings page (list + add/edit wizard) and the
utilities used to enrich data frames with correlation data links.

Extracted from `public/app/features/correlations/` as part of the monolith decomposition effort.
App-specific wiring (page chrome, permissions, explore/redux glue) stays in
`public/app/features/correlations/`, which consumes this package.
