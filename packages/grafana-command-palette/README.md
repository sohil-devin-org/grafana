# @grafana/command-palette

The Grafana command palette (Ctrl+K / Cmd+K) engine and UI, built on [kbar](https://github.com/timc1/kbar).

The package owns the palette dialog, search input, result rendering, keyboard navigation and analytics
instrumentation. App-specific action sources (static navigation actions, recent/searched dashboards,
scopes, deep search) are injected by the host application through the `CommandPaletteExtensions`
extension point:

```tsx
import { CommandPalette, type CommandPaletteExtensions } from '@grafana/command-palette';

const extensions: CommandPaletteExtensions = {
  /* hooks providing actions and search results */
};

<CommandPalette extensions={extensions} />;
```

The component must be rendered inside a kbar `KBarProvider`.
