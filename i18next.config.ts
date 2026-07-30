import { defineConfig } from 'i18next-cli';

export default defineConfig({
  locales: ['en-US'], // Only en-US is updated - Crowdin will PR with other languages
  extract: {
    ignore: [
      'public/lib/monaco/**/*',
      'public/app/extensions/**/*',
      'public/app/plugins/datasource/**/*',
      'packages/*/dist/**/*',
      '**/node_modules/**/*',
    ],
    input: [
      'public/**/*.{tsx,ts}',
      'packages/grafana-ui/**/*.{tsx,ts}',
      'packages/grafana-data/**/*.{tsx,ts}',
      'packages/grafana-auth-config/**/*.{tsx,ts}',
      'packages/grafana-bookmarks/**/*.{tsx,ts}',
      'packages/grafana-command-palette/**/*.{tsx,ts}',
      'packages/grafana-correlations/**/*.{tsx,ts}',
      'packages/grafana-migrate-to-cloud/**/*.{tsx,ts}',
      'packages/grafana-serviceaccounts/**/*.{tsx,ts}',
      'packages/grafana-support-bundles/**/*.{tsx,ts}',
      'packages/grafana-teams/**/*.{tsx,ts}',
    ],
    output: 'public/locales/{{language}}/{{namespace}}.json',
    defaultNS: 'grafana',
    functions: ['t', '*.t'],
    transComponents: ['Trans'],
    warnOnConflicts: 'error',
  },
});
