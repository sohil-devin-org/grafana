# @grafana/bookmarks

Components for the Grafana bookmarks feature (pinned navigation items).

The package is presentation-only: it receives the pinned item URLs and the nav tree as props, and the app wires in its own state (redux nav tree, user preferences) via a thin shim in `public/app/features/bookmarks/`.
